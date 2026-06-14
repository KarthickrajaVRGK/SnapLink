import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';
import { 
  ArrowLeft, Calendar, Globe, BarChart2, ExternalLink, 
  Loader2, AlertCircle, Clock, ShieldAlert, Monitor, Compass
} from 'lucide-react';

const UrlAnalytics = () => {
  const { id } = useParams();
  const { token } = useAuth();

  // States
  const [urlData, setUrlData] = useState(null);
  const [visits, setVisits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, [id]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${API_URL}/api/urls/${id}/analytics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch analytics');

      setUrlData(data.url);
      setVisits(data.analytics);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to parse browser from User-Agent string
  const parseBrowser = (ua) => {
    if (!ua || ua === 'Unknown') return 'Unknown';
    if (ua.includes('Firefox')) return 'Mozilla Firefox';
    if (ua.includes('SamsungBrowser')) return 'Samsung Browser';
    if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
    if (ua.includes('Trident')) return 'Internet Explorer';
    if (ua.includes('Edge')) return 'Microsoft Edge';
    if (ua.includes('Chrome')) return 'Google Chrome';
    if (ua.includes('Safari')) return 'Apple Safari';
    return 'Generic Web Agent';
  };

  // Stats summaries
  const totalClicks = urlData?.clicks || 0;
  const uniqueIps = new Set(visits.map((v) => v.ipAddress)).size;
  const lastVisited = visits.length > 0 ? new Date(visits[0].timestamp).toLocaleString() : 'Never';

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#0B0F19]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Aggregating link analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="gradient-bg"></div>
        <div className="glass-panel p-8 rounded-2xl border border-rose-500/20 inline-block">
          <ShieldAlert className="h-12 w-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Failed to load analytics</h2>
          <p className="text-gray-400 text-sm mb-6">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg text-sm transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  const baseUrl = API_URL;
  const fullShortUrl = urlData ? `${baseUrl}/${urlData.shortCode}` : '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <div className="gradient-bg"></div>

      {/* Back to Dashboard */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center space-x-1.5 text-gray-400 hover:text-white text-sm transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
          <span>Link Analytics</span>
          <BarChart2 className="h-6 w-6 text-violet-400" />
        </h1>
        <p className="mt-1 text-gray-400 text-sm">
          Track visitor engagement details, IP sources, and browsers for link code <strong className="text-indigo-400">/{urlData?.shortCode}</strong>.
        </p>
      </div>

      {/* URL Meta Information Section */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 mb-8 shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Original Destination</span>
              <a 
                href={urlData?.originalUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-1 flex items-center space-x-1.5 text-gray-100 hover:text-white font-medium text-lg hover:underline break-all"
              >
                <span>{urlData?.originalUrl}</span>
                <ExternalLink className="h-4 w-4 shrink-0 text-gray-500" />
              </a>
            </div>
            
            <div className="pt-2 flex flex-col sm:flex-row gap-4 sm:gap-10">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Shortened URL</span>
                <div className="mt-1 text-indigo-400 font-semibold text-lg">
                  <a href={fullShortUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {fullShortUrl}
                  </a>
                </div>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Date Generated</span>
                <div className="mt-1 text-gray-300 text-sm flex items-center space-x-1.5 py-1">
                  <Calendar className="h-4 w-4 text-violet-400" />
                  <span>{urlData && new Date(urlData.createdAt).toLocaleDateString(undefined, {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mini QR Box */}
          {urlData?.qrCode && (
            <div className="flex items-center lg:justify-end border-t lg:border-t-0 lg:border-l border-white/5 pt-4 lg:pt-0 lg:pl-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-white rounded-lg">
                  <img src={urlData.qrCode} alt="QR representation" className="w-16 h-16" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">QR Code Active</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Scan to redirect instantly</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Clicks */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center space-x-4">
          <div className="p-3.5 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
            <BarChart2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Clicks</p>
            <p className="text-2xl font-extrabold text-white mt-0.5">{totalClicks}</p>
          </div>
        </div>

        {/* Unique IPs */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center space-x-4">
          <div className="p-3.5 bg-violet-500/10 rounded-xl text-violet-400 border border-violet-500/20">
            <Globe className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Unique Visitors</p>
            <p className="text-2xl font-extrabold text-white mt-0.5">{uniqueIps}</p>
          </div>
        </div>

        {/* Last Visited */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center space-x-4">
          <div className="p-3.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Last Visited</p>
            <p className="text-sm font-bold text-white mt-1.5 truncate max-w-[190px]" title={lastVisited}>
              {lastVisited}
            </p>
          </div>
        </div>
      </div>

      {/* Visits Table */}
      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden shadow-xl">
        <div className="px-6 py-5 border-b border-white/5">
          <h2 className="text-lg font-bold text-white">Recent Visit History</h2>
        </div>

        {visits.length === 0 ? (
          <div className="py-20 text-center">
            <AlertCircle className="h-10 w-10 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-300 font-semibold">No visits logged yet</p>
            <p className="text-gray-500 text-sm mt-1">
              Share your shortened URL. Visitor details will show here in real-time as clicks happen.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-xs font-semibold uppercase tracking-wider text-gray-400 bg-white/2">
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Visitor IP Address</th>
                  <th className="px-6 py-4">Browser/Agent</th>
                  <th className="px-6 py-4">Referrer Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                {visits.map((visit) => (
                  <tr key={visit._id} className="hover:bg-white/2 transition-colors">
                    {/* Timestamp */}
                    <td className="px-6 py-4 text-xs font-semibold text-gray-300">
                      {new Date(visit.timestamp).toLocaleString()}
                    </td>
                    
                    {/* Visitor IP */}
                    <td className="px-6 py-4 font-mono text-xs text-indigo-300">
                      {visit.ipAddress === '::1' || visit.ipAddress === '127.0.0.1' ? '127.0.0.1 (Localhost)' : visit.ipAddress}
                    </td>
                    
                    {/* User Agent Browser */}
                    <td className="px-6 py-4 text-xs text-gray-300">
                      <div className="flex items-center space-x-1.5" title={visit.userAgent}>
                        <Monitor className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                        <span>{parseBrowser(visit.userAgent)}</span>
                      </div>
                    </td>

                    {/* Referrer */}
                    <td className="px-6 py-4 text-xs">
                      <div className="flex items-center space-x-1.5">
                        <Compass className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          visit.referrer === 'Direct' 
                            ? 'bg-gray-500/10 text-gray-400 border border-gray-500/20' 
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {visit.referrer}
                        </span>
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
};

export default UrlAnalytics;
