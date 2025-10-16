import React, { useState, useCallback } from 'react';
import { Icon } from './Icon';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB } from '../constants';

interface ImageUploaderProps {
  id: string;
  label: string;
  onImageChange: (file: File | null, previewUrl: string | null) => void;
  previewUrl: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ id, label, onImageChange, previewUrl }) => {
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      onImageChange(null, null);
      setError(null);
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError(`Invalid file type. Please use JPG, PNG, or WEBP.`);
      onImageChange(null, null);
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`File is too large (max ${MAX_FILE_SIZE_MB}MB).`);
      onImageChange(null, null);
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      onImageChange(file, reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [onImageChange]);

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onImageChange(null, null);
    const input = document.getElementById(id) as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  };

  return (
    <div className="w-full">
      <label htmlFor={id} className="cursor-pointer">
        <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-brand-primary dark:hover:border-brand-secondary transition-colors aspect-square w-full flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 overflow-hidden">
          {previewUrl ? (
            <>
              <img src={previewUrl} alt={label} className="object-cover w-full h-full" />
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/75 transition-colors"
                aria-label="Remove image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 p-4">
              <Icon name="upload" className="mx-auto h-12 w-12" />
              <span className="mt-2 block font-semibold">{label}</span>
              <p className="text-xs">JPG, PNG, WEBP up to {MAX_FILE_SIZE_MB}MB</p>
            </div>
          )}
        </div>
      </label>
      <input
        id={id}
        name={id}
        type="file"
        className="sr-only"
        accept={ACCEPTED_IMAGE_TYPES.join(',')}
        onChange={handleFileChange}
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};
