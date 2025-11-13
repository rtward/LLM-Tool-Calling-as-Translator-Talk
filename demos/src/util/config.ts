import z from "zod";

export const env = z.object({
    OPENROUTER_API_KEY: z.string().min(1, "OPENROUTER_API_KEY is required"),
}).parse(process.env);