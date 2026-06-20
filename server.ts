import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // Initialize Gemini API client on the server side
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API endpoint for chatbot
  app.post("/api/chat-bot", async (req, res) => {
    try {
      const { prompt, context } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required." });
      }

      const activeContext = context || {};
      const speakerList = activeContext.speakers || [];
      const eventList = activeContext.events || [];
      const attendeeList = activeContext.attendees || [];

      // Format contextual system instructions based on the speakers, events, and attendees in the system
      const systemInstruction = `You are an expert AI event coordinator and real-time advisor for the Speaker Portal conference organizer dashboard.
Your job is to assist the admin by answering questions about the event data, speakers, schedules, and attendees in the portal.

CURRENT SYSTEM DATA:
- Speakers currently registered in the database: ${JSON.stringify(speakerList)}
- Schedule of Events/Sessions in the database: ${JSON.stringify(eventList)}
- Registered Attendees in the database: ${JSON.stringify(attendeeList)}

GUIDELINES FOR ANSWERS:
1. Provide accurate answers using the structured database context provided above.
2. If the user asks about a speaker, event, or attendee, use the data to summarize, list, or coordinate.
3. Be professional, direct, event-focused, and helpful. Prefer list-style formats and bullet points if relevant.
4. Keep answers concise, clear, and action-oriented. Do not invent fake data or pretend information is in the database if it is not. If there is no relevant information, offer helpful general event planning advice gracefully.`;

      if (!apiKey) {
        // Return a helpful informative message when API key is missing (e.g. before user sets it up)
        return res.json({ 
          reply: "Hello! Our advanced Gemini Chatbot integration is deployed successfully, but I need a valid Gemini API Key to run. Please add your GEMINI_API_KEY in the **Settings > Secrets** panel in Google AI Studio to unlock my live reasoning capabilities!" 
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const reply = response.text || "I apologize, but I could not formulate a response at this moment.";
      res.json({ reply });
    } catch (error: any) {
      console.error("AI Error:", error);
      res.json({ 
        reply: `I encountered a processing error while connecting to Gemini: ${error.message || error}. Please verify that your key is correctly registered under Settings.` 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
