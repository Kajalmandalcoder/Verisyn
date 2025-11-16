import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import {
  getFile,
  getSharingSettings,
  saveSharingSettings,
  getRecipientsByFileId,
  addRecipient,
  generateSecureLink,
  FileEntry,
  RecipientEntry,
} from '@/utils/localStorage';
import { Copy, Check, Lock, Eye, Clock, UserPlus, Trash2 } from 'lucide-react';

export default function SharingSettings() {
  const [searchParams] = useSearchParams();
  const fileId = searchParams.get('fileId');
  const [file, setFile] = useState<FileEntry | null>(null);
  const [hasPassword, setHasPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [viewOnly, setViewOnly] = useState(false);
  const [expiryHours, setExpiryHours] = useState(24);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipients, setRecipients] = useState<RecipientEntry[]>([]);
  const [copied, setCopied] = useState(false);
  const [secureLink, setSecureLink] = useState('');

  useEffect(() => {
    if (fileId) {
      const fileData = getFile(fileId);
      if (fileData) {
        setFile(fileData);
        const settings = getSharingSettings(fileId);
        if (settings) {
          setHasPassword(settings.hasPassword);
          setPassword(settings.password || '');
          setViewOnly(settings.viewOnly);
          setExpiryHours(settings.expiryHours);
        }
        const link = generateSecureLink(fileId);
        setSecureLink(link);
        setRecipients(getRecipientsByFileId(fileId));
      }
    }
  }, [fileId]);

  const handleSaveSettings = () => {
    if (!fileId) return;

    const settings = {
      fileId,
      hasPassword,
      password: hasPassword ? password : undefined,
      viewOnly,
      expiryHours,
      createdAt: Date.now(),
    };

    saveSharingSettings(settings);
  };

  const handleAddRecipient = () => {
    if (!recipientEmail.trim() || !fileId) return;

    const newRecipient: RecipientEntry = {
      id: `recipient_${Date.now()}`,
      fileId,
      email: recipientEmail,
      dateShared: Date.now(),
      status: 'active',
    };

    addRecipient(newRecipient);
    setRecipients([...recipients, newRecipient]);
    setRecipientEmail('');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(secureLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!file) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <p className="text-slate-400 mb-6">File not found</p>
            <Link
              to="/sharing"
              className="inline-block px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors font-medium"
            >
              Back to Sharing
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="max-w-3xl space-y-8">
          {/* Header */}
          <div>
            <Link
              to="/sharing"
              className="text-teal-400 hover:text-teal-300 text-sm font-medium mb-4 inline-block"
            >
              ← Back to Sharing
            </Link>
            <h2 className="text-3xl font-bold text-white mb-2">Sharing Settings</h2>
            <p className="text-slate-400">
              Configure how your transformed image is shared
            </p>
          </div>

          {/* File Preview */}
          <div className="rounded-lg border border-slate-600 bg-slate-800 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="aspect-square rounded overflow-hidden">
                <img
                  src={file.transformedImage}
                  alt={file.style}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:col-span-2 flex flex-col justify-center space-y-3">
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">
                    Style
                  </p>
                  <p className="text-white font-semibold">{file.style}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">
                    Created
                  </p>
                  <p className="text-white">{formatDate(file.timestamp)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sharing Settings */}
          <div className="space-y-6">
            <div className="rounded-lg border border-slate-600 bg-slate-800 p-6">
              <h3 className="text-lg font-bold text-white mb-6">Access Controls</h3>

              <div className="space-y-6">
                {/* Password Protection */}
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasPassword}
                      onChange={(e) => setHasPassword(e.target.checked)}
                      className="w-4 h-4 rounded accent-teal-500"
                    />
                    <Lock className="w-5 h-5 text-slate-400" />
                    <span className="text-white font-medium">Password Protected</span>
                  </label>
                  {hasPassword && (
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="ml-7 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 text-sm"
                    />
                  )}
                </div>

                {/* View Only */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={viewOnly}
                      onChange={(e) => setViewOnly(e.target.checked)}
                      className="w-4 h-4 rounded accent-teal-500"
                    />
                    <Eye className="w-5 h-5 text-slate-400" />
                    <span className="text-white font-medium">View Only (No Download)</span>
                  </label>
                </div>

                {/* Expiry Slider */}
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-slate-400" />
                    <span className="text-white font-medium">Link Expiry</span>
                    <span className="ml-auto text-teal-400 font-semibold">
                      {expiryHours}h
                    </span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="72"
                    value={expiryHours}
                    onChange={(e) => setExpiryHours(parseInt(e.target.value))}
                    className="w-full accent-teal-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>1 hour</span>
                    <span>72 hours</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSaveSettings}
                className="mt-6 w-full px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors font-medium"
              >
                Save Settings
              </button>
            </div>

            {/* Secure Link */}
            <div className="rounded-lg border border-slate-600 bg-slate-800 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Share Link</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={secureLink}
                  readOnly
                  className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-300 text-sm"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-green-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="text-xs">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Recipients */}
            <div className="rounded-lg border border-slate-600 bg-slate-800 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Recipients Log</h3>

              <div className="space-y-3 mb-6">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="Enter recipient email"
                    className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 text-sm"
                  />
                  <button
                    onClick={handleAddRecipient}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
                  >
                    <UserPlus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>

              {recipients.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-6">
                  No recipients yet. Add one to track sharing.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-2 px-3 text-slate-400 font-medium">
                          Email
                        </th>
                        <th className="text-left py-2 px-3 text-slate-400 font-medium">
                          Date Shared
                        </th>
                        <th className="text-left py-2 px-3 text-slate-400 font-medium">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recipients.map((recipient) => (
                        <tr
                          key={recipient.id}
                          className="border-b border-slate-700/50 hover:bg-slate-700/30"
                        >
                          <td className="py-3 px-3 text-slate-200">
                            {recipient.email}
                          </td>
                          <td className="py-3 px-3 text-slate-400">
                            {formatDate(recipient.dateShared)}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`text-xs font-medium px-2 py-1 rounded ${
                                recipient.status === 'active'
                                  ? 'bg-green-900/30 text-green-300'
                                  : 'bg-red-900/30 text-red-300'
                              }`}
                            >
                              {recipient.status === 'active' ? 'Active' : 'Expired'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
