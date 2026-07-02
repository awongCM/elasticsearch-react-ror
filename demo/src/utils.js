/**
 * Transforms Elasticsearch aggregation buckets into Recharts rows.
 * Salvaged from the legacy App.js with dynamic URL keys added.
 */
export function parseResponseData(data) {
  const buckets = data?.response?.aggregations?.page_views_over_time?.buckets;
  if (!buckets?.length) {
    return { chartData: [], urlKeys: [] };
  }

  const urlSet = new Set();

  for (const bucket of buckets) {
    for (const sub of bucket.urls_makeup?.buckets || []) {
      urlSet.add(sub.key);
    }
  }

  const urlKeys = [...urlSet];

  const chartData = buckets.map((bucket) => {
    const row = { name: bucket.key_as_string };
    for (const sub of bucket.urls_makeup?.buckets || []) {
      row[sub.key] = sub.doc_count;
    }
    return row;
  });

  return { chartData, urlKeys };
}

export function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export const CHART_COLORS = [
  '#6B5B95',
  '#ECDB54',
  '#E94B3C',
  '#6F9FD8',
  '#944743',
  '#DBB1CD',
  '#00A591',
  '#6C4F3D',
  '#BFD641',
  '#88B04B',
];
