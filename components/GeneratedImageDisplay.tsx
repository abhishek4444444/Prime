import React from 'react';
import { Icon } from './Icon';

interface GeneratedImageDisplayProps {
  generatedImage: string | null;
  isLoading: boolean;
  error: string | null;
  onDownload: () => void;
  onRegenerate: () => void;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-primary dark:border-brand-secondary"></div>
    <p className="mt-4 text-gray-600 dark:text-gray-300 font-semibold animate-pulse-fast">Fusing images...</p>
    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">This can take a moment.</p>
  </div>
);

export const GeneratedImageDisplay: React.FC<GeneratedImageDisplayProps> = ({
  generatedImage,
  isLoading,
  error,
  onDownload,
  onRegenerate,
}) => {
  return (
    <div className="relative aspect-square w-full bg-gray-100 dark:bg-gray-800/50 rounded-xl flex items-center justify-center p-4 border border-gray-200 dark:border-gray-700">
      {isLoading && <LoadingSpinner />}
      {!isLoading && error && (
        <div className="text-center text-red-500">
          <p className="font-bold">Generation Failed</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}
      {!isLoading && !error && generatedImage && (
        <>
          <img src={generatedImage} alt="Generated fusion" className="object-contain w-full h-full rounded-lg" />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
             <button
              onClick={onDownload}
              className="flex items-center gap-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm text-gray-800 dark:text-gray-200 px-4 py-2 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform"
            >
              <Icon name="download" />
              Download
            </button>
            <button
              onClick={onRegenerate}
              className="flex items-center gap-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm text-gray-800 dark:text-gray-200 px-4 py-2 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform"
            >
              <Icon name="regenerate" />
              Regenerate
            </button>
          </div>
        </>
      )}
       {!isLoading && !error && !generatedImage && (
        <div className="text-center text-gray-500 dark:text-gray-400">
            <p className="text-lg font-semibold">Your masterpiece awaits</p>
            <p className="text-sm">Upload two images and a prompt to begin.</p>
        </div>
       )}
    </div>
  );
};
