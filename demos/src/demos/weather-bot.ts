import type {
	ChatCompletionMessageFunctionToolCall,
	ChatCompletionMessageParam,
	ChatCompletionTool,
	ChatCompletionToolMessageParam,
} from "openai/resources/chat/completions.mjs";
import z from "zod";
import { getOpenAIClient } from "../util/openai-client.js";

enum ToolNames {
	GET_CURRENT_WEATHER = "get_current_weather",
	GET_FORECAST = "get_forecast",
}

const cityStateLocationSchema = z.object({
	city: z.string().describe("The city name"),
	state: z.string().optional().describe("The state or region name"),
	country: z.string().optional().describe("The country name").default("US"),
});

const locationSchema = z.union([cityStateLocationSchema]);

const getWeatherParamsSchema = z.object({
	location: locationSchema.describe("The location to get the weather for"),
});

const currentWeatherApiResponseSchema = z.object({
	coord: z.object({
		lon: z.number(),
		lat: z.number(),
	}),
	weather: z.array(
		z.object({
			id: z.number(),
			main: z.string(),
			description: z.string(),
			icon: z.string(),
		}),
	),
	base: z.string(),
	main: z.object({
		temp: z.number(),
		feels_like: z.number(),
		temp_min: z.number(),
		temp_max: z.number(),
		pressure: z.number(),
		humidity: z.number(),
	}),
	visibility: z.number(),
	wind: z.object({
		speed: z.number(),
		deg: z.number(),
	}),
});

const dailyForecastApiResponseSchema = z.object({
	cod: z.string(),
	message: z.number(),
	cnt: z.number(),
	list: z.array(
		z.object({
			dt: z.number(),
			main: z.object({
				temp: z.number(),
				feels_like: z.number(),
				temp_min: z.number(),
				temp_max: z.number(),
				pressure: z.number(),
				humidity: z.number(),
			}),
			weather: z.array(
				z.object({
					id: z.number(),
					main: z.string(),
					description: z.string(),
					icon: z.string(),
				}),
			),
		}),
	),
});

/**
 * Handle a tool call from the LLM by invoking the appropriate tool function.
 *
 * @param toolCall
 */
async function handleToolCall(
	toolCall: ChatCompletionMessageFunctionToolCall,
): Promise<ChatCompletionToolMessageParam> {
	const toolName = toolCall.function.name;
	const args = toolCall.function.arguments;

	if (toolName === ToolNames.GET_CURRENT_WEATHER) {
		console.log("Handling get_weather tool call with args:", args);

		const parsedArgs = getWeatherParamsSchema.safeParse(JSON.parse(args));
		if (!parsedArgs.success)
			throw new Error(`Failed to parse tool call args: ${args}`);

		const city = parsedArgs.data.location.city;
		const state = parsedArgs.data.location.state ?? "";
		const country = parsedArgs.data.location.country;
		const location = `${city}${state ? `,${state}` : ""},${country}`;

		const currentWeather = await fetch(
			`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.OPENWEATHER_API_KEY}&units=imperial`,
		);

		const weatherData = currentWeatherApiResponseSchema.safeParse(
			await currentWeather.json(),
		);
		if (!weatherData.success)
			throw new Error(
				`Failed to parse weather API response: ${JSON.stringify(
					weatherData.error,
				)}`,
			);

		const weather = `The current weather in ${location} is ${weatherData.data.weather[0].description} with a temperature of ${weatherData.data.main.temp}°F (feels like ${weatherData.data.main.feels_like}°F).`;

		return {
			role: "tool",
			tool_call_id: toolCall.id,
			content: weather,
		};
	}

	if (toolName === ToolNames.GET_FORECAST) {
		console.log("Handling get_weather tool call with args:", args);

		const parsedArgs = getWeatherParamsSchema.safeParse(JSON.parse(args));
		if (!parsedArgs.success)
			throw new Error(`Failed to parse tool call args: ${args}`);

		const city = parsedArgs.data.location.city;
		const state = parsedArgs.data.location.state ?? "";
		const country = parsedArgs.data.location.country;
		const location = `${city}${state ? `,${state}` : ""},${country}`;

		const dailyForecast = await fetch(
			`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${process.env.OPENWEATHER_API_KEY}&units=imperial`,
		);

		const weatherData = dailyForecastApiResponseSchema.safeParse(
			await dailyForecast.json(),
		);
		if (!weatherData.success)
			throw new Error(
				`Failed to parse forecast API response: ${JSON.stringify(
					weatherData.error,
				)}`,
			);

		const columns: {
			header: string;
			getter: (
				item: z.infer<typeof dailyForecastApiResponseSchema>["list"][number],
			) => string;
		}[] = [
			{
				header: "Date/Time",
				getter: (
					item: z.infer<typeof dailyForecastApiResponseSchema>["list"][number],
				) => {
					return new Date(item.dt * 1000).toLocaleString();
				},
			},
			{
				header: "Temp (°F)",
				getter: (
					item: z.infer<typeof dailyForecastApiResponseSchema>["list"][number],
				) => `${item.main.temp}`,
			},
			{
				header: "Description",
				getter: (
					item: z.infer<typeof dailyForecastApiResponseSchema>["list"][number],
				) => item.weather[0].description,
			},
		];
		const output = [
			columns.map((col) => col.header).join(" | "),
			columns.map(() => "---").join(" | "),
			...weatherData.data.list.map((item) =>
				columns.map((col) => col.getter(item)).join(" | "),
			),
		].join("\n");

		return {
			role: "tool",
			tool_call_id: toolCall.id,
			content: output,
		};
	}

	throw new Error(`Unsupported tool call: ${toolName}`);
}

/**
 * This is the main function that simulates a personal assistant handling various user requests.
 */
export async function weatherBotDemo(request: string) {
	const openai = getOpenAIClient();

	const messages: ChatCompletionMessageParam[] = [
		{
			role: "system",
			content: `You are a helpful personal assistant that can provide weather information.`,
		},
		{
			role: "user",
			content: request,
		},
	];

	const tools: ChatCompletionTool[] = [
		{
			type: "function",
			function: {
				name: ToolNames.GET_CURRENT_WEATHER,
				description: "Get the current weather for a given location.",
				parameters: z.toJSONSchema(getWeatherParamsSchema),
			},
		},
		{
			type: "function",
			function: {
				name: ToolNames.GET_FORECAST,
				description: "Get the forecast for a given location.",
				parameters: z.toJSONSchema(getWeatherParamsSchema),
			},
		},
	];

	let finished = false;
	do {
		// Make the initial LLM call
		const response = await openai.chat.completions.create({
			model: "anthropic/claude-sonnet-4.5",
			messages: messages,
			tools,
		});

		// Store the response message from the LLM
		messages.push(response.choices[0].message);

		// Handle any tool calls based on the response
		if (response.choices[0].message.tool_calls) {
			// Resolve all tool calls in parallel
			const toolCallResults = await Promise.all(
				response.choices[0].message.tool_calls.map(async (toolCall) => {
					const type = toolCall.type;
					if (type !== "function")
						throw new Error(`Unsupported tool call type: ${type}`);

					return handleToolCall(toolCall);
				}),
			);

			// Add tool call results to messages for next iteration
			messages.push(...toolCallResults);
		} else {
			// No tool calls, we are finished
			finished = true;
		}

		// If there are no more tool calls, set finished = true
	} while (!finished);

	const lastMessage = messages[messages.length - 1];
	return lastMessage.content;
}
