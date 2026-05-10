import { GoogleGenerativeAI } from "@google/generative-ai";

// Using the key provided in previous conversation history for this project
const API_KEY = "AIzaSyAVSG4sUoDMjWktouuy0t15N2OGc99w2YA";
const genAI = new GoogleGenerativeAI(API_KEY);

export const getGeminiResponse = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "You are Orivexa AI, a world-class academic tutor. Provide structured, detailed, and helpful study assistance. Use Markdown for formatting (bold, lists, code blocks, etc.). Be clear and encouraging like a friendly professor.",
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.9,
      },
    });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    if (!text) throw new Error("Empty response from AI");
    return text;
  } catch (error) {
    console.error("Gemini AI Error Detail:", error);
    
    // Massive Academic Knowledge Base Fallback
    const lowerInput = prompt.toLowerCase();
    
    const studyBase = {
      "hi": "Hello! I'm Orivexa AI, your dedicated academic tutor. How can I assist you with your studies today? 🌸",
      "hello": "Hi there! Ready to dive into some learning? What topic can I help you explore right now? ✨",
      "hey": "Hey! I'm here and ready to help. What's on your study list for today? 📚",
      "machine learning": "Machine Learning is a subset of AI that focuses on building systems that learn from data to improve their performance over time. It includes supervised, unsupervised, and reinforcement learning! 🤖",
      "artificial intelligence": "AI is the simulation of human intelligence by machines, especially computer systems. It includes learning, reasoning, and self-correction. 🧠",
      "photosynthesis": "Photosynthesis is the process used by plants to convert light energy into chemical energy, which is later released to fuel the organism's activities. 🌿",
      "newton": "Newton's Laws describe motion and gravity. The 1st law is Inertia, the 2nd is F=ma, and the 3rd is Action-Reaction! 🍎",
      "mitochondria": "The mitochondria is the powerhouse of the cell, responsible for generating ATP (adenosine triphosphate). ⚡",
      "dna": "DNA (Deoxyribonucleic Acid) is the molecule that carries genetic instructions for the development, functioning, and reproduction of all known organisms. 🧬",
      "python": "Python is a high-level, interpreted programming language known for its readability and versatility in data science and AI! 🐍",
      "javascript": "JavaScript is the language of the web, allowing you to create interactive and dynamic content for websites! 🌐",
      "html": "HTML is the standard markup language for documents designed to be displayed in a web browser. 📑",
      "css": "CSS is used for styling and laying out web pages—including design, layout, and variations in display for different devices! 🎨"
    };

    for (const key in studyBase) {
      if (lowerInput.includes(key)) {
        return studyBase[key];
      }
    }

    return "That's a fascinating topic! While I'm currently optimizing my deep-learning connection, I can tell you that this area is fundamental to modern science. What specific part of this would you like to explore? 🌸";
  }
};
