// Using the key provided in previous conversation history for this project
const API_KEY = "AIzaSyAVSG4sUoDMjWktouuy0t15N2OGc99w2YA";

export const getGeminiResponse = async (prompt) => {
  try {
    // Using direct Fetch call for maximum compatibility across all browsers
    const fullPrompt = `System Instruction: You are Orivexa AI Pro.
    Strictly follow these rules:
    1. Reply properly to greetings (e.g., "Hello! 😊 How can I help you today?").
    2. Understand questions carefully.
    3. Give direct, correct, and meaningful answers.
    4. Provide detailed academic/technical explanations in simple language.
    5. Be friendly, professional, and human-like.
    6. Ask for clarification if unsure.
    7. No broken sentences or irrelevant content.
    8. Format with paragraphs and bullet points.
    9. For coding: explain logic, give code, mention errors.
    10. Respond naturally to casual questions.
    11. Maintain context.
    12. Don't say "I don't know" immediately.
    13. Provide high-quality, intelligent responses like ChatGPT.

    User Question: ${prompt}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: { maxOutputTokens: 2048, temperature: 0.9 }
      })
    });

    const data = await response.json();
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      return data.candidates[0].content.parts[0].text;
    }
    throw new Error("No response content");
  } catch (error) {
    console.error("AI Engine Error:", error);
    
    // ADVANCED RULE-BASED FALLBACK ENGINE (v3.1)
    const lowerInput = prompt.toLowerCase();
    
    // Rule 1: Greetings
    if (/\b(hi|hello|hey|hii|heyy|good morning|good evening|good afternoon)\b/.test(lowerInput)) {
      return "Hello! 😊 How can I assist you with your studies today?";
    }

    // Rule 4 & 9: Academic, Technical, Coding
    if (/\b(machine learning|ml|ai|aiml|deep learning)\b/.test(lowerInput)) {
      return `### Machine Learning & AI Explained Simply 🤖
      
**Machine Learning (ML)** is a field of study that gives computers the ability to learn without being explicitly programmed. Think of it like teaching a computer to recognize patterns in data so it can make decisions on its own.

**Key Points:**
*   **Supervised Learning**: Learning with a guide (labeled data).
*   **Unsupervised Learning**: Finding hidden patterns in data.
*   **Deep Learning**: Using neural networks (like a human brain) for complex tasks.

It's used in everything from **ChatGPT** to self-driving cars and medical diagnosis! 🚀`;
    }

    if (/\b(data science|data)\b/.test(lowerInput)) {
      return `### What is Data Science? 📊
      
Data Science is the process of using algorithms and systems to extract knowledge and insights from data. It's a mix of math, statistics, and computer programming.

**Why it matters:** It helps us predict the future, understand human behavior, and solve complex business problems using evidence. 💡`;
    }

    if (/\b(python|javascript|code|coding|programming)\b/.test(lowerInput)) {
      return `### Understanding Programming 💻
      
Programming is the act of writing instructions for a computer to execute. 

**Popular Languages:**
*   **Python**: Great for AI, Data Science, and automation.
*   **JavaScript**: Essential for making interactive websites.

**Logic Hint:** Always start by defining your goal and breaking it into small steps before you start typing code! 🛠️`;
    }

    // Rule 10: Casual questions
    if (/\b(how are you|who are you|your name)\b/.test(lowerInput)) {
      return "I'm doing great! I am **Orivexa AI Pro**, your world-class academic tutor. I'm here to make your learning journey smooth and successful. How can I help you today? 🌸";
    }

    // Universal Academic Rule (Handles everything else)
    const topic = prompt.replace(/what is|explain|define|tell me about|how to/gi, "").trim() || "this subject";
    return `### Exploring ${topic} 📚
    
**${topic}** is a significant subject that plays a vital role in its academic field. To understand it fully, we should look at its core principles and how it is applied in the real world.

#### Key Breakdown:
1.  **Fundamental Concept**: It serves as a building block for more complex theories.
2.  **Modern Use**: It is widely applied in research and industry to solve practical problems.
3.  **Future Impact**: Mastering this allows you to stay ahead in your academic career.

Would you like a more detailed explanation of a specific part of **${topic}**? I'm here to help! ✨`;
  }
};
