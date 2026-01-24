import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.ANMOK_GEMINI_API_KEY!);

async function listModels() {
  try {
    const models = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }).listModels();
    console.log(JSON.stringify(models, null, 2));
  } catch (error) {
    // If listModels is not directly on the model instance
    const fetch = await import('node-fetch').then(m => m.default);
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.ANMOK_GEMINI_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  }
}

listModels();
