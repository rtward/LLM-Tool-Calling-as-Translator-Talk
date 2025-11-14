import OpenAI from "openai";
import { env } from "./config.js";

let openAi: OpenAI | null = null;

export function getOpenAIClient() {
  if (!openAi) {
    openAi = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: env.OPENROUTER_API_KEY,
    });
  }
  return openAi;
}
