import { OpenAI } from "openai";
import z from "zod";

import { env } from "../util/config.js";
import { getOpenAIClient } from "../util/openai-client.js";

const categorySchema = z
	.enum(["information_request", "action_request", "other_request"])
	.describe("The category of the user's request");

type RequestCategory = z.infer<typeof categorySchema>;

const informationRequestSchema = z
	.enum(["get_weather", "check_traffic", "search_email"])
	.describe("The tool to use for the information request");

type InformationRequestTool = z.infer<typeof informationRequestSchema>;

const actionRequestSchema = z
	.enum(["set_timer", "schedule_meeting", "send_email"])
	.describe("The tool to use for the action request");

type ActionRequestTool = z.infer<typeof actionRequestSchema>;

async function getTheWeather(request: string): Promise<string> {
	console.log("Getting the weather for request:", request);
	return "placeholder weather info";
}

async function checkTraffic(request: string): Promise<string> {
	console.log("Checking traffic for request:", request);
	return "placeholder traffic info";
}

async function searchEmail(request: string): Promise<string> {
	console.log("Searching email for request:", request);
	return "placeholder email search results";
}

async function setTimer(request: string): Promise<string> {
	console.log("Setting timer for request:", request);
	return "placeholder timer set confirmation";
}

async function scheduleMeeting(request: string): Promise<string> {
	console.log("Scheduling meeting for request:", request);
	return "placeholder meeting scheduled confirmation";
}

async function sendAnEmail(request: string): Promise<string> {
	console.log("Sending email for request:", request);
	return "placeholder email sent confirmation";
}

/**
 * This function categorizes the user's request into either a request for information, or a request to perform an action.
 *
 * @param request
 */
async function categorizeRequest(request: string): Promise<RequestCategory> {
	const systemPrompt = `
You are part of a series of agents that work together as a personal assistant AI.
Your job is to categorize the user's request at a high level as either a request for information or a request to perform an action.
`;

	const openai = getOpenAIClient();

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
						text: request,
					},
				],
			},
		],
		response_format: {
			type: "json_schema",
			json_schema: {
				name: "SignatureExtractionResponse",
				schema: z.toJSONSchema(categorySchema),
			},
		},
	});

	const respContent = response.choices[0].message.content as string;

	const parsed = categorySchema.safeParse(JSON.parse(respContent));
	if (!parsed.success)
		throw new Error(`Failed to parse response: ${respContent}`);

	console.log(`Extracted category for request "${request}":`, {
		category: parsed.data,
	});

	return parsed.data;
}

/**
 * This function handles requests for information, such as weather updates or traffic conditions.
 *
 */
async function handleInformationRequest(request: string): Promise<string> {
	const systemPrompt = `
You are part of a series of agents that work together as a personal assistant AI.
Your job is to route a user's request for information to the appropriate tool and return the result.
`;

	const openai = getOpenAIClient();

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
						text: request,
					},
				],
			},
		],
		response_format: {
			type: "json_schema",
			json_schema: {
				name: "InformationRequestResponse",
				schema: z.toJSONSchema(informationRequestSchema),
			},
		},
	});

	const respContent = response.choices[0].message.content as string;

	const parsed = informationRequestSchema.safeParse(JSON.parse(respContent));
	if (!parsed.success)
		throw new Error(`Failed to parse response: ${respContent}`);

	console.log(`Extracted information request tool from "${request}":`, {
		tool: parsed.data,
	});

	if (parsed.data === "get_weather") {
		return await getTheWeather(request);
	}

	if (parsed.data === "check_traffic") {
		return await checkTraffic(request);
	}

	if (parsed.data === "search_email") {
		return await searchEmail(request);
	}

	throw new Error("Unsupported information request tool");
}

/**
 * This function handles requests to perform actions, such as setting timers or sending emails.
 *
 */
async function handleActionRequest(request: string): Promise<string> {
	const systemPrompt = `
You are part of a series of agents that work together as a personal assistant AI.
Your job is to route a user's request for action to the appropriate tool.
`;

	const openai = getOpenAIClient();

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
						text: request,
					},
				],
			},
		],
		response_format: {
			type: "json_schema",
			json_schema: {
				name: "ActionRequestResponse",
				schema: z.toJSONSchema(actionRequestSchema),
			},
		},
	});

	const respContent = response.choices[0].message.content as string;

	const parsed = actionRequestSchema.safeParse(JSON.parse(respContent));
	if (!parsed.success)
		throw new Error(`Failed to parse response: ${respContent}`);

	console.log(`Extracted information request tool from "${request}":`, {
		tool: parsed.data,
	});

	if (parsed.data === "set_timer") {
		return await setTimer(request);
	}

	if (parsed.data === "send_email") {
		return await sendAnEmail(request);
	}

	if (parsed.data === "schedule_meeting") {
		return await scheduleMeeting(request);
	}

	throw new Error("Unsupported information request tool");
}

/**
 * This is the main function that simulates a personal assistant handling various user requests.
 */
export async function personalAssistantDemo(request: string) {
	const category = await categorizeRequest(request);

	if (category === "information_request") {
		return await handleInformationRequest(request);
	}

	if (category === "action_request") {
		return await handleActionRequest(request);
	}

	throw new Error("Unsupported request category");
}
