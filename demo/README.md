# Streem Page Views Demo

A thin rebuild of the legacy `elasticsearch-react-ror` spike. One small app that proves the concept: query page-view events from Elasticsearch (or mock data offline) and render a stacked histogram chart.

The original Rails + React codebase remains in the repo root as reference.

## Quick start

```bash
cd demo
npm install
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3001

By default the app runs in **mock mode** — no Elasticsearch cluster required.

## Production build

```bash
cd demo
npm run build
npm start
```

Serves the API and static frontend on one port (default 3001).

## Connect to Elasticsearch

Copy `.env.example` to `.env` and set:

```
ELASTICSEARCH_URL=http://user:pass@your-cluster:9200
ELASTICSEARCH_INDEX=page_views
```

Expected document fields (Snowplow-style):

- `derived_tstamp` — event timestamp
- `page_url` — page URL for terms aggregation

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check + data mode |
| GET | `/api/page_views` | API info |
| POST | `/api/page_views` | Run histogram query |

POST body:

```json
{
  "before": "01/06/2017",
  "after": "30/06/2017",
  "interval": "1d",
  "urls": ["https://example.com/page"]
}
```

## What was salvaged from the legacy app

- Elasticsearch date histogram + URL terms aggregation query
- Chart data parsing logic (now with dynamic URL bars)
- Date range + interval form controls

## What changed

- Single Node.js app (Express + Vite React) instead of Rails + CRA
- Mock data fallback for offline demos
- URL filtering actually wired up
- Modern dependencies, one deployable service
