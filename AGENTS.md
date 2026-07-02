# AGENTS.md

## Cursor Cloud specific instructions

### What to run
- The active product is the **thin rebuild in `demo/`** (Node.js: Express API + Vite/React frontend). Start it with `cd demo && npm run dev` (see `demo/README.md`). This launches the API on `http://localhost:3001` and the Vite frontend on `http://localhost:5173` together via `concurrently`.
- The repo root Rails app (`app/`, `config/`) and `client/` (Create React App) are **legacy reference only**. They depend on a hardcoded external Elasticsearch cluster (`test.es.streem.com.au`) that is likely unreachable, so they are not needed for end-to-end testing. Prefer `demo/`.

### Non-obvious notes
- `demo/` runs **fully offline in "mock" mode** — no Elasticsearch or database is required. `GET /api/health` reports `"mode":"mock"`. To use a live cluster, copy `demo/.env.example` to `demo/.env` and set `ELASTICSEARCH_URL` (all env vars are optional).
- The Vite dev server proxies `/api/*` to the Express server on port 3001, so both dev processes must be running for the UI to fetch data.
- There is **no lint script and no automated test suite** in `demo/` (`package.json` has only `dev`, `dev:server`, `dev:client`, `build`, `start`, `preview`). "Testing" is manual/build-based: `npm run build` for a production bundle; `npm start` (or `npm run preview`) serves the built frontend + API on a single port (default 3001, `NODE_ENV=production`).
- Dependencies are installed only under `demo/` (npm, `package-lock.json` present). The startup update script handles `demo` npm install.
