# Skill: Pinecone Vector Database

## Trigger Words
"pinecone", "vector", "embedding", "semantic search", "rag"

## Config
```
API_KEY: See docs/credentials/API_KEYS.env → PINECONE_API_KEY
PROJECT_ID: See docs/credentials/API_KEYS.env → PINECONE_PROJECT_ID
```

## MCP Tools Available
Use `mcp__plugin_pinecone_pinecone__*` tools:
- `list-indexes` - List all indexes
- `describe-index` - Get index details
- `create-index-for-model` - Create new index
- `upsert-records` - Add/update records
- `search-records` - Search vectors
- `search-docs` - Search Pinecone docs

## Quick Test (MCP)
```
mcp__plugin_pinecone_pinecone__list-indexes
mcp__plugin_pinecone_pinecone__search-docs with query="how to create index"
```

## Quick Test (curl)
```bash
curl -X GET "https://api.pinecone.io/indexes" \
  -H "Api-Key: ${PINECONE_API_KEY}" \
  -H "X-Pinecone-API-Version: 2025-01"
```

## Setup Required
Set environment variable before starting Claude:
```bash
export PINECONE_API_KEY=your_api_key_here
```

## Use Cases
- Customer query semantic search
- FAQ matching
- Document retrieval (RAG)

## Status
API Key Works | MCP Needs Env Var Set
