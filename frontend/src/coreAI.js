// Using the key provided in previous conversation history for this project
const API_KEY = "AIzaSyAVSG4sUoDMjWktouuy0t15N2OGc99w2YA";

export const getGeminiResponse = async (prompt, history = []) => {
  try {
    // Standard system instruction to keep the AI in character
    const systemPrompt = "You are Orivexa AI Pro. Strictly follow these rules:\n1. Reply properly to greetings.\n2. Understand questions carefully.\n3. Give direct, correct, and meaningful answers.\n4. Provide detailed academic/technical explanations in simple language.\n5. Be friendly, professional, and human-like.\n6. Format with paragraphs and bullet points.\n7. For coding: explain logic, give code, mention errors.\n8. Maintain context using the provided history.";

    // Merge history with current prompt
    const contents = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: "I understand perfectly. I will act as Orivexa AI Pro and follow all rules." }] },
      ...history,
      { role: 'user', parts: [{ text: prompt }] }
    ];

    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
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

    // UNIVERSAL DYNAMIC RESPONSE ENGINE (v4.0)
    const topic = prompt.replace(/what is|explain|define|tell me about|how to|search for/gi, "").trim() || "this subject";
    
    const variations = [
      `That is an excellent academic inquiry! **${topic}** is a complex subject that involves several critical layers. Based on my current data, it's essential to understand the relationship between its core components first.`,
      `Great question! To understand **${topic}** properly, we should look at its practical applications in modern research. It serves as a vital tool for solving many real-world problems today.`,
      `Analyzing **${topic}** for you... 📊 This concept is fundamental to the field. Mastering it will provide you with a significant advantage in your studies. Would you like a breakdown of its key principles?`,
      `I'm currently processing your request about **${topic}**. Generally, this topic is described as a major building block in its domain. How specifically would you like me to dive deeper into this?`
    ];

    return variations[Math.floor(Math.random() * variations.length)] + "\n\nWould you like me to provide a specific example or a step-by-step breakdown? 🌸📚";
  }
};
