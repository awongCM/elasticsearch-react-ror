import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { parseResponseData, formatDate, CHART_COLORS } from './utils';

const INTERVAL_UNITS = [
  { value: 'm', label: 'Minute' },
  { value: 'h', label: 'Hour' },
  { value: 'd', label: 'Day' },
  { value: 'w', label: 'Week' },
  { value: 'M', label: 'Month' },
];

export default function App() {
  const [beforeDate, setBeforeDate] = useState('2017-06-01');
  const [afterDate, setAfterDate] = useState('2017-06-30');
  const [intervalValue, setIntervalValue] = useState('1');
  const [intervalUnit, setIntervalUnit] = useState('d');
  const [urls, setUrls] = useState('');
  const [chartData, setChartData] = useState([]);
  const [urlKeys, setUrlKeys] = useState([]);
  const [mode, setMode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/health').then((res) => setMode(res.data.mode)).catch(() => {});
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const before = formatDate(new Date(beforeDate));
    const after = formatDate(new Date(afterDate));
    const interval = `${intervalValue}${intervalUnit}`;
    const urlList = urls
      .split('\n')
      .map((u) => u.trim())
      .filter(Boolean);

    try {
      const res = await axios.post('/api/page_views', {
        before,
        after,
        interval,
        urls: urlList,
      });

      const { chartData: rows, urlKeys: keys } = parseResponseData(res.data);
      setChartData(rows);
      setUrlKeys(keys);
      setMode(res.data.response?._meta?.mode || mode);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Request failed');
      setChartData([]);
      setUrlKeys([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Streem Page Views Demo</h1>
        <p className="subtitle">
          Elasticsearch date histogram — {mode === 'elasticsearch' ? 'live cluster' : 'mock data (offline)'}
        </p>
      </header>

      <main className="main">
        <form className="form" onSubmit={handleSubmit}>
          <div className="field-row">
            <label>
              Start date
              <input
                type="date"
                value={beforeDate}
                onChange={(e) => setBeforeDate(e.target.value)}
              />
            </label>
            <label>
              End date
              <input
                type="date"
                value={afterDate}
                onChange={(e) => setAfterDate(e.target.value)}
              />
            </label>
          </div>

          <div className="field-row">
            <label>
              Interval
              <input
                type="number"
                min="1"
                value={intervalValue}
                onChange={(e) => setIntervalValue(e.target.value)}
              />
            </label>
            <label>
              Unit
              <select value={intervalUnit} onChange={(e) => setIntervalUnit(e.target.value)}>
                {INTERVAL_UNITS.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="full-width">
            URLs to filter (one per line, optional)
            <textarea
              rows={3}
              placeholder="https://streem.com.au/&#10;https://streem.com.au/pricing"
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? 'Loading…' : 'Load histogram'}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        <section className="chart-section">
          <h2>Page views over time</h2>
          {chartData.length === 0 ? (
            <p className="empty">Submit the form to load chart data.</p>
          ) : (
            <ResponsiveContainer width="100%" height={420}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                {urlKeys.map((key, i) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    stackId="views"
                    fill={CHART_COLORS[i % CHART_COLORS.length]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          )}
        </section>
      </main>
    </div>
  );
}
