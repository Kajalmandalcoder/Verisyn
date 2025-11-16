import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface SecureLinkBarProps {
  fileId: string;
  secureLink: string;
  onGenerateLink: () => void;
  isLoading?: boolean;
}

export function SecureLinkBar({
  fileId,
  secureLink,
  onGenerateLink,
  isLoading,
}: SecureLinkBarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(secureLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="mt-4 p-4 bg-slate-800 border border-slate-600 rounded-lg space-y-3">
      <div className="flex gap-2">
        <button
          onClick={onGenerateLink}
          disabled={isLoading || !secureLink}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-600/50 text-white rounded-lg transition-colors font-medium"
        >
          {secureLink ? 'Regenerate Link' : 'Generate Secure Link'}
        </button>
      </div>

      {secureLink && (
        <div className="flex gap-2">
          <input
            type="text"
            value={secureLink}
            readOnly
            className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-300 text-sm"
          />
          <button
            onClick={handleCopy}
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
      )}
    </div>
  );
}
