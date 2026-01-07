import React, { useCallback, useState } from 'react';
import { UploadedFile } from '../types';

interface ImageUploadProps {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  maxFiles?: number;
  maxFileSizeMB?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  files, 
  onFilesChange, 
  maxFiles = 5, 
  maxFileSizeMB = 5 
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFiles = useCallback(async (selectedFiles: FileList) => {
    setError(null);
    if (files.length + selectedFiles.length > maxFiles) {
      setError(`You can only upload a maximum of ${maxFiles} images.`);
      return;
    }

    const newFiles: UploadedFile[] = [...files];
    for (const file of Array.from(selectedFiles)) {
      if (file.size > maxFileSizeMB * 1024 * 1024) {
        setError(`File "${file.name}" is too large (max ${maxFileSizeMB}MB).`);
        continue;
      }
      if (!file.type.startsWith('image/')) {
        setError(`File "${file.name}" is not a valid image type.`);
        continue;
      }
      
      try {
        const base64Data = await fileToBase64(file);
        newFiles.push({
          name: file.name,
          type: file.type,
          data: base64Data,
        });
      } catch (e) {
        console.error("Error reading file:", e);
        setError(`Could not read file "${file.name}".`);
      }
    }
    
    onFilesChange(newFiles.slice(0, maxFiles));
  }, [files, maxFiles, maxFileSizeMB, onFilesChange]);

  const removeFile = (index: number) => {
    setError(null);
    onFilesChange(files.filter((_, i) => i !== index));
  };
  
  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  return (
    <div>
      <div 
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 ${
          isDragging ? 'border-brand-gold bg-yellow-50 scale-105' : 'border-gray-300'
        }`}
      >
        <input
          type="file"
          id="file-upload"
          multiple
          accept="image/*"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="sr-only"
          disabled={files.length >= maxFiles}
        />
        <label htmlFor="file-upload" className={`cursor-pointer ${files.length >= maxFiles ? 'cursor-not-allowed text-gray-400' : ''}`}>
          <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-10 w-10 ${isDragging ? 'text-brand-gold' : 'text-gray-400'} transition-colors`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="mt-2 text-sm text-gray-600">
              <span className={`font-semibold ${isDragging ? 'text-brand-navy' : 'text-brand-gold'}`}>Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">Max {maxFiles} images, up to {maxFileSizeMB}MB each</p>
          </div>
        </label>
      </div>

      <div className="mt-2 text-sm text-gray-600 flex justify-between">
        <span>{files.length} / {maxFiles} files uploaded</span>
        {files.length > 0 && <button type="button" onClick={() => onFilesChange([])} className="text-xs text-red-500 hover:underline">Clear all</button>}
      </div>
      {error && <p className="mt-2 text-sm text-red-600 animate-fade-in-up">{error}</p>}
      
      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative group aspect-w-1 aspect-h-1 animate-fade-in-up transition-transform duration-300 hover:-translate-y-1" style={{ animationDelay: `${index * 50}ms`}}>
              <img src={file.data} alt={file.name} className="object-cover w-full h-full rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl" />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-lg" aria-hidden="true" />
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-2 right-2 bg-white/70 backdrop-blur-sm text-brand-navy rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-125 hover:rotate-90 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                aria-label="Remove image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
               <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-white text-xs truncate opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-lg">
                {file.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};