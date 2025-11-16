import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { getMyFiles, deleteFile, FileEntry } from '@/utils/localStorage';
import { Trash2, Settings, Calendar, Palette } from 'lucide-react';

export default function MyFiles() {
  const [files, setFiles] = useState<FileEntry[]>([]);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = () => {
    const myFiles = getMyFiles();
    setFiles(myFiles.sort((a, b) => b.timestamp - a.timestamp));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      deleteFile(id);
      loadFiles();
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">My Files</h2>
            <p className="text-slate-400">
              {files.length === 0
                ? 'No transformed images yet. Create one on the home page.'
                : `You have ${files.length} transformed image${files.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          {files.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-400 mb-6">
                Start by uploading and transforming an image on the home page
              </p>
              <Link
                to="/"
                className="inline-block px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors font-medium"
              >
                Go to Home
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="rounded-lg border border-slate-600 bg-slate-800 overflow-hidden hover:border-slate-500 transition-colors"
                >
                  {/* Image Thumbnail */}
                  <div className="aspect-square overflow-hidden bg-slate-900">
                    <img
                      src={file.transformedImage}
                      alt={file.style}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </div>

                  {/* File Info */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Palette className="w-4 h-4 text-teal-400" />
                      <span className="text-sm font-medium">{file.style}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(file.timestamp)}</span>
                    </div>

                    {file.secureLink && (
                      <div className="bg-slate-700/50 rounded p-2 text-xs text-teal-300 truncate">
                        {file.secureLink}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Link
                        to={`/sharing-settings?fileId=${file.id}`}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 rounded transition-colors text-sm font-medium"
                      >
                        <Settings className="w-4 h-4" />
                        Manage
                      </Link>
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="px-3 py-2 bg-red-900/20 hover:bg-red-900/30 text-red-300 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
