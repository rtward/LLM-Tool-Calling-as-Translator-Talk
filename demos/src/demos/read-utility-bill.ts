import * as fs from "fs/promises";
import { OpenAI } from "openai";
import z from "zod";

import { env } from "../util/config.js";

const systemPrompt = `
You're an agent that extracts information from utility bills.
You will be provided with a utility bill in either text or image form, and your job is to extract key pieces of information from it.
`;

const billInfoSchema = z.object({
	biller: z
		.string()
		.nullable()
		.describe(
			"The name of the company issuing the bill, or null if none found",
		),
	accountNumber: z
		.string()
		.nullable()
		.describe(
			"The account number associated with the bill, or null if none found",
		),
	dueDate: z
		.string()
		.nullable()
		.describe("The due date for the bill payment, or null if none found"),
	amountDue: z
		.string()
		.nullable()
		.describe("The amount due on the bill, or null if none found"),
});

export async function readUtilityBill(file: string) {
	const openai = new OpenAI({
		baseURL: "https://openrouter.ai/api/v1",
		apiKey: env.OPENROUTER_API_KEY,
	});

	const imageBuffer = await fs.readFile(file);
	const base64Pdf = imageBuffer.toString("base64");
	const fileData = `data:image/gif;base64,${base64Pdf}`;

	const response = await openai.chat.completions.create({
		model: "google/gemini-2.5-flash",
		messages: [
			{
				role: "system",
				content: systemPrompt,
			},
			{
				role: "user",
				content: [
					{
						type: "text",
						text: `Please analyze the following bill:`,
					},
					{
						type: "image_url",
						image_url: {
							url: fileData,
						},
					},
				],
			},
		],
		response_format: {
			type: "json_schema",
			json_schema: {
				name: "BillInfoResponse",
				schema: z.toJSONSchema(billInfoSchema),
			},
		},
	});

	const respContent = response.choices[0].message.content as string;
	const parsed = billInfoSchema.safeParse(JSON.parse(respContent));
	if (!parsed.success)
		throw new Error(`Failed to parse response: ${respContent}`);

	return parsed.data;
}
