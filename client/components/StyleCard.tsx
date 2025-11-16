import { cn } from '@/lib/utils';
import { StyleName } from '@/utils/imageTransform';

interface StyleCardProps {
  name: StyleName;
  isSelected: boolean;
  onClick: () => void;
}

export function StyleCard({ name, isSelected, onClick }: StyleCardProps) {
  const getIcon = (style: StyleName): string => {
    switch (style) {
      case 'Ghibli Style':
        return '🎨';
      case 'Pencil Sketch':
        return '✏️';
      case 'Oil Painting':
        return '🖌️';
      case 'Cartoon Portrait':
        return '🎭';
    }
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-3 rounded-lg border-2 transition-all text-center min-w-32',
        isSelected
          ? 'border-teal-500 bg-teal-500/10'
          : 'border-slate-600 bg-slate-800 hover:border-slate-500'
      )}
    >
      <div className="text-2xl mb-2">{getIcon(name)}</div>
      <div className="text-sm font-medium text-slate-200">{name}</div>
    </button>
  );
}
