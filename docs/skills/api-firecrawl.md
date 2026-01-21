# Skill: Firecrawl Web Scraping

## Trigger Words
"firecrawl", "scrape", "crawl website", "extract content", "web scraping"

## Config
```
API_KEY: See docs/credentials/API_KEYS.env → FIRECRAWL_API_KEY
BASE_URL: https://api.firecrawl.dev/v1
```

## Scrape Single Page
```bash
curl -X POST https://api.firecrawl.dev/v1/scrape \
  -H "Authorization: Bearer fc-00469a033e6a441abc4d7ff7e036d059" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

## Crawl Entire Website
```bash
curl -X POST https://api.firecrawl.dev/v1/crawl \
  -H "Authorization: Bearer fc-00469a033e6a441abc4d7ff7e036d059" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "limit": 10,
    "scrapeOptions": {"formats": ["markdown"]}
  }'
```

## Check Crawl Status
```bash
curl -X GET https://api.firecrawl.dev/v1/crawl/{job_id} \
  -H "Authorization: Bearer fc-00469a033e6a441abc4d7ff7e036d059"
```

## Extract Structured Data
```bash
curl -X POST https://api.firecrawl.dev/v1/scrape \
  -H "Authorization: Bearer fc-00469a033e6a441abc4d7ff7e036d059" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/pricing",
    "formats": ["extract"],
    "extract": {
      "schema": {
        "type": "object",
        "properties": {
          "prices": {"type": "array"},
          "features": {"type": "array"}
        }
      }
    }
  }'
```

## Use Cases
- Competitor price monitoring
- Lead extraction
- Content aggregation
- Market research

## Status
✅ API Key Active | Direct API Only (No MCP)
