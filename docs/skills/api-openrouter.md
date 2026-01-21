# Skill: OpenRouter (All LLMs)

## Trigger Words
"openrouter", "llm", "ai model", "free model", "gpt", "claude api"

## Config
```
API_KEY: See docs/credentials/API_KEYS.env → OPENROUTER_API_KEY
BASE_URL: https://openrouter.ai/api/v1
```

## Available Models (Free)
- `google/gemma-2-9b-it:free`
- `meta-llama/llama-3.2-3b-instruct:free`
- `microsoft/phi-3-mini-128k-instruct:free`
- `mistralai/mistral-7b-instruct:free`

## Available Models (Paid)
- `openai/gpt-4o`
- `anthropic/claude-3.5-sonnet`
- `google/gemini-pro`
- `meta-llama/llama-3.1-405b-instruct`

## Quick Test (curl)
```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "google/gemma-2-9b-it:free",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

## Usage in Code
```typescript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'google/gemma-2-9b-it:free',
    messages: [{ role: 'user', content: 'Hello' }]
  })
});
```

## Use Cases
- Backup AI when Gemini is down
- Free models for bulk operations
- Model comparison testing

## Status
✅ Active | ✅ 100+ Models Available
