import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, API_URL } from '../context/AuthContext';
import { 
  Link2, Copy, Check, Trash2, BarChart2, Plus, 
  Loader2, AlertCircle, Calendar, ExternalLink, QrCode, X, Sparkles, Download
} from 'lucide-react';

const Dashboard = () => {
  const { token } = useAuth();
  
  // States
  const [urls, setUrls] = useState([]);
  const [inputUrl, setInputUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [activeQrModal, setActiveQrModal] = useState(null); // stores { shortUrl, qrCode, originalUrl }

  // Fetch URLs on component mount
  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const response = await fetch(`${API_URL}/api/urls`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch URLs');
      setUrls(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Shorten a new URL
  const handleShorten = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!inputUrl) {
      setError('Please provide a URL to shorten');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/urls/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ originalUrl: inputUrl }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to shorten URL');

      setUrls((prev) => [data, ...prev]);
      setInputUrl('');
      setSuccess('Link shortened successfully!');
      
      // Auto-clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete a URL
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this shortened URL? All visit analytics will be permanently removed.')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/urls/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete URL');

      setUrls((prev) => prev.filter((url) => url._id !== id));
      setSuccess('URL deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  // Copy to Clipboard
  const handleCopy = (id, shortCode) => {
    const baseUrl = API_URL;
    const fullShortUrl = `${baseUrl}/${shortCode}`;
    
    navigator.clipboard.writeText(fullShortUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Calculate Stat Summaries
  const totalUrls = urls.length;
  const totalClicks = urls.reduce((sum, item) => sum + (item.clicks || 0), 0);
  const topPerformer = urls.length > 0 ? [...urls].sort((a, b) => b.clicks - a.clicks)[0] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <div className="gradient-bg"></div>

      {/* Hero Welcome */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <span>Dashboard</span>
            <Sparkles className="h-6 w-6 text-indigo-400 pulse-glow" />
          </h1>
          <p className="mt-1.5 text-gray-400 text-sm">
            Shorten, organize, and monitor performance of your custom links.
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Card 1: Total Links */}
        <div className="glass-panel glass-panel-hover card-border-glow card-border-glow-indigo p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-5">
            <Link2 className="w-32 h-32 text-indigo-400" />
          </div>
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Short Links</p>
          <p className="text-4xl font-extrabold text-white mt-2">{isLoading ? '—' : totalUrls}</p>
          <div className="mt-4 text-xs text-indigo-400 font-medium">Created and active in database</div>
        </div>

        {/* Card 2: Total Clicks */}
        <div className="glass-panel glass-panel-hover card-border-glow card-border-glow-violet p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-5">
            <BarChart2 className="w-32 h-32 text-violet-400" />
          </div>
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Accumulated Clicks</p>
          <p className="text-4xl font-extrabold text-white mt-2">{isLoading ? '—' : totalClicks}</p>
          <div className="mt-4 text-xs text-violet-400 font-medium">Across all redirects created by you</div>
        </div>

        {/* Card 3: Top Performer */}
        <div className="glass-panel glass-panel-hover card-border-glow card-border-glow-indigo p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-5">
            <ExternalLink className="w-32 h-32 text-indigo-400" />
          </div>
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Top Performing Code</p>
          <p className="text-2xl font-bold text-white mt-3 truncate">
            {isLoading ? '—' : topPerformer ? `/${topPerformer.shortCode}` : 'None'}
          </p>
          <div className="mt-4 text-xs text-indigo-400 font-medium">
            {topPerformer ? `${topPerformer.clicks} redirections recorded` : 'No redirects tracked yet'}
          </div>
        </div>
      </div>

      {/* Input Shortener Area */}
      <div className="glass-panel card-border-glow p-6 sm:p-8 rounded-2xl mb-10 shadow-2xl relative z-20">
        <h2 className="text-lg font-bold text-white mb-4">Shorten a New Destination</h2>
        <form onSubmit={handleShorten} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow rounded-lg shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Link2 className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              required
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="block w-full pl-10 pr-3 py-3.5 bg-[#080B16] border border-white/5 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none input-focus-glow transition-all text-sm"
              placeholder="Paste link here: https://example.com/very/long/destination/url"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center space-x-1 px-6 py-3.5 border border-transparent rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:-translate-y-[1px] transition-all duration-200"
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Plus className="h-5 w-5" />
                <span>Shorten</span>
              </>
            )}
          </button>
        </form>

        {/* Action Feedbacks */}
        {error && (
          <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm font-medium flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-medium">
            {success}
          </div>
        )}
      </div>

      {/* Table Listing Area */}
      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden shadow-xl">
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Your Saved Links</h2>
          <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-400 font-semibold border border-white/5">
            {urls.length} Saved
          </span>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mb-4" />
            <p className="text-gray-400 text-sm">Retrieving your URLs...</p>
          </div>
        ) : urls.length === 0 ? (
          <div className="py-20 text-center">
            <Link2 className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-300 font-semibold">No shortened URLs yet</p>
            <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">
              Paste a URL in the form above and click shorten to generate your first link!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-color)] text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] bg-black/2 dark:bg-white/2">
                  <th className="px-6 py-4">Original URL</th>
                  <th className="px-6 py-4">Shortened URL</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="px-6 py-4 text-center">Clicks</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)] text-sm text-[var(--text-color)]">
                {urls.map((url) => {
                  const baseUrl = API_URL;
                  const fullShortUrl = `${baseUrl}/${url.shortCode}`;
                  
                  return (
                    <tr key={url._id} className="hover:bg-[var(--table-tr-hover)] transition-colors duration-150 group">
                      {/* Original URL */}
                      <td className="px-6 py-4 max-w-[280px]">
                        <div className="truncate text-[var(--text-color)] font-medium" title={url.originalUrl}>
                          {url.originalUrl}
                        </div>
                      </td>
                      
                      {/* Shortened URL */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2 text-indigo-500 dark:text-indigo-400 font-semibold">
                          <a 
                            href={fullShortUrl}
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="hover:underline hover:text-indigo-600 dark:hover:text-indigo-300 flex items-center space-x-1"
                          >
                            <span>/{url.shortCode}</span>
                            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                        </div>
                      </td>

                      {/* Created Date */}
                      <td className="px-6 py-4 text-[var(--text-muted)] text-xs">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{new Date(url.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}</span>
                        </div>
                      </td>

                      {/* Clicks */}
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20">
                          {url.clicks}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {/* Copy Button */}
                          <button
                            onClick={() => handleCopy(url._id, url.shortCode)}
                            title="Copy link"
                            className="p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-color)] transition-all"
                          >
                            {copiedId === url._id ? (
                              <Check className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>

                          {/* QR Code Button */}
                          {url.qrCode && (
                            <button
                              onClick={() => setActiveQrModal({
                                shortUrl: fullShortUrl,
                                qrCode: url.qrCode,
                                originalUrl: url.originalUrl
                              })}
                              title="View QR Code"
                              className="p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-color)] transition-all"
                            >
                              <QrCode className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                            </button>
                          )}

                          {/* Analytics Button */}
                          <Link
                            to={`/analytics/${url._id}`}
                            title="View details & analytics"
                            className="p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-color)] transition-all flex items-center justify-center"
                          >
                            <BarChart2 className="h-4 w-4 text-violet-500 dark:text-violet-400" />
                          </Link>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(url._id)}
                            title="Delete URL"
                            className="p-2 rounded-xl bg-rose-500/5 dark:bg-rose-500/5 border border-rose-500/10 hover:bg-rose-500/15 dark:hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QR Code Modal Popup */}
      {activeQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-sm p-6 rounded-2xl shadow-2xl relative border border-[var(--border-color)] animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setActiveQrModal(null)}
              className="absolute right-4 top-4 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-muted)] hover:text-[var(--text-color)] transition-all"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Content */}
            <div className="text-center mt-2">
              <h3 className="text-lg font-bold text-[var(--text-color)] mb-1">QR Code</h3>
              <p className="text-xs text-[var(--text-muted)] truncate px-4" title={activeQrModal.shortUrl}>
                {activeQrModal.shortUrl}
              </p>

              {/* QR Image */}
              <div className="my-6 p-4 bg-white rounded-xl inline-block shadow-md">
                <img 
                  src={activeQrModal.qrCode} 
                  alt="QR Code Representation" 
                  className="w-44 h-44 object-contain"
                />
              </div>

              {/* Action Buttons inside modal */}
              <div className="flex flex-col space-y-2">
                <a
                  href={activeQrModal.qrCode}
                  download={`qr-code-${activeQrModal.shortUrl.split('/').pop()}.png`}
                  className="w-full flex items-center justify-center space-x-1.5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl text-sm font-semibold hover:opacity-95 shadow-md shadow-indigo-500/10 transition-all"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Image</span>
                </a>
                
                <p className="text-[10px] text-[var(--text-muted)] mt-2 truncate px-2" title={activeQrModal.originalUrl}>
                  Destination: {activeQrModal.originalUrl}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
