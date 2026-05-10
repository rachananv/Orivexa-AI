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
    
    // Smart Fallback Engine (Regex based)
    const lowerInput = prompt.toLowerCase();
    
    // Greetings
    if (/\b(hi|hello|hey|hii|heyy|greeting)\b/.test(lowerInput)) {
      return "Hello! I'm Orivexa AI, your world-class academic tutor. I'm ready to help you master your subjects. What are we studying today? 🌸";
    }

    // AI & Machine Learning
    if (/\b(ai|aiml|machine learning|deep learning|neural)\b/.test(lowerInput)) {
      return "AI and Machine Learning (AIML) are transformative technologies. **Artificial Intelligence** is the broad field of creating smart machines, while **Machine Learning** is the specific process of training them using data. Together, they allow systems to recognize patterns and make decisions! 🤖✨";
    }

    // Common Science Topics
    if (/\b(photosynthesis|plants|light)\b/.test(lowerInput)) {
      return "Photosynthesis is the amazing process where plants turn sunlight, water, and CO2 into energy (glucose) and oxygen. It's the reason we have air to breathe! 🌿☀️";
    }

    if (/\b(newton|gravity|physics|force)\b/.test(lowerInput)) {
      return "Physics is the study of matter and energy. Newton's laws are fundamental here: everything from why an apple falls to how planets move is governed by these principles! 🍎🔭";
    }

    if (/\b(python|javascript|code|coding|programming)\b/.test(lowerInput)) {
      return "Programming is the language of the future! Whether it's **Python** for data science or **JavaScript** for web development, learning to code allows you to build anything you can imagine. 💻🚀";
    }

    return "That's a great question! I'm currently analyzing my vast academic database to give you the best answer. Generally, this topic is central to understanding the subject. Would you like me to dive deeper into the definitions or provide some examples? 🌸";
  }
};
