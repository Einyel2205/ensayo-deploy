import { Request, Response } from "express";
import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();
// GoogleGenerativeAI required config
const configuration = new GoogleGenerativeAI(
  process.env.APIKEYGEMINI as string
);

// Model initialization
const modelId = "gemini-1.5-flash";
const model = configuration.getGenerativeModel({ model: modelId });

//These arrays are to maintain the history of the conversation
const conversationContext: [string, string][] = [];
const currentMessages: { role: string; parts: Part[] }[] = [];

// Controller function to handle chat conversation
export const generateResponse = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    // Restore the previous context
    for (const [inputText, responseText] of conversationContext) {
      currentMessages.push({ role: "user", parts: [{ text: inputText }] });
      currentMessages.push({ role: "model", parts: [{ text: responseText }] });
    }

    const chat = model.startChat({
      history: currentMessages,
      generationConfig: {
        maxOutputTokens: 50,
        temperature: 0.05,
        topP: 0.9,
        topK: 20,
      },
    });

    try {
      const result = await chat.sendMessage(prompt);
      const response = result.response;
      const responseText = response.text();
      conversationContext.push([prompt, responseText]);
      res.send({ response: responseText });
    } catch (error: any) {
      console.error(error.stack);
      throw new Error(error.message);
    }

    // Stores the conversation
  } catch (err: any) {
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error" });
  }
};
