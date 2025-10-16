import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { GeneratedImageDisplay } from './components/GeneratedImageDisplay';
import { ArtStyle } from './types';
import { ART_STYLES, PROMPT_CHAR_LIMIT } from './constants';
import { generateFusedImage } from './services/geminiService';

type Theme = 'light' | 'dark';

export default function App() {
  const [theme, setTheme] = useState<Theme>('dark');

  const [imageAFile, setImageAFile] = useState<File | null>(null);
  const [imageBFile, setImageBFile] = useState<File | null>(null);
  const [previewA, setPreviewA] = useState<string | null>(null);
  const [previewB, setPreviewB] = useState<string | null>(null);

  const [prompt, setPrompt] = useState<string>('');
  const [artStyle, setArtStyle] = useState<ArtStyle>(ArtStyle.REALISTIC);
  const [creativity, setCreativity] = useState<number>(50);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleImageAChange = useCallback((file: File | null, previewUrl: string | null) => {
    setImageAFile(file);
    setPreviewA(previewUrl);
  }, []);

  const handleImageBChange = useCallback((file: File | null, previewUrl: string | null) => {
    setImageBFile(file);
    setPreviewB(previewUrl);
  }, []);

  const constructFinalPrompt = useCallback(() => {
    return `Merge the two provided images based on the following instructions: "${prompt}". The desired art style is ${artStyle}. The creativity level for this fusion should be set to ${creativity} out of 100. Produce a single, cohesive, high-quality image.`;
  }, [prompt, artStyle, creativity]);

  const handleGenerate = useCallback(async () => {
    if (!imageAFile || !previewA || !imageBFile || !previewB || !prompt) {
      setError("Please upload both images and provide a prompt.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const finalPrompt = constructFinalPrompt();
      const result = await generateFusedImage(
        { base64: previewA, mimeType: imageAFile.type },
        { base64: previewB, mimeType: imageBFile.type },
        finalPrompt
      );
      setGeneratedImage(result);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [imageAFile, previewA, imageBFile, previewB, prompt, constructFinalPrompt]);
  
  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `fusion-ai-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const canGenerate = imageAFile && imageBFile && prompt.trim().length > 0 && !isLoading;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors">
      <Header theme={theme} setTheme={setTheme} />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column: Inputs */}
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              <ImageUploader id="imageA" label="Upload Image A" onImageChange={handleImageAChange} previewUrl={previewA} />
              <ImageUploader id="imageB" label="Upload Image B" onImageChange={handleImageBChange} previewUrl={previewB} />
            </div>

            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Custom Prompt</label>
              <textarea
                id="prompt"
                rows={4}
                maxLength={PROMPT_CHAR_LIMIT}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
                placeholder="e.g., Combine both faces into a fantasy portrait..."
              />
               <p className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">{prompt.length} / {PROMPT_CHAR_LIMIT}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="artStyle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Art Style</label>
                    <select
                        id="artStyle"
                        value={artStyle}
                        onChange={(e) => setArtStyle(e.target.value as ArtStyle)}
                        className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
                    >
                        {ART_STYLES.map(style => (
                            <option key={style.value} value={style.value}>{style.label}</option>
                        ))}
                    </select>
                </div>
                 <div>
                    <label htmlFor="creativity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Creativity Strength ({creativity})</label>
                    <input
                        id="creativity"
                        type="range"
                        min="0"
                        max="100"
                        value={creativity}
                        onChange={(e) => setCreativity(parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-primary dark:accent-brand-secondary"
                    />
                </div>
            </div>
             
             <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className="w-full text-lg font-bold text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 py-3 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              >
                {isLoading ? 'Generating...' : 'Generate Image'}
              </button>
          </div>

          {/* Right Column: Output */}
          <div className="w-full">
            <GeneratedImageDisplay
              generatedImage={generatedImage}
              isLoading={isLoading}
              error={error}
              onDownload={handleDownload}
              onRegenerate={handleGenerate}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
