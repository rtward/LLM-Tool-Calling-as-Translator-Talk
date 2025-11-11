import z from "zod";
import { OpenRouter } from '@openrouter/sdk'

import { env } from "./config.js";

const yesNoSchema = z.object({
    answer: z.enum(["yes", "maybe", "no"]).describe("The answer to the question"),
});

type YesOrNoResponse = z.infer<typeof yesNoSchema>;

export async function yesOrNo(statement: string) {
   const openRouter = new OpenRouter({
       apiKey: env.OPENROUTER_API_KEY,
   }); 
   
   const response = await openRouter.chat.send({
       model: "google/gemini-2.5-flash",
       messages: [
           {
               role: "system",
               content: "Your job is to translate a response from a user into a simple 'yes', 'no', or 'maybe' answer.",
           },
           {
               role: "user",
               content: statement,
           },
       ],
       responseFormat: {
          type: "json_schema",
          jsonSchema: {
            name: 'YesOrNoResponse',
            schema: z.toJSONSchema(yesNoSchema),
          }
        }
   });
   
   const respContent = response.choices[0].message.content as string;
   const parsed = yesNoSchema.safeParse(JSON.parse(respContent));
   
   if (!parsed.success) throw new Error(`Failed to parse response: ${respContent}`);

   return parsed.data;
}

// const prompts = [
//     "Sure, sounds good",
//     "I don't think that's a good idea",
//     "Maybe, I'm not sure",
//     "Let me think about it, yeah, let's do it",
// ]

// for (const prompt of prompts) {
//     console.log("-----");
//     console.log(`Prompt: ${prompt}`);
//     console.log("Response:", await yesOrNo(prompt));
//     console.log("-----");
// }