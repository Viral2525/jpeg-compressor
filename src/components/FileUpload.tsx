import React, { useCallback, useState } from 'react';
import { Upload, File, X, Image, FileText } from 'lucide-react';

interface FileUploadProps {
  onFilesUploaded: (files: File[]) => void;
}

export function FileUpload({ onFilesUploaded }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/') || file.type === 'application/pdf'
    );
    
    if (files.length > 0) {
      setSelectedFiles(files);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(file => 
      file.type.startsWith('image/') || file.type === 'application/pdf'
    );
    
    if (files.length > 0) {
      setSelectedFiles(files);
    }
  }, []);

  const handleUpload = useCallback(() => {
    if (selectedFiles.length > 0) {
      onFilesUploaded(selectedFiles);
      setSelectedFiles([]);
    }
  }, [selectedFiles, onFilesUploaded]);

  const removeFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-5 h-5 text-blue-500" />;
    } else if (file.type === 'application/pdf') {
      return <FileText className="w-5 h-5 text-red-500" />;
    }
    return <File className="w-5 h-5 text-gray-400" />;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
          isDragOver
            ? 'border-blue-500 bg-blue-50/50 scale-105'
            : 'border-gray-300 hover:border-gray-400 bg-white/50'
        } backdrop-blur-sm`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-6">
          <div className={`p-4 rounded-full transition-all duration-300 ${
            isDragOver ? 'bg-blue-100 scale-110' : 'bg-gray-100'
          }`}>
            <Upload className={`w-12 h-12 transition-colors ${
              isDragOver ? 'text-blue-600' : 'text-gray-400'
            }`} />
          </div>
          
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              {isDragOver ? 'Drop your files here' : 'Upload your files'}
            </h3>
            <p className="text-gray-600 mb-6">
              Drop files here or click to browse. Supports JPEG, PNG, WebP, and PDF formats.
            </p>
            
            <label className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all cursor-pointer transform hover:scale-105">
              <Upload className="w-4 h-4 mr-2" />
              Choose Files
              <input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">
              Selected Files ({selectedFiles.length})
            </h4>
            <button
              onClick={handleUpload}
              className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all transform hover:scale-105"
            >
              Start Compression
            </button>
          </div>
          
          <div className="space-y-3">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getFileIcon(file)}
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.size)} • {file.type.startsWith('image/') ? 'Image' : 'PDF'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}