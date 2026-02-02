# tgs.lol - Link Shortener

A serverless URL shortener built on AWS infrastructure.

## Architecture

```
                    ┌─────────────┐
                    │   Frontend  │
                    │  (React/S3) │
                    └──────┬──────┘
                           │
┌─────────────┐            │            ┌─────────────┐
│  Telegram   │────────────┼───────────▶│ API Gateway │
└─────────────┘            │            │  (HTTP API) │
                           │            │ api.tgs.lol │
┌─────────────┐            │            └──────┬──────┘
│     n8n     │────────────┘                   │
└─────────────┘                                ▼
                                        ┌─────────────┐
                                        │   Lambda    │
                                        │  (Node.js)  │
                                        └──────┬──────┘
                                               │
                          ┌────────────────────┼────────────────────┐
                          ▼                    ▼                    ▼
                   ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
                   │   DynamoDB  │      │    Redis    │      │   tgs.lol   │
                   │  (tgs-urls) │      │    (EC2)    │      │  (redirect) │
                   └─────────────┘      └─────────────┘      └─────────────┘
```

## How It Works

1. **Shorten** - Client sends URL to `POST /v1/shorten`
2. **Generate ID** - Redis `INCR` generates unique sequential ID
3. **Encode** - Hashids encodes ID to short code (base62)
4. **Store** - DynamoDB saves mapping (shortcode → long_url)
5. **Redirect** - `GET /{code}` looks up URL and returns 302 redirect

## API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1/shorten` | POST | Create short URL |
| `/{code}` | GET | Redirect to original URL |

**Request:** `{"url": "https://example.com/long-url"}`

**Response:** `{"shortUrl": "https://tgs.lol/abc123", "code": "abc123"}`

## Tech Stack

**Frontend:** React 19, TypeScript, Vite, Tailwind CSS

**Backend:** AWS Lambda (Node.js), API Gateway, DynamoDB, Redis (EC2)

**Integrations:** Telegram Bot, n8n workflows

## Development

```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build:shorten   # Build shortenURL lambda
npm run build:redirect  # Build redirect lambda
```

## Lambda Environment Variables

| Variable | Lambda | Description |
|----------|--------|-------------|
| `REDIS_HOST` | shortenURL | Redis EC2 IP |
| `REDIS_PASSWORD` | shortenURL | Redis auth |
| `DYNAMODB_TABLE` | both | Table name (`tgs-urls`) |
| `HASHIDS_SALT` | shortenURL | Salt for encoding |