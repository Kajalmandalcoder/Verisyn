import { useState, useRef } from 'react';
import { Upload, Camera, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DragDropUploaderProps {
  onFileSelect: (file: File) => void;
  thumbnail?: string;
  onDelete?: () => void;
}

export function DragDropUploader({
  onFileSelect,
  thumbnail,
  onDelete,
}: DragDropUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        onFileSelect(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files[0]) {
      onFileSelect(files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center transition-all',
          isDragActive
            ? 'border-teal-500 bg-teal-500/10'
            : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture
          onChange={handleFileChange}
          className="hidden"
        />

        <Upload className="w-12 h-12 mx-auto text-slate-400 mb-3" />
        <p className="text-slate-300 text-sm mb-4">
          Drag & drop your image here, or use the buttons below
        </p>
      </div>

      {thumbnail && (
        <div className="rounded-lg overflow-hidden bg-slate-800 border border-slate-700">
          <img
            src={thumbnail}
            alt="Preview"
            className="w-full h-40 object-cover"
          />
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
        >
          Choose Image
        </button>
        <button
          onClick={() => cameraInputRef.current?.click()}
          className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
        >
          <Camera className="w-4 h-4" />
          Camera
        </button>
        {thumbnail && (
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
