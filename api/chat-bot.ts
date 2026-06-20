import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  // Allow cross-origin requests in development etc.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { prompt, context } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required." });
    }

    const activeContext = context || {};
    const speakerList = activeContext.speakers || [];
    const eventList = activeContext.events || [];
    const attendeeList = activeContext.attendees || [];

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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({ 
        reply: "Hello! Our advanced Gemini Chatbot integration is deployed successfully on Vercel, but I need a valid Gemini API Key to run. Please add your GEMINI_API_KEY in your Vercel Project under Settings > Environment Variables to unlock my live reasoning capabilities!" 
      });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "I apologize, but I could not formulate a response at this moment.";
    return res.status(200).json({ reply });
  } catch (error: any) {
    console.error("Vercel AI Error:", error);
    return res.status(500).json({ 
      reply: `I encountered a processing error while connecting to Gemini: ${error.message || error}. Please verify that your GEMINI_API_KEY environment variable is configured in Vercel.` 
    });
  }
}
