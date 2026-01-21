# Skill: Apify Web Scraping & Automation

## Trigger Words
"apify", "scraper", "actor", "automation", "web automation"

## Config
```
API_KEY: See docs/credentials/API_KEYS.env → APIFY_API_KEY
USER_ID: See docs/credentials/API_KEYS.env → APIFY_USER_ID
BASE_URL: https://api.apify.com/v2
```

## List Your Actors
```bash
curl "https://api.apify.com/v2/acts?token=${APIFY_API_KEY}"
```

## Run an Actor (Google Search)
```bash
curl -X POST "https://api.apify.com/v2/acts/apify~google-search-scraper/runs?token=${APIFY_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "queries": "cleaning services sydney",
    "maxPagesPerQuery": 1
  }'
```

## Run Website Scraper
```bash
curl -X POST "https://api.apify.com/v2/acts/apify~web-scraper/runs?token=${APIFY_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "startUrls": [{"url": "https://example.com"}],
    "pageFunction": "async function pageFunction(context) { return { title: document.title }; }"
  }'
```

## Get Run Results
```bash
curl "https://api.apify.com/v2/actor-runs/{RUN_ID}/dataset/items?token=${APIFY_API_KEY}"
```

## Popular Actors
- `apify/google-search-scraper` - Google search results
- `apify/web-scraper` - Generic website scraper
- `apify/instagram-scraper` - Instagram data
- `apify/facebook-pages-scraper` - Facebook pages
- `apify/linkedin-scraper` - LinkedIn profiles

## Use Cases
- Competitor analysis
- Lead generation
- Social media monitoring
- Price tracking

## Status
API Key Active | Direct API Only (No MCP)
