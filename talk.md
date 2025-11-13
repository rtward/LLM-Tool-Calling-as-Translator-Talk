---
marp: true
theme: default
class: invert
---

# TODOS
 - Finish personal assistant demo
 - Do Weather Bot demo
 - Fill out timings
 - Add code to slides
 - Record demos
 - Style Talk

---

# LLM Tool Calling

## or

# Your computer's universal translator

---

# Who am I?

---

# Robert Ward

 * Co-founder of Arch Reactor Hackerspace
 * Co-founder of Juristat Inc.
 * Cub Scout Leader
 * Cargo Bike Enthusiast
 * Star Trek Fan
 * Playhouse Builder
 * ![width:300px](images/playhouse.jpg)

<!-- 0:00 -->

---

# Bone-Fides

 * Several Time Phreaknic Speaker
 * Currently building AI products for the legal industry
   * For Accessing our Analytics Product
   * For Analyzing USPTO rejections
   * And Offering Suggestions Based on Past Performance

<!-- 0:30 -->

---

# A Confession
 
---

# A Confession

# I'm an AI Sceptic

<!-- 1:00 -->

<!--
I don't believe that LLMs are going to lead to superhumen intelligence, or even AGI (whatever that means)

I'm not even particularly impressed with the current tech for most use cases.
-->

---

# A Promise

---

# This Talk is my Work

<!-- 1:30 -->

<!--
This entire talk was written by me by hand
No AI was used to work on the content or the demos
-->

---

# My AI Story

<!-- 2:00 -->

---

# AI At Home 

 * Dissapointed with AI search
 * Dissapointed with AI assistants
 * Thrilled with transcription

<!--
Story about using Claude to inventory and make a shopping list
-->

---

# AI At Work

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

# AI is *Great* at Translation

<!--
Translation from the real world to computer readable
Not translation from english to japanese
-->

---

# Tool Calling

 * MCP Servers
 * Tool Calling
 * RAG 

<!-- 6:00 -->

<!--
So back to tool calling.

Tool calling is the buzzword

What it really is, is structured output
-->

---

# Structured Output

---

# Structured Output

## vs

# Regular Output

---

## Regular Output

> *user:* What's the Capital of Austria

> *assistant:* The capital city of Austria is Vienna

---

## Structured Output

> *user:* What's the Capital of Austria

> *assistant:* `{"country": "Austria", "capital": "Vienna"}`

---

# Tool Calling

> *user:* What's the weather like in Nashville?

```
{
  "function_call": {
    "name": "get_weather",
    "arguments": {
      "location": "Nashville, TN",
    }
  }
}
```

<!-- 8:00 -->

<!--
LLMs complex enough to write out structured data to invoke a tool
Structured output is one way, from the LLM back to the machine
Tool calling is when the LLM invokes a tool, and then uses the output.
-->

---

---

# Demos!

<!--
Here are some demos of simple use cases for structured content
-->

---

# Yes / No

<!--
"Translating" a human response into a binary yes or no
-->

---

# 20 Questions

<!--
This isn't really part of the talk, I just thought it was a fun use case for the first demo
-->

---

# Document Parsing

 * Signature Extraction
 * Bill Information

<!--
Translating a document into a standardized machine readable format
Actually the thing that got me going on this kick
-->

---

# Personal Assistant

 - Decide intent
 - Find target
 - Decide action

---

# Tool Calling

<!--
So all of those demos were one way, we got some info out of an LLM and used it to do something for the user.
Tool calling closes that loop by letting us then send information back to the LLM.
-->

---

# Weather Demo

<!--
In the personal assistent demo, I showed off fetching the weather based on a user's request.
This closes the loop and allows us to ask questions about the weather to an agent that can access weather reports.
-->

---

# Tool Calling Formats

 * MCP
 * OpenAI
 * Bedrock

<!--
Basically all of these are based on the JSONSchema format.
-->

---

# MCP

<!--
MCP has evolved as one of the early frontrunners in tool calling.
The idea is a simple standard API that conforms to a standard format and allows an LLM to call both local and remote tools easily.
-->

 - TODO: MCP Server Code
 - TODO: MCP Client Code

---

# OpenAI

<!--
OpenAI supports MCP now, but also has some of their own ideas.
They've supported calling OpenAPI spec APIs as well.
IMO this spec can be too complex for simple LLMs to call, hasn't worked well in my experience.
OpenAI also has a native foramt for doing tool calls in their API, which is what I'm showing off here.
All of these demos were done using the OpenAI API, but talking to the OpenRouter LLM service.
-->

 - TODO: OpenAI Tool Calling

---

# Bedrock

<!--
Bedrock is an API only service by AWS that supports a ton of foundational models
-->

 - TODO: Bedrock Tool Calling

---

# Inspiration

 * Planning Tool
 * Home Automation
 * Personal Knowledge Base

<!-- 44:00 -->

<!--
Planning Tool: Have the LLM make a plan step by step, then you can run those steps independently or sequentially
Home Automation: Surprisingly easy to start playing around with building an Alexa type experience for Home Assistant
PKB: Store your documents and notes and let an LLM search them for you
-->

---

<!-- 45:00 -->

# That's all folks! / Questions?

![width:300px](images/qr-link.png)

https://github.com/rtward/LLM-Tool-Calling-as-Translator-Talk

Website: https://rtward.com/
Signal: `rtward.32`
Bluesky: `@rtward.com`
Mastodon: `@rtward@mastodon.social`