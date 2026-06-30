/**
 * Builds the Elasticsearch query salvaged from the legacy Rails controller,
 * with URL filtering fixed (was an empty terms array in the original).
 */
export function buildQuery({ before, after, interval, urls = [] }) {
  const must = [
    {
      range: {
        derived_tstamp: {
          gte: before,
          lte: after,
          format: 'dd/MM/yyyy',
        },
      },
    },
  ];

  const filter = [];

  if (urls.length > 0) {
    filter.push({
      terms: {
        page_url: urls,
      },
    });
  }

  return {
    query: {
      bool: {
        must,
        ...(filter.length > 0 ? { filter } : {}),
      },
    },
    aggs: {
      page_views_over_time: {
        date_histogram: {
          field: 'derived_tstamp',
          interval,
        },
        aggs: {
          urls_makeup: {
            terms: {
              field: 'page_url',
              size: 10,
            },
          },
        },
      },
    },
  };
}

export async function searchElasticsearch({ before, after, interval, urls }) {
  const url = process.env.ELASTICSEARCH_URL;
  const index = process.env.ELASTICSEARCH_INDEX || 'page_views';

  if (!url) {
    return null;
  }

  const endpoint = `${url.replace(/\/$/, '')}/${index}/_search`;
  const body = buildQuery({ before, after, interval, urls });

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Elasticsearch error ${response.status}: ${text}`);
  }

  const data = await response.json();
  return { ...data, _meta: { mode: 'elasticsearch', index } };
}
