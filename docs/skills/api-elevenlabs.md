# Skill: ElevenLabs Voice AI

## Trigger Words
"elevenlabs", "voice", "voice ai", "ai calling", "phone call"

## Config
```
API_KEY: See docs/credentials/API_KEYS.env → ELEVENLABS_API_KEY
```

## Agent ID
- Sales Agent: `agent_8601kdkwm8xses1tzr12z0jcdc7r`

## List Agents
```bash
curl -s "https://api.elevenlabs.io/v1/convai/agents" \
  -H "xi-api-key: YOUR_API_KEY"
```

## Get Agent Details
```bash
curl -s "https://api.elevenlabs.io/v1/convai/agents/agent_8601kdkwm8xses1tzr12z0jcdc7r" \
  -H "xi-api-key: YOUR_API_KEY"
```

## Text to Speech
```bash
curl -X POST "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM" \
  -H "xi-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello, this is Clean Up Bros","model_id":"eleven_monolingual_v1"}' \
  --output speech.mp3
```

## Use Cases
- AI sales calls to leads
- Booking confirmations (voice)
- Follow-up calls

## Status
✅ Active | ✅ Sales Agent Configured
