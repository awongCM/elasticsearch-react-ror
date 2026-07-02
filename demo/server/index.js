import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getMockResponse } from './mockData.js';
import { searchElasticsearch } from './elasticsearch.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    mode: process.env.ELASTICSEARCH_URL ? 'elasticsearch' : 'mock',
    message: 'Streem Page Views Demo API',
  });
});

app.get('/api/page_views', (_req, res) => {
  res.json({
    status: 200,
    message: 'Streem Page Views Demo API — use POST to query histogram data',
    mode: process.env.ELASTICSEARCH_URL ? 'elasticsearch' : 'mock',
  });
});

app.post('/api/page_views', async (req, res) => {
  const { before, after, interval, urls } = req.body;

  if (!before || !after || !interval) {
    return res.status(400).json({
      status: 400,
      message: 'Missing required fields: before, after, interval',
    });
  }

  const urlList = Array.isArray(urls)
    ? urls.filter(Boolean)
    : typeof urls === 'string' && urls.trim()
      ? urls.split('\n').map((u) => u.trim()).filter(Boolean)
      : [];

  const params = { before, after, interval, urls: urlList };

  try {
    let response = await searchElasticsearch(params);

    if (!response) {
      response = getMockResponse(params);
    }

    return res.json({
      status: 200,
      message: 'Query successful',
      body: params,
      response,
    });
  } catch (error) {
    console.error('Query failed:', error.message);
    return res.status(502).json({
      status: 502,
      message: 'Query failed',
      body: params,
      error: error.message,
    });
  }
});

if (isProduction) {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Data mode: ${process.env.ELASTICSEARCH_URL ? 'elasticsearch' : 'mock (offline)'}`);
});
