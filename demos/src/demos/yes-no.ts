import { OpenRouter } from "@openrouter/sdk";
import z from "zod";

import { env } from "../util/config.js";

export async function yesOrNo(statement: string) {
  const openRouter = new OpenRouter({
    apiKey: env.OPENROUTER_API_KEY,
  });

  const yesNoSchema = z.object({
    answer: z
      .enum(["yes", "maybe", "no"])
      .describe("The answer to the question"),
  });

  const response = await openRouter.chat.send({
    model: "google/gemini-2.5-flash",
    messages: [
      {
        role: "system",
        content:
          "Your job is to translate a response from a user into a simple 'yes', 'no', or 'maybe' answer.",
      },
      {
        role: "user",
        content: statement,
      },
    ],
    responseFormat: {
      type: "json_schema",
      jsonSchema: {
        name: "YesOrNoResponse",
        schema: z.toJSONSchema(yesNoSchema),
      },
    },
  });

  const respContent = response.choices[0].message.content as string;
  const parsed = yesNoSchema.safeParse(JSON.parse(respContent));

  if (!parsed.success)
    throw new Error(`Failed to parse response: ${respContent}`);

  return parsed.data;
}
