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
└─────────────┘                         ┌──────┴──────┐
                                        │             │
                                        ▼             ▼
                                 ┌───────────┐ ┌───────────┐
                                 │ shortenURL│ │ redirect  │
                                 │  Lambda   │ │  Lambda   │
                                 └─────┬─────┘ └─────┬─────┘
                                       │             │
                    ┌──────────────────┤             ├──────────────────┐
                    ▼                  ▼             ▼                  ▼
             ┌─────────────┐    ┌─────────────┐┌─────────────┐   ┌─────────────┐
             │    Redis    │    │   DynamoDB  ││     SQS     │   │   tgs.lol   │
             │    (EC2)    │    │  (tgs-urls) ││   (queue)   │   │  (redirect) │
             └─────────────┘    └─────────────┘└──────┬──────┘   └─────────────┘
                                                      │
                                                      ▼
                                               ┌─────────────┐
                                               │   stats     │
                                               │   Lambda    │
                                               └──────┬──────┘
                                                      │
                                                      ▼
                                               ┌─────────────┐
                                               │   DynamoDB  │
                                               │  (tgs-stats)│
                                               └─────────────┘
```

## How It Works

**Shorten:**
1. Client sends URL to `POST /v1/shorten`
2. Redis `INCR` generates unique sequential ID
3. Hashids encodes ID to short code (base62)
4. DynamoDB saves mapping (shortcode → long_url)

**Redirect:**
1. `GET /{code}` looks up URL in DynamoDB
2. Sends visit data to SQS (async, fire-and-forget)
3. Returns 302 redirect immediately

**Stats (async):**
1. SQS triggers stats Lambda
2. Writes visit data to tgs-stats table

## API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1/shorten` | POST | Create short URL |
| `/{code}` | GET | Redirect to original URL |

**Request:** `{"url": "https://example.com/long-url"}`

**Response:** `{"shortUrl": "https://tgs.lol/abc123", "code": "abc123"}`

## Tech Stack

**Frontend:** React 19, TypeScript, Vite, Tailwind CSS

**Backend:** AWS Lambda (Node.js), API Gateway, DynamoDB, Redis (EC2), SQS

**Integrations:** Telegram Bot, n8n workflows

## Development

```bash
npm install             # Install dependencies
npm run dev             # Start dev server
npm run build:shorten   # Build shortenURL lambda
npm run build:redirect  # Build redirect lambda
npm run build:stats     # Build stats lambda
```

## Lambda Environment Variables

| Variable | Lambda | Description |
|----------|--------|-------------|
| `REDIS_HOST` | shortenURL | Redis EC2 IP |
| `REDIS_PASSWORD` | shortenURL | Redis auth |
| `DYNAMODB_TABLE` | shortenURL, redirect | Table name (`tgs-urls`) |
| `HASHIDS_SALT` | shortenURL | Salt for encoding |
| `SQS_QUEUE_URL` | redirect | Stats queue URL |
| `STATS_TABLE` | stats | Stats table (`tgs-stats`) |