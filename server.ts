import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API Route: Generate Synthetic Climate Data (For Simulation)
app.get("/api/climate-data", (req, res) => {
  const years = 50;
  const data = [];
  let baseTemp = 14.0;
  let baseCO2 = 315;
  
  for (let i = 0; i < years; i++) {
    const year = 1974 + i;
    // Simulate global warming trend + noise
    baseTemp += 0.02 + (Math.random() - 0.5) * 0.1;
    baseCO2 += 1.5 + (Math.random() - 0.5) * 0.5;
    
    // Add an anomaly year (e.g., 1998, 2016)
    let temp = baseTemp;
    if (year === 1998 || year === 2016) {
      temp += 0.4; // El Niño spike
    }

    data.push({
      year,
      temperature: parseFloat(temp.toFixed(2)),
      co2: parseFloat(baseCO2.toFixed(2)),
      rainfall: parseFloat((800 + Math.random() * 200).toFixed(2)),
    });
  }
  res.json(data);
});

// API Route: AI Analysis
app.post("/api/analyze", async (req, res) => {
  const { climateData } = req.body;
  
  try {
    const prompt = `
      You are an expert Climate Data Scientist. 
      Analyze the following climate data (Yearly Temperature and CO2 levels):
      ${JSON.stringify(climateData)}
      
      Provide a concise professional report including:
      1. Major Trend observed.
      2. Identified Anomaly years (list them clearly as a comma-separated string).
      3. A prediction for the next decade.
      4. One specific recommendation for policymakers.
      
      CRITICAL: All field values MUST be simple strings. Do not use nested objects or arrays.
      Keep the response in a structured JSON format with fields: "trend", "anomalies", "prediction", "recommendation".
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    
    const jsonStr = response.text || "{}";
    res.json(JSON.parse(jsonStr));
  } catch (error) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({ error: "Failed to generate AI insights" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[CTA] Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Climate Analyzer Server running on http://localhost:${PORT}`);
  });
}

startServer();
