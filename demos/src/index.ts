import { command, option, run, string, type Type } from "cmd-ts";
import { extractSignature } from "./demos/find-signature.js";
import { personalAssistantDemo } from "./demos/personal-assistant.js";
import { readUtilityBill } from "./demos/read-utility-bill.js";
import { twentyQuestions } from "./demos/twenty-questions.js";
import { yesOrNo } from "./demos/yes-no.js";

enum DemoName {
	YES_NO = "yes-no",
	PERSONAL_ASSISTANT = "personal-assistant",
	READ_UTILITY_BILL = "read-utility-bill",
	TWENTY_QUESTIONS = "twenty-questions",
	FIND_SIGNATURE = "find-signature",
}

const DemoType: Type<string, DemoName> = {
	async from(input: string) {
		const matchedDemo = Object.values(DemoName).find((demo) => demo === input);
		if (matchedDemo) {
			console.log("Matched demo:", { input, matchedDemo });
			return matchedDemo;
		}

		throw new Error(`Invalid demo type: ${input}`);
	},
	description: `The demo to run, one of: ${Object.values(DemoName).join(", ")}`,
};

const cmd = command({
	name: "my-command",
	description: "print something to the screen",
	version: "1.0.0",
	args: {
		demo: option({
			long: "demo",
			short: "d",
			type: DemoType,
		}),
		prompt: option({
			long: "prompt",
			short: "p",
			type: string,
		}),
	},
	handler: async (args) => {
		console.log(`Running Demo ${args.demo} with prompt: "${args.prompt}"`);

		if (args.demo === DemoName.YES_NO) {
			const response = await yesOrNo(args.prompt);
			console.log("Response:", response);
		}

		if (args.demo === DemoName.TWENTY_QUESTIONS) {
			const response = await twentyQuestions();
			console.log("Response:", response);
		}

		if (args.demo === DemoName.FIND_SIGNATURE) {
			const response = await extractSignature(args.prompt);
			console.log("Response:", response);
		}

		if (args.demo === DemoName.READ_UTILITY_BILL) {
			const response = await readUtilityBill(args.prompt);
			console.log("Response:", response);
		}

		if (args.demo === DemoName.PERSONAL_ASSISTANT) {
			const response = await personalAssistantDemo(args.prompt);
			console.log("Response:", response);
		}
	},
});

run(cmd, process.argv.slice(2));
