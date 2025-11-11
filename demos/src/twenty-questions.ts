import z from "zod";
import { OpenRouter } from '@openrouter/sdk'
import * as readline from "readline/promises";

import { env } from "./config.js";
import { Message } from "@openrouter/sdk/models";
import { yesOrNo } from "./yes-no.js";

const twentyQuestionsSchema = z.object({
    question: z.string().describe("The next yes/no question to ask the user"),
    isGuess: z.boolean().describe("Whether this question is a guess of the answer.  If the user answers yes to a guess, the game is over."),
});

const systemPrompt = `
You are going to play a game of twenty questions with the user.
They will think of something, and you will ask them yes/no questions to try to guess what it is.
After each question, wait for their response before asking the next question.
Try to guess the answer within twenty questions.
`;

async function twentyQuestions() {
   const openRouter = new OpenRouter({
       apiKey: env.OPENROUTER_API_KEY,
   }); 
   
   const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
   
   let numQuestions = 0;
   let messages: Message[] = [
           {
               role: "system",
               content: systemPrompt,
           },
           {
               role: "assistant",
               content: 'I am ready to play twenty questions! Think of something, and I will start asking questions.  Let me know when you\'re ready!',
           },
       ]
   
    let lastAssistantQuestion: z.infer<typeof twentyQuestionsSchema> | null = null;
    while (numQuestions < 20) {
       const lastAssistantMessage = messages.filter(m => m.role === 'assistant').slice(-1)[0];
       if (!lastAssistantMessage) throw new Error("No assistant message found");

       const answer = await rl.question(`${lastAssistantMessage.content as string}\nYour answer: `);
       const YesOrNoResponse = await yesOrNo(answer);
       
       if (lastAssistantQuestion?.isGuess && YesOrNoResponse.answer === "yes") {
           console.log("I guessed it!");
           break;
       }
       
       messages.push({
           role: "user",
           content: `Answer: ${YesOrNoResponse.answer}`,
       });

       const response = await openRouter.chat.send({
           model: "google/gemini-2.5-flash",
           messages,
           responseFormat: {
              type: "json_schema",
              jsonSchema: {
                name: 'TwentyQuestionsResponse',
                schema: z.toJSONSchema(twentyQuestionsSchema),
              }
            }
       });
   
       const respContent = response.choices[0].message.content as string;
       const parsed = twentyQuestionsSchema.safeParse(JSON.parse(respContent));
       if (!parsed.success) throw new Error(`Failed to parse response: ${respContent}`);
       lastAssistantQuestion = parsed.data;
       
       messages.push({
         role: "assistant",
         content: parsed.data.question,
       });
    }
}

await twentyQuestions();