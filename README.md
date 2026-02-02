# tgs.lol - Link Shortener

A serverless URL shortener built on AWS infrastructure.

## Architecture Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│ API Gateway │────▶│   Lambda    │────▶│    Redis    │
│  (React/S3) │     │  (HTTP API) │     │  (Node.js)  │     │   (EC2)     │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

## Frontend

### Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling

### Features

- Single-page application with minimal UI
- Paste URL → Get shortened link
- One-click copy to clipboard
- Responsive design (mobile-first)
- Custom color scheme with CSS variables

### Design System

Colors are defined as CSS custom properties for easy theming:

```css
:root {
  --color-light: #EAE5E3;        /* Background */
  --color-dark: rgba(0,0,0,0.8); /* Text/Buttons */
  --color-muted: #64748b;        /* Secondary text */
}
```

### Project Structure

```
src/
├── App.tsx          # Main application component
├── main.tsx         # React entry point
└── css/
    └── index.css    # Tailwind + custom styles
```

### API Integration

The frontend communicates with the backend via a single endpoint:

```typescript
POST https://api.tgs.lol/v1/shorten
Content-Type: application/json

{
  "url": "https://example.com/very/long/url"
}

// Response
{
  "shortUrl": "https://tgs.lol/abc123"
}
```

### Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

### Deployment

Frontend is deployed to AWS S3 + CloudFront.

---

## Backend

*Documentation to be added...*

## Infrastructure

*Documentation to be added...*