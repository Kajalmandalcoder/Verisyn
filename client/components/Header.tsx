import { Link, useLocation } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Lock className="w-6 h-6 text-teal-500" />
            <span className="text-white">CrypTure</span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className={cn(
                'transition-colors font-medium',
                isActive('/')
                  ? 'text-teal-400'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              Home
            </Link>
            <Link
              to="/files"
              className={cn(
                'transition-colors font-medium',
                isActive('/files')
                  ? 'text-teal-400'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              My Files
            </Link>
            <Link
              to="/sharing"
              className={cn(
                'transition-colors font-medium',
                isActive('/sharing')
                  ? 'text-teal-400'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              Sharing
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
