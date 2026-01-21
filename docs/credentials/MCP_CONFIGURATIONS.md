# MCP Server Configurations Reference
*Last Updated: January 22, 2026*
*Status: DOCUMENTED - Not all enabled*

---

## Currently Connected MCPs (Active)

These MCPs are already connected and working in your Claude Code setup:

| MCP Server | Status | Notes |
|------------|--------|-------|
| N8N MCP | Active | v2.33.4, 20 tools available |
| Stripe MCP | Active | Connected (test mode) |
| Firebase MCP | Active | Authenticated |
| Playwright MCP | Active | Browser automation |
| Memory MCP | Active | Knowledge graph |
| Sequential Thinking MCP | Active | Problem-solving |
| Context7 MCP | Active | Documentation lookup |
| Greptile MCP | Active | Code review |
| Git MCP | Active | Version control |
| Time MCP | Active | Timezone handling |
| Fetch MCP | Active | Web fetching |
| Pinecone MCP | Key Error | Needs reconfiguration |

---

## Available MCP Configurations (Not Enabled)

These MCPs can be added using your API keys. **Ask before enabling.**

### 1. Sentry MCP
**Purpose:** Error tracking and monitoring
**Status:** Ready to configure

```json
{
  "mcpServers": {
    "sentry": {
      "url": "https://mcp.sentry.dev/mcp",
      "headers": {
        "Authorization": "Bearer ${SENTRY_ORG_TOKEN}"
      }
    }
  }
}
```

---

### 2. Apify MCP
**Purpose:** Web scraping and automation actors
**Status:** Ready to configure

```json
{
  "mcpServers": {
    "apify": {
      "url": "https://mcp.apify.com",
      "headers": {
        "Authorization": "Bearer ${APIFY_API_KEY}"
      }
    }
  }
}
```

---

### 3. Firecrawl MCP
**Purpose:** Web crawling and content extraction
**Status:** Ready to configure

```json
{
  "mcpServers": {
    "firecrawl-mcp": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "${FIRECRAWL_API_KEY}"
      }
    }
  }
}
```

---

### 4. Hostinger MCP
**Purpose:** Hosting management
**Status:** Ready to configure

```json
{
  "mcpServers": {
    "hostinger-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": ["hostinger-api-mcp@latest"],
      "env": {
        "API_TOKEN": "${HOSTINGER_API_TOKEN}"
      }
    }
  }
}
```

---

### 5. Ref MCP
**Purpose:** Reference tools
**Status:** Ready to configure

```json
{
  "mcpServers": {
    "ref": {
      "url": "https://api.ref.tools/mcp",
      "headers": {
        "x-ref-api-key": "${REF_API_KEY}"
      }
    }
  }
}
```

---

### 6. N8N Streamable HTTP MCP (Alternative)
**Purpose:** Direct N8N MCP connection via HTTP
**Status:** Alternative to current setup

```json
{
  "mcpServers": {
    "n8n-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "supergateway",
        "--streamableHttp",
        "https://nioctibinu.online/mcp-server/http",
        "--header",
        "authorization:Bearer ${N8N_MCP_ACCESS_TOKEN}"
      ]
    }
  }
}
```

---

## API Keys Quick Reference

All API keys are stored in `docs/credentials/API_KEYS.env` (not committed to git).

| Service | Key Variable | Status |
|---------|--------------|--------|
| N8N | N8N_API_KEY | Working |
| Supabase | VITE_SUPABASE_ANON_KEY | In Use |
| Stripe | STRIPE_SECRET_KEY | In Use |
| Square | SQUARE_ACCESS_TOKEN | In Use |
| Twilio | TWILIO_AUTH_TOKEN | In Use |
| ElevenLabs | ELEVENLABS_API_KEY | In Use |
| Google | GOOGLE_API_KEY | In Use |
| Gemini | VITE_GEMINI_API_KEY | In Use |
| Pinecone | PINECONE_API_KEY | Key Error |
| Notion | NOTION_TOKEN | Untested |
| Sentry | SENTRY_ORG_TOKEN | Untested |
| Apify | APIFY_API_KEY | Untested |
| Firecrawl | FIRECRAWL_API_KEY | Untested |

---

## Test Results Summary

### Tested & Working
- **N8N MCP**: Health check passed, v2.33.4
- **Stripe MCP**: Balance retrieved (test mode)
- **Firebase MCP**: Authenticated successfully

### Needs Attention
- **Pinecone MCP**: API key rejected - may need regeneration
- **N8N Workflows**: Auth error on list_workflows - key may have rotated

---

## How to Enable an MCP

1. **Ask me first** - I'll confirm the configuration
2. Add the JSON config to your Claude settings
3. Restart Claude Code
4. Test the connection

---

*Reference: API keys stored in `docs/credentials/API_KEYS.env`*
