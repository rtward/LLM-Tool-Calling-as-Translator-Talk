---
marp: true
theme: default
class: invert
---

<style scoped>
  section { text-align: center }
</style>

# LLM Tool Calling
## or, your computer's universal translator

![width:300px](images/qr-link.png)

https://github.com/rtward/LLM-Tool-Calling-as-Translator-Talk

---

<style scoped>
  section { text-align: center }
</style>

# Who am I?

---

## Robert Ward

 * Co-founder of Arch Reactor Hackerspace
 * Co-founder of Juristat Inc.
 * Cub Scout Leader
 * Cargo Bike Enthusiast
 * Star Trek Fan
 * Playhouse Builder <br/> ![width:300px](images/playhouse.jpg)

<!-- 0:00 -->

---

## Bone-Fides

 * Several Time Phreaknic Speaker
 * Currently building AI products for the legal industry
   * For Accessing our Analytics Product
   * For Analyzing USPTO rejections
   * And Offering Suggestions Based on Past Performance

<!-- 0:30 -->

---

<style scoped>
  section { text-align: center }
</style>

# A Confession
 
---

<style scoped>
  section { text-align: center }
</style>

# A Confession

## I'm an AI Sceptic

<!-- 1:00 -->

<!--
I don't believe that LLMs are going to lead to superhumen intelligence, or even AGI (whatever that means)

I'm not even particularly impressed with the current tech for most use cases.
-->

---

<style scoped>
  section { text-align: center }
</style>

# A Promise

---

<style scoped>
  section { text-align: center }
</style>

# A Promise

## This Talk is my Work

<!-- 1:30 -->

<!--
This entire talk was written by me by hand
No AI was used to work on the content or the demos
-->

---

# My AI Story

<!-- 2:00 -->

---

## AI At Home 

 * Dissapointed with AI search
 * Dissapointed with AI assistants
 * Thrilled with transcription

<!--
Fuck off google
Story about using Claude to inventory and make a shopping list
-->

---

## AI At Work

 * Pressured to use AI
 * Dissapointed with coding tools
 * Dissapointed with writing tools
 * Thrilled with data extraction

<!--
Story about reading spreadsheets
Complain about the USPTO / PDFs
-->

---

# What's the Common Thread?

<!-- 5:00 -->

---

# What's the Common Thread?

## LLMs aren't good at creation

## but...

## LLMs are *Great* at translation

<!--
Translation from the real world to computer readable
Not translation from english to japanese
-->

---

# Tool Calling

 * Model Context Protocol (MCP) Servers
 * Retreival Augmented Generation (RAG)
 * Tool Calling
 * Function Calling
 * AI "Integrations"

<!-- 7:00 -->

<!--
So back to tool calling.

Tool calling is the buzzword

What it really is, is structured output
-->

---

<style scoped>
  section { text-align: center }
</style>

# Structured Output

<!--
All of these things are just "forcing" the LLM to spit out tokens in a standard format, almost always JSON
-->

---

<style scoped>
  section { text-align: center }
</style>

# Structured Output

## vs

# Unstructured Output

---

## Unstructured Output

> *user:* What's the Capital of Austria

> *assistant:* The capital city of Austria is Vienna

<!--
Unstrctured output is normal "human" language.
This is how we're used to interacting with ChatGPT or other systems.
-->

---

## Structured Output

> *user:* What's the Capital of Austria

> *assistant:* `{"country": "Austria", "capital": "Vienna"}`

<!--
Structred output is where we ask the LLM to generate the data in a defined format.
It's taken larger and more complex models to make this work reliably.
-->

---

<style scoped>
  section { text-align: center }
</style>

<!-- 10:00 -->

# Demos!

<!--
Here are some demos of simple use cases for structured content
These demos are all using the OpenAI API with OpenRouter
-->

---

# Yes / No

```typescript
  const yesNoSchema = z.object({
    answer: z.enum(["yes", "maybe", "no"]).describe("The answer to the question"),
  });

  const response = await openRouter.chat.send({
    model: "google/gemini-2.5-flash",
    messages: [
      {
        role: "system",
        content: "Your job is to translate a response from a user into a simple 'yes', 'no', or 'maybe' answer.",
      },
      { role: "user", content: statement },
    ],
    responseFormat: {
      type: "json_schema",
      jsonSchema: {
        name: "YesOrNoResponse",
        schema: z.toJSONSchema(yesNoSchema),
      },
    },
  });
```

<!--
"Translating" a human response into a binary yes or no
-->

---

# Yes / No

<style scoped>
  section { text-align: center }
</style>

<video height=500px autoplay loop muted>
	<source src='images/yes-no-demo.mov'>
</video>

---

# 20 Questions

<style scoped>
  section { text-align: center }
</style>

<!-- 12:00 -->

![height:600px](images/twenty-questions-demo.png)

<!--
This isn't really part of the talk, I just thought it was a fun use case for the first demo
-->

---

# Document Parsing

<!-- 13:00 -->

<!--
Translating a document into a standardized machine readable format
Actually the thing that got me going on this kick
-->

---

# Document Parsing

```typescript
  const response = await openai.chat.completions.create({
    model: "google/gemini-2.5-flash",
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: [
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
```

---

<style scoped>
  section { text-align: center }
</style>

# Document Parsing

![](images/signature-doc-image.png)

---

<style scoped>
  section { text-align: center }
</style>

# Document Parsing

![height:500px](images/find-signature-demo.png)

---

<style scoped>
  section { text-align: center }
</style>

# Document Parsing

![](images/bill-image.png)

---

<style scoped>
  section { text-align: center }
</style>

# Document Parsing

![height:500px](images/bill-demo.png)

---

<!-- 19:00 -->

# Personal Assistant

 - Decide intent
 - Find target
 - Decide action

<!--
This demonstrates the approach that I've had great success with in my work

The advantage of doing multiple levels of LLM calls is that you avoid having to put massive tool definitions into the context window.

This saves you both context and makes your output more accurate in my experience.

It does increase the cost and latency though.
Not going to post the code for this one because it's a lot and it looks much the same.
-->

---

# Personal Assistant

![height=500px](images/assistant-flowchart.png)

---

<style scoped>
  section { text-align: center }
</style>

# Personal Assistant

<video height=500px autoplay loop muted>
	<source src='images/assistant-demo.mov'>
</video>

---

<style scoped>
  section { text-align: center }
</style>

<!-- 23:00 -->

# Tool Calling

![height:500px](images/tool-call-flowchart.png)

<!--
So all of those demos were one way, we got some info out of an LLM and used it to do something for the user.

Tool calling closes that loop by letting us then send information back to the LLM.
-->

---

<style scoped>
  section { text-align: center }
</style>

<!-- 25:00 -->

# Weather Demo

<video height=500px autoplay loop muted>
	<source src='images/weather-bot-demo.mov'>
</video>

<!--
In this weather demo, I'm asking if I need a jacket for this trip I'm currently on.
It has access to a tool to get the weather, then interprets the result for me.
-->

---

<!-- 30:00 -->

# Tool Calling Formats

 * OpenAI
 * Bedrock
 * MCP

<!--
Basically all of these are based on the JSONSchema format.
Demos here have been in the OpenAI format
-->

---

# Tool Calling Formats

 * Tool Name
 * Tool Arguments
 * Tool Use ID

<!--
Similarities:
 - Tool Name
 - Tool Use ID
 - Tool Arguments
-->

---

<!-- 33:00 -->

# OpenAI

<!--
OpenAI supports MCP now, but also has some of their own ideas.

They've supported calling OpenAPI spec APIs as well.

IMO this spec can be too complex for simple LLMs to call, hasn't worked well in my experience.

OpenAI also has a native foramt for doing tool calls in their API, which is what I'm showing off here.

All of these demos were done using the OpenAI API, but talking to the OpenRouter LLM service.

Also have "custom" tools that can use context-free grammers for building output, but I haven't gotten into that
-->

```typescript
const tools: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: ToolNames.GET_CURRENT_WEATHER,
      description: "Get the current weather for a given location.",
      parameters: z.toJSONSchema(getWeatherParamsSchema),
    },
  },
];
```

---

# OpenAI

<!--
Tool calls have their own role in the conversation
-->

```typescript
async function handleToolCall(toolCall) {
  const toolName = toolCall.function.name;
  const args = toolCall.function.arguments;

  if (toolName === ToolNames.GET_CURRENT_WEATHER) {
    console.log("Handling get_weather tool call with args:", args);
    ...
    return {
      role: "tool",
      tool_call_id: toolCall.id,
      content: weather,
    };
  }
  ...
}
```

---

<!-- 36:00 -->

# Bedrock

<!--
Bedrock is an API only service by AWS that supports a ton of foundational models
-->

```typescript
const tools = [{
  toolSpec: {
    name: 'multi-step-plan',
    description:
      'Use this tool to create a multi step plan to accomplish your goal.',
    inputSchema: {
      json: multiStepPlanSchema,
    },
  },
}]
```

---

# Bedrock

<!--
Tool use in bedrock is handled as a user message, not a separate thing
-->

```typescript
async function handleToolUse(toolCall) {
  ...
  return {
    role: 'user',
    content: [
      {
        toolResult: {
          toolUseId: toolCall.toolUseId,
          content: [{ text: 'plan accepted' }],
        },
      }
    ]
  }
}
```

---

<!-- 40:00 -->

# MCP

<!--
MCP has evolved as one of the early frontrunners in tool calling.
The idea is a simple standard API that conforms to a standard format and allows an LLM to call both local and remote tools easily.
-->

```typescript
  server.tool('do-cool-stuff', 'Does some cool stuff',
    { whatShouldIdo: z.string() },
    async (args) => {
    ...
      const result: CallToolResult = {
        content: [{ type: 'text', text: coolStuffResult }],
      }
      return result
    }
  )
```

---

# MCP

<!--
MCP has evolved as one of the early frontrunners in tool calling.
The idea is a simple standard API that conforms to a standard format and allows an LLM to call both local and remote tools easily.
-->

```typescript
export async function mcpToolCall(args) {
  const result = await analyticsMcpClient.callTool({
    name: args.name,
    arguments: args.arguments,
  })
  const parsedResult = CallToolResultSchema.parse(result)
  return parsedResult
}
```

---

<!-- 44:00 -->

# Inspiration

 * Planning Tool
 * Home Automation
 * Personal Knowledge Base
 * Custom Assistant
 * Document Organizer

<!--
Planning Tool: Have the LLM make a plan step by step, then you can run those steps independently or sequentially
Home Automation: Surprisingly easy to start playing around with building an Alexa type experience for Home Assistant
PKB: Store your documents and notes and let an LLM search them for you
-->

---

<style scoped>
  section { text-align: center }
</style>

<!-- 45:00 -->

# That's all folks! / Questions?

![width:200px](images/qr-link.png)

https://github.com/rtward/LLM-Tool-Calling-as-Translator-Talk

Website: https://rtward.com/
Signal: `rtward.32`
Bluesky: `@rtward.com`
Mastodon: `@rtward@mastodon.social`
