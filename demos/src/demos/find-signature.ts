import * as fs from "node:fs/promises";
import { OpenAI } from "openai";
import z from "zod";

import { env } from "../util/config.js";

const systemPrompt = `
You're an agent that extracts signatures from documents.
You will be provided with a document in either text or image form, and your job is to identify whether there is a signature present, and if so, extract it.
The documents you'll be analyzing are patent prosecution documents, so each signature you find should be accompanied by a five digit registration number.
`;

const signatureExtractionSchema = z.object({
	name: z
		.string()
		.nullable()
		.describe("The extracted name from the signature, or null if none found"),
	registrationNumber: z
		.string()
		.nullable()
		.describe(
			"The five digit registration number associated with the signature, or null if none found",
		),
});

export async function extractSignature(file: string) {
	const openai = new OpenAI({
		baseURL: "https://openrouter.ai/api/v1",
		apiKey: env.OPENROUTER_API_KEY,
	});

	const imageBuffer = await fs.readFile(file);
	const base64Pdf = imageBuffer.toString("base64");
	const fileData = `data:application/pdf;base64,${base64Pdf}`;

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
						text: `Please analyze the following document for signatures:`,
					},
					{
						type: "file",
						file: {
							filename: "document.pdf",
							file_id: "document.pdf",
							file_data: fileData,
						},
					},
				],
			},
		],
		response_format: {
			type: "json_schema",
			json_schema: {
				name: "SignatureExtractionResponse",
				schema: z.toJSONSchema(signatureExtractionSchema),
			},
		},
	});

	const respContent = response.choices[0].message.content as string;
	const parsed = signatureExtractionSchema.safeParse(JSON.parse(respContent));
	if (!parsed.success)
		throw new Error(`Failed to parse response: ${respContent}`);

	return parsed.data;
}
