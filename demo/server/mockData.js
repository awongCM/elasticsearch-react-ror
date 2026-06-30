/**
 * Sample Elasticsearch aggregation response for offline demo mode.
 * Shape matches what the chart parser expects from a real ES query.
 */
export function getMockResponse({ before, after, interval, urls }) {
  const buckets = [
    {
      key_as_string: '2017-06-01T00:00:00.000Z',
      key: 1496275200000,
      doc_count: 120,
      urls_makeup: {
        buckets: [
          { key: 'https://streem.com.au/', doc_count: 45 },
          { key: 'https://streem.com.au/pricing', doc_count: 35 },
          { key: 'https://streem.com.au/about', doc_count: 40 },
        ],
      },
    },
    {
      key_as_string: '2017-06-02T00:00:00.000Z',
      key: 1496361600000,
      doc_count: 98,
      urls_makeup: {
        buckets: [
          { key: 'https://streem.com.au/', doc_count: 50 },
          { key: 'https://streem.com.au/pricing', doc_count: 28 },
          { key: 'https://streem.com.au/about', doc_count: 20 },
        ],
      },
    },
    {
      key_as_string: '2017-06-03T00:00:00.000Z',
      key: 1496448000000,
      doc_count: 145,
      urls_makeup: {
        buckets: [
          { key: 'https://streem.com.au/', doc_count: 60 },
          { key: 'https://streem.com.au/pricing', doc_count: 55 },
          { key: 'https://streem.com.au/about', doc_count: 30 },
        ],
      },
    },
    {
      key_as_string: '2017-06-04T00:00:00.000Z',
      key: 1496534400000,
      doc_count: 87,
      urls_makeup: {
        buckets: [
          { key: 'https://streem.com.au/', doc_count: 40 },
          { key: 'https://streem.com.au/pricing', doc_count: 27 },
          { key: 'https://streem.com.au/about', doc_count: 20 },
        ],
      },
    },
  ];

  return {
    took: 12,
    timed_out: false,
    _shards: { total: 1, successful: 1, skipped: 0, failed: 0 },
    hits: { total: { value: 450, relation: 'eq' }, max_score: null, hits: [] },
    aggregations: {
      page_views_over_time: {
        buckets,
      },
    },
    _meta: {
      mode: 'mock',
      message: 'Using mock data. Set ELASTICSEARCH_URL to query a live cluster.',
      params: { before, after, interval, urls },
    },
  };
}
