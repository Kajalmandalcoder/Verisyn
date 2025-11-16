import { useState } from 'react';
import { Header } from '@/components/Header';
import { DragDropUploader } from '@/components/DragDropUploader';
import { StyleCard } from '@/components/StyleCard';
import { PreviewPane } from '@/components/PreviewPane';
import { SecureLinkBar } from '@/components/SecureLinkBar';
import { transformImage, StyleName } from '@/utils/imageTransform';
import { saveFile, generateSecureLink } from '@/utils/localStorage';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<StyleName>('Ghibli Style');
  const [transformedImage, setTransformedImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [secureLink, setSecureLink] = useState<string>('');

  const styles: StyleName[] = [
    'Ghibli Style',
    'Pencil Sketch',
    'Oil Painting',
    'Cartoon Portrait',
  ];

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setThumbnail(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = () => {
    setSelectedFile(null);
    setThumbnail('');
    setTransformedImage('');
    setSecureLink('');
  };

  const handleGeneratePreview = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    try {
      const transformed = await transformImage(selectedFile, selectedStyle);
      setTransformedImage(transformed);

      const fileId = `file_${Date.now()}`;
      const newFile = {
        id: fileId,
        originalImage: thumbnail,
        transformedImage: transformed,
        style: selectedStyle,
        timestamp: Date.now(),
        secureLink: '',
      };

      saveFile(newFile);
      const link = generateSecureLink(fileId);
      setSecureLink(link);
    } catch (error) {
      console.error('Error transforming image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSecureLink = () => {
    if (transformedImage) {
      handleGeneratePreview();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Upload & Transform</h2>

            <DragDropUploader
              onFileSelect={handleFileSelect}
              thumbnail={thumbnail}
              onDelete={handleDelete}
            />

            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
                Choose Style
              </h3>
              <div className="flex flex-wrap gap-3">
                {styles.map((style) => (
                  <StyleCard
                    key={style}
                    name={style}
                    isSelected={selectedStyle === style}
                    onClick={() => setSelectedStyle(style)}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleGeneratePreview}
              disabled={!selectedFile || isLoading}
              className="w-full px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-600/50 text-white rounded-lg transition-colors font-semibold"
            >
              {isLoading ? 'Generating...' : 'Generate Preview'}
            </button>
          </div>

          {/* Right Side */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Preview</h2>
            <PreviewPane
              imageUrl={transformedImage}
              isLoading={isLoading}
              style={selectedStyle}
            />
            <SecureLinkBar
              fileId={`file_${Date.now()}`}
              secureLink={secureLink}
              onGenerateLink={handleGenerateSecureLink}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
