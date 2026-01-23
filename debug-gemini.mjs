
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

// Load .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envConfig = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        envConfig[key.trim()] = value.trim();
    }
});

const apiKey = envConfig.ANMOK_GEMINI_API_KEY || envConfig.GEMINI_API_KEY;
console.log("TESTING API Key:", apiKey ? "Loaded" : "Missing");

const genAI = new GoogleGenerativeAI(apiKey);

async function testModels() {
    const models = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-latest",
        "gemini-1.5-flash-001",
        "gemini-1.5-pro",
        "gemini-pro",
        "gemini-pro-vision" // Known to fail, but testing for comparison
    ];

    console.log("--- Starting Model Availability Test ---");

    for (const modelName of models) {
        process.stdout.write(`Testing ${modelName.padEnd(25)}: `);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            // Simple prompt to check connectivity
            const result = await model.generateContent("Test.");
            const response = await result.response;
            console.log("✅ Working!");
        } catch (e) {
            let msg = e.message;
            if (msg.includes("404")) msg = "404 Not Found";
            if (msg.includes("API key")) msg = "API Key Error";
            console.log(`❌ Failed (${msg})`);
        }
    }
}

testModels();
