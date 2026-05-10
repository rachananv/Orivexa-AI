import os
import shutil
import faiss
import numpy as np
from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from sentence_transformers import SentenceTransformer
from PyPDF2 import PdfReader
from datetime import datetime
from langchain_text_splitters import RecursiveCharacterTextSplitter
import random

app = FastAPI(title="Orivexa AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
DB_DIR = "db"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(DB_DIR, exist_ok=True)

# State
global_index = None
global_chunks = []
global_embedder = None
offline_pipeline = None
uploaded_files_metadata = []
activity_log = []

class ChatRequest(BaseModel):
    message: str
    session_id: str = "default"

def log_activity(title: str):
    activity_log.insert(0, {"title": title, "time": datetime.now().strftime("%I:%M %p")})

def get_offline_pipeline():
    global offline_pipeline
    if offline_pipeline is None:
        try:
            from transformers import pipeline
            # Use SmolLM2-135M-Instruct which is extremely small but acts like ChatGPT
            offline_pipeline = pipeline("text-generation", model="HuggingFaceTB/SmolLM2-135M-Instruct")
        except Exception as e:
            print("Failed to load pipeline:", e)
            offline_pipeline = "mock"
    return offline_pipeline

def process_pdf(file_path: str):
    global global_index, global_chunks, global_embedder
    try:
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted
                
        if not text:
            raise Exception("No text found in PDF")

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        chunks = text_splitter.split_text(text)
        global_chunks = chunks

        global_embedder = SentenceTransformer('all-MiniLM-L6-v2')
        embeddings = global_embedder.encode(chunks)
        
        dimension = embeddings.shape[1]
        global_index = faiss.IndexFlatL2(dimension)
        global_index.add(np.array(embeddings).astype('float32'))
        
        return True
    except Exception as e:
        print(f"Error processing PDF: {e}")
        return False

@app.post("/api/chat")
async def chat(request: ChatRequest):
    global global_index, global_chunks, global_embedder
    user_message = request.message
    
    context = ""
    if global_index is not None:
        query_embedding = global_embedder.encode([user_message]).astype('float32')
        D, I = global_index.search(query_embedding, 3)
        context = " ".join([global_chunks[i] for i in I[0] if i < len(global_chunks)])

    try:
        pipe = get_offline_pipeline()
        if pipe == "mock":
            reply = "I'm your AI tutor! I am currently running without an AI model installed. However, based on your notes: " + context[:200]
        else:
            if context:
                sys_prompt = "You are Orivexa, a helpful AI tutor. Answer the student's question accurately using ONLY the provided context if possible. Be concise."
                user_prompt = f"Context: {context[:600]}\n\nQuestion: {user_message}"
            else:
                sys_prompt = "You are Orivexa, a highly intelligent AI tutor. You are helpful, clever, and answer the student's questions clearly."
                user_prompt = user_message
                
            messages = [
                {"role": "system", "content": sys_prompt},
                {"role": "user", "content": user_prompt}
            ]
            
            prompt = pipe.tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
            res = pipe(prompt, max_new_tokens=250, max_length=None, temperature=0.7, top_p=0.9, do_sample=True)
            generated = res[0]['generated_text']
            # The model outputs the entire prompt + the answer, so we extract only the answer part
            reply = generated.split("<|im_start|>assistant\n")[-1].replace("<|im_end|>", "").strip()
            
            # fallback if split fails
            if not reply or reply == generated:
                reply = generated.replace(prompt, "").strip()
                
    except Exception as e:
        reply = f"Oops! I am having trouble processing that right now: {str(e)}"
    
    log_activity(f"Asked: '{user_message[:20]}...'")
    return {"reply": reply, "sources": []}

@app.post("/api/upload")
async def upload_file(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
        
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    success = process_pdf(file_path)
    if not success:
         raise HTTPException(status_code=500, detail="Failed to process PDF.")
    
    uploaded_files_metadata.append({"filename": file.filename, "upload_time": datetime.now().strftime("%I:%M %p")})
    log_activity(f"Uploaded '{file.filename}'")
    return {"message": "File processed successfully", "filename": file.filename}

@app.get("/api/dashboard")
async def get_dashboard():
    return {
        "documents_uploaded": len(uploaded_files_metadata),
        "recent_activity": activity_log[:5]
    }

@app.get("/api/quiz")
async def get_quiz():
    global global_index, global_chunks
    if global_index is None or not global_chunks:
        raise HTTPException(status_code=400, detail="Please upload a PDF first to generate a quiz.")
    
    # Offline Quiz Generation
    # We will pick 3 random sentences from chunks, remove a key word, and make it a multiple choice.
    quiz_data = []
    available_chunks = [c for c in global_chunks if len(c.split()) > 10]
    
    if not available_chunks:
        available_chunks = global_chunks
        
    for i in range(min(3, len(available_chunks))):
        chunk = random.choice(available_chunks)
        words = chunk.split()
        # Find a long word to blank out
        long_words = [w for w in words if len(w) > 5]
        if not long_words:
            answer = words[-1]
        else:
            answer = random.choice(long_words)
            
        question_text = " ".join(words).replace(answer, "_____")
        
        # Generate dummy options
        dummy_options = ["Photosynthesis", "Gravity", "Equation", "Hypothesis", "Mitochondria", "Algorithm", "Variable", "Theorem"]
        random.shuffle(dummy_options)
        
        options = [answer.strip(".,;:")] + dummy_options[:3]
        random.shuffle(options)
        
        quiz_data.append({
            "question": f"Fill in the blank: {question_text}...",
            "options": options,
            "answer": answer.strip(".,;:")
        })
        
    import json
    return {"quiz": json.dumps(quiz_data)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
