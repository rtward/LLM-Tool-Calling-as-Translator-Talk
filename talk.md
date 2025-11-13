---
marp: true
theme: default
class: invert
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
 * Dissapointed with summarization
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
-->

---

---

# Demos!

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

# Home Automation

 - Decide intent
 - Find target
 - Decide action

---

# 

---
