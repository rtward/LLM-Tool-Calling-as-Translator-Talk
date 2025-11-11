import z from "zod";
import { OpenRouter } from '@openrouter/sdk'
import * as fs from "fs/promises";

import { env } from "./config.js";
import { ChatMessageContentItem, Message } from "@openrouter/sdk/models";


const systemPrompt = `
You're an agent that extracts signatures from documents.
You will be provided with a document in either text or image form, and your job is to identify whether there is a signature present, and if so, extract it.
The documents you'll be analyzing are patent prosecution documents, so each signature you find should be accompanied by a five digit registration number.
`;

const signatureExtractionSchema = z.object({
    signature: z.string().nullable().describe("The extracted signature, or null if none found"),
    registrationNumber: z.string().nullable().describe("The five digit registration number associated with the signature, or null if none found"),
})

async function extractSignature(file: string) {
   const openRouter = new OpenRouter({
       apiKey: env.OPENROUTER_API_KEY,
   }); 
   
   const textMessageContent: ChatMessageContentItem = {
       type: 'text',
       text: `Please analyze the following document for signatures:`,
   };
   
  const imageBuffer = await fs.readFile(file);
  const base64Image = imageBuffer.toString('base64');
   
   const imageMessageContent: ChatMessageContentItem = {
       type: 'file',
       file: {
           filename: 'document.pdf',
           fileData: base64Image,
       }
   } as unknown as ChatMessageContentItem;
   
   let messages: Message[] = [
           {
               role: "system",
               content: systemPrompt,
           },
           {
                role: "user",
                content: [
                    textMessageContent,
                    imageMessageContent,
                ],
           }
       ]
   
   const response = await openRouter.chat.send({
       model: "anthropic/claude-sonnet-4",
       messages,
       responseFormat: {
          type: "json_schema",
          jsonSchema: {
            name: 'TwentyQuestionsResponse',
            schema: z.toJSONSchema(signatureExtractionSchema),
          }
        }
   });
   
   const respContent = response.choices[0].message.content as string;
   const parsed = signatureExtractionSchema.safeParse(JSON.parse(respContent));
   if (!parsed.success) throw new Error(`Failed to parse response: ${respContent}`);
   
   console.log("Extracted signature:", parsed.data);
}

await extractSignature("/Users/rtward/Downloads/M4VVW9I5WFYGX58.pdf");