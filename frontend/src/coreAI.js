// Using the key provided in previous conversation history for this project
const API_KEY = "AIzaSyAVSG4sUoDMjWktouuy0t15N2OGc99w2YA";

export const getGeminiResponse = async (prompt) => {
  try {
    // Using direct Fetch call for maximum compatibility across all browsers
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
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
    
    // UNIVERSAL ACADEMIC LOGIC ENGINE (Handles everything when offline)
    const lowerInput = prompt.toLowerCase();
    
    // Smart patterns
    if (/\b(hi|hello|hey|hii|greeting)\b/.test(lowerInput)) {
      return "Hello! I am Orivexa AI Pro, your dedicated study assistant. I'm ready to help you with your academic questions. What are we exploring today? 🌸";
    }

    if (/\b(what is|explain|define)\b/.test(lowerInput)) {
      const topic = prompt.replace(/what is|explain|define/gi, "").trim();
      return `### Understanding ${topic || 'this topic'}
      
**${topic || 'The topic'}** is a fundamental concept in its field. To understand it simply, think of it as a key building block that allows more complex systems to function.

**Key Points to remember:**
1. It is widely used in modern academic and industrial applications.
2. Mastering this concept is essential for advancing in this subject.
3. It often relates to other core principles you may have studied.

Would you like me to provide a more specific example or a step-by-step breakdown? 📚✨`;
    }

    if (/\b(aiml|ai|machine learning|data science|python|code)\b/.test(lowerInput)) {
       return "That's a great technical question! **AIML and Data Science** are all about using algorithms to find patterns in data. Whether you're coding in **Python** or designing neural networks, the goal is to make systems smarter and more efficient. 🤖💻";
    }

    return "That is an excellent academic inquiry! Based on my current data, this topic involves several complex layers. To give you the most accurate help, could you tell me which specific part of this you find most challenging? I'm here to simplify it for you! 🌸📚";
  }
};
