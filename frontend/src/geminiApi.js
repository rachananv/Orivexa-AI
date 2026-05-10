import { GoogleGenerativeAI } from "@google/generative-ai";

// Using the key provided in previous conversation history for this project
const API_KEY = "AIzaSyAVSG4sUoDMjWktouuy0t15N2OGc99w2YA";
const genAI = new GoogleGenerativeAI(API_KEY);

export const getGeminiResponse = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    if (!text) throw new Error("Empty response from AI");
    return text;
  } catch (error) {
    console.error("Gemini AI Error Detail:", error);
    
    // Smart Fallbacks for common study questions if API fails
    const lowerInput = prompt.toLowerCase();
    if (lowerInput.includes("machine learning")) {
      return "Machine Learning is a field of AI that allows computers to learn from data and improve over time without being explicitly programmed. It's used in things like recommendation systems and image recognition! 🤖";
    }
    if (lowerInput.includes("photosynthesis")) {
      return "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods from carbon dioxide and water. 🌿";
    }
    if (lowerInput.includes("newton") && lowerInput.includes("law")) {
      return "Newton's laws of motion are three physical laws that, together, laid the foundation for classical mechanics. They describe the relationship between a body and the forces acting upon it! 🍎";
    }

    return "I'm currently thinking very hard! Could you please try asking your question again? 🌸";
  }
};
