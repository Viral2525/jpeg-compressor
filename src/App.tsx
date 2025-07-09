import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { ImageProcessor } from './components/ImageProcessor';
import { PDFProcessor } from './components/PDFProcessor';
import { Features } from './components/Features';
import { Footer } from './components/Footer';

export interface ImageFile {
  id: string;
  file: File;
  originalSize: number;
  compressedSize: number;
  quality: number;
  originalUrl: string;
  compressedUrl: string;
  compressedBlob: Blob | null;
  isProcessing: boolean;
  type: 'image';
}

export interface PDFFile {
  id: string;
  file: File;
  originalSize: number;
  compressedSize: number;
  quality: number;
  compressedBlob: Blob | null;
  isProcessing: boolean;
  type: 'pdf';
}

export type ProcessableFile = ImageFile | PDFFile;

function App() {
  const [uploadedFiles, setUploadedFiles] = useState<ProcessableFile[]>([]);

  const handleFilesUploaded = useCallback((files: File[]) => {
    const newFiles: ProcessableFile[] = files.map(file => {
      const baseFile = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        originalSize: file.size,
        compressedSize: 0,
        quality: 80,
        compressedBlob: null,
        isProcessing: false,
      };

      if (file.type.startsWith('image/')) {
        return {
          ...baseFile,
          originalUrl: URL.createObjectURL(file),
          compressedUrl: '',
          type: 'image' as const,
        };
      } else {
        return {
          ...baseFile,
          type: 'pdf' as const,
        };
      }
    });

    setUploadedFiles(prev => [...prev, ...newFiles]);
  }, []);

  const updateFile = useCallback((id: string, updates: Partial<ProcessableFile>) => {
    setUploadedFiles(prev => 
      prev.map(file => file.id === id ? { ...file, ...updates } : file)
    );
  }, []);

  const removeFile = useCallback((id: string) => {
    setUploadedFiles(prev => {
      const fileToRemove = prev.find(file => file.id === id);
      if (fileToRemove && fileToRemove.type === 'image') {
        URL.revokeObjectURL(fileToRemove.originalUrl);
        if (fileToRemove.compressedUrl) {
          URL.revokeObjectURL(fileToRemove.compressedUrl);
        }
      }
      return prev.filter(file => file.id !== id);
    });
  }, []);

  const getFileTypeText = () => {
    const imageCount = uploadedFiles.filter(f => f.type === 'image').length;
    const pdfCount = uploadedFiles.filter(f => f.type === 'pdf').length;
    
    if (imageCount > 0 && pdfCount > 0) {
      return `${imageCount} image${imageCount !== 1 ? 's' : ''} and ${pdfCount} PDF${pdfCount !== 1 ? 's' : ''}`;
    } else if (imageCount > 0) {
      return `${imageCount} image${imageCount !== 1 ? 's' : ''}`;
    } else {
      return `${pdfCount} PDF${pdfCount !== 1 ? 's' : ''}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {uploadedFiles.length === 0 ? (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Compress Images & PDFs
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Without Quality Loss
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Reduce your image and PDF file sizes by up to 90% while maintaining visual quality. 
                Fast, secure, and completely free.
              </p>
            </div>
            
            <FileUpload onFilesUploaded={handleFilesUploaded} />
            <Features />
          </>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">
                Processing {getFileTypeText()}
              </h2>
              <button
                onClick={() => {
                  uploadedFiles.forEach(file => {
                    if (file.type === 'image') {
                      URL.revokeObjectURL(file.originalUrl);
                      if (file.compressedUrl) URL.revokeObjectURL(file.compressedUrl);
                    }
                  });
                  setUploadedFiles([]);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Start Over
              </button>
            </div>

            <div className="grid gap-6">
              {uploadedFiles.map(file => (
                file.type === 'image' ? (
                  <ImageProcessor
                    key={file.id}
                    image={file}
                    onUpdate={updateFile}
                    onRemove={removeFile}
                  />
                ) : (
                  <PDFProcessor
                    key={file.id}
                    pdf={file}
                    onUpdate={updateFile}
                    onRemove={removeFile}
                  />
                )
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;