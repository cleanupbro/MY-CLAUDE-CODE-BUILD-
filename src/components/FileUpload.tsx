import React, { useCallback, useState } from 'react';
import { UploadedFile } from '../types';

interface FileUploadProps {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  maxFiles?: number;
  maxFileSizeMB?: number;
  acceptedFileTypes?: string[];
  label?: string;
  description?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  files,
  onFilesChange,
  maxFiles = 2,
  maxFileSizeMB = 5,
  acceptedFileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  label = "Upload files",
  description = `Max ${maxFiles} files, up to ${maxFileSizeMB}MB each`,
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
      setError(`You can only upload a maximum of ${maxFiles} files.`);
      return;
    }

    const newFiles: UploadedFile[] = [...files];
    for (const file of Array.from(selectedFiles)) {
      if (file.size > maxFileSizeMB * 1024 * 1024) {
        setError(`File "${file.name}" is too large (max ${maxFileSizeMB}MB).`);
        continue;
      }
      if (acceptedFileTypes && !acceptedFileTypes.includes(file.type)) {
         setError(`File type for "${file.name}" is not supported. Please upload PDF, DOC, or DOCX files.`);
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
  }, [files, maxFiles, maxFileSizeMB, onFilesChange, acceptedFileTypes]);

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
  
  const acceptedTypesString = '.pdf,.doc,.docx';

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
          id="file-upload-generic"
          multiple
          accept={acceptedTypesString}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="sr-only"
          disabled={files.length >= maxFiles}
        />
        <label htmlFor="file-upload-generic" className={`cursor-pointer ${files.length >= maxFiles ? 'cursor-not-allowed text-gray-400' : ''}`}>
          <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-10 w-10 ${isDragging ? 'text-brand-gold' : 'text-gray-400'} transition-colors`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <p className="mt-2 text-sm text-gray-600">
              <span className={`font-semibold ${isDragging ? 'text-brand-navy' : 'text-brand-gold'}`}>{label}</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        </label>
      </div>

      <div className="mt-2 text-sm text-gray-600 flex justify-between">
        <span>{files.length} / {maxFiles} files uploaded</span>
        {files.length > 0 && <button type="button" onClick={() => onFilesChange([])} className="text-xs text-red-500 hover:underline">Clear all</button>}
      </div>
      {error && <p className="mt-2 text-sm text-red-600 animate-fade-in-up">{error}</p>}

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded-lg animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
              <div className="flex items-center min-w-0">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-800 truncate">{file.name}</span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="bg-gray-200 text-gray-600 rounded-full p-1 ml-2 flex-shrink-0 hover:bg-red-200 hover:text-red-700 transition-all transform hover:scale-110"
                aria-label={`Remove ${file.name}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
