import { Loader2 } from 'lucide-react';

interface PreviewPaneProps {
  imageUrl?: string;
  isLoading?: boolean;
  style?: string;
}

export function PreviewPane({ imageUrl, isLoading, style }: PreviewPaneProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-600 bg-slate-800 aspect-square flex items-center justify-center min-h-96 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-10 h-10 text-teal-500 animate-spin" />
            <p className="text-slate-300 text-sm">Transforming image...</p>
          </div>
        ) : imageUrl ? (
          <div className="relative w-full h-full">
            <img
              src={imageUrl}
              alt="Transformed"
              className="w-full h-full object-cover"
            />
            {style && (
              <div className="absolute bottom-3 right-3 bg-black/60 px-3 py-1 rounded text-xs text-teal-300">
                {style}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-slate-400 text-sm">Upload an image and click "Generate Preview" to see the transformation</p>
          </div>
        )}
      </div>
    </div>
  );
}
