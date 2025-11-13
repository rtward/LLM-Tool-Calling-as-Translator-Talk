# LLM Structured Output Demos

## Running the Demos

Install the dependencies with pnpm:

```
pnpm install
```

Set your OpenRouter key as an environment variable:

```
export OPENROUTER_API_KEY='<MY KEY>'
```

Run the demos with:

```
pnpm start -d <demo name> -p '<input prompt>'
```

### Run the Yes / No Demo

```
pnpm start -d yes-no -p "no way man"
```