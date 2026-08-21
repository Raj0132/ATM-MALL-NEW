import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import { exportToCsv } from './exportCsv';
import { Search, Download, RefreshCw, MailCheck, AlertCircle, Mail, Calendar } from 'lucide-react';

const CSV_COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'created_at', label: 'Subscribed At' },
  { key: 'email', label: 'Email' },
];

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchSubscribers = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    setError('');

    try {
      const { data, error: fetchErr } = await supabase
        .from('subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchErr) throw fetchErr;
      setSubscribers(data || []);
    } catch (err) {
      console.error('Error fetching subscribers:', err);
      setError(err.message || 'Failed to load subscribers from Supabase.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const filteredSubscribers = useMemo(() => {
    if (!search.trim()) return subscribers;
    const q = search.toLowerCase();
    return subscribers.filter((sub) => (sub.email || '').toLowerCase().includes(q));
  }, [subscribers, search]);

  const handleExport = () => {
    const filename = `atm-mall-subscribers-${new Date().toISOString().slice(0, 10)}`;
    exportToCsv(filename, filteredSubscribers, CSV_COLUMNS);
  };

  const formatDate = (isoString) => {
    if (!isoString) return '—';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Summary */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <MailCheck className="h-5 w-5 text-amber-400" />
            <span>Newsletter Subscribers</span>
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Total active subscribers: <strong className="text-amber-400 font-semibold">{subscribers.length}</strong>
            {search && filteredSubscribers.length !== subscribers.length && (
              <span> · Filtered: <strong className="text-slate-200">{filteredSubscribers.length}</strong></span>
            )}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => fetchSubscribers(true)}
            disabled={refreshing || loading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExport}
            disabled={!filteredSubscribers.length}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-400 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-200">
          <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-md">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by subscriber email..."
          className="w-full rounded-lg border border-slate-800 bg-slate-900/90 py-2 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute inset-y-0 right-0 pr-3 text-xs text-slate-500 hover:text-slate-300"
          >
            Clear
          </button>
        )}
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <RefreshCw className="h-6 w-6 animate-spin text-amber-400 mb-3" />
            <p className="text-xs">Loading subscribers from Supabase...</p>
          </div>
        ) : filteredSubscribers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
            <MailCheck className="h-10 w-10 text-slate-600 mb-3" />
            <h3 className="text-sm font-semibold text-slate-200">
              {search ? 'No matching subscribers found' : 'No subscribers yet'}
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-xs">
              {search
                ? `No email matched "${search}".`
                : 'When visitors subscribe to the footer newsletter, their emails will appear here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-800 bg-slate-950/70 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                <tr>
                  <th scope="col" className="px-4 py-3.5">#</th>
                  <th scope="col" className="px-4 py-3.5">Subscriber Email</th>
                  <th scope="col" className="px-4 py-3.5 whitespace-nowrap">Subscribed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-normal">
                {filteredSubscribers.map((sub, index) => (
                  <tr key={sub.id || index} className="hover:bg-slate-800/40 transition-colors">
                    {/* Index */}
                    <td className="px-4 py-3.5 text-slate-500 font-mono text-[11px] w-12">
                      {index + 1}
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3.5 font-medium text-white">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-slate-500 flex-shrink-0" />
                        <a href={`mailto:${sub.email}`} className="hover:text-amber-400 transition-colors">
                          {sub.email}
                        </a>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3.5 whitespace-nowrap text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 text-slate-500" />
                        <span>{formatDate(sub.created_at)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
