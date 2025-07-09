import React, { useEffect, useState, useCallback } from 'react';
import { Download, Trash2, RotateCcw, Maximize2 } from 'lucide-react';
import { ImageFile } from '../App';

interface ImageProcessorProps {
  image: ImageFile;
  onUpdate: (id: string, updates: Partial<ImageFile>) => void;
  onRemove: (id: string) => void;
}

export function ImageProcessor({ image, onUpdate, onRemove }: ImageProcessorProps) {
  const [isCompressing, setIsCompressing] = useState(false);

  const compressImage = useCallback(async (file: File, quality: number): Promise<{ blob: Blob; url: string }> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            resolve({ blob, url });
          }
        }, file.type, quality / 100);
      };
      
      img.src = image.originalUrl;
    });
  }, [image.originalUrl]);

  const handleQualityChange = useCallback(async (newQuality: number) => {
    setIsCompressing(true);
    onUpdate(image.id, { quality: newQuality, isProcessing: true });

    try {
      const { blob, url } = await compressImage(image.file, newQuality);
      
      if (image.compressedUrl) {
        URL.revokeObjectURL(image.compressedUrl);
      }
      
      onUpdate(image.id, {
        quality: newQuality,
        compressedUrl: url,
        compressedBlob: blob,
        compressedSize: blob.size,
        isProcessing: false,
      });
    } catch (error) {
      console.error('Compression failed:', error);
      onUpdate(image.id, { isProcessing: false });
    }
    
    setIsCompressing(false);
  }, [image, compressImage, onUpdate]);

  useEffect(() => {
    if (!image.compressedUrl) {
      handleQualityChange(image.quality);
    }
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCompressionRatio = () => {
    if (image.compressedSize === 0) return 0;
    return Math.round((1 - image.compressedSize / image.originalSize) * 100);
  };

  const handleDownload = () => {
    if (image.compressedBlob) {
      const link = document.createElement('a');
      link.href = image.compressedUrl;
      link.download = `compressed_${image.file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {image.file.name}
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleQualityChange(80)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Reset quality"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => onRemove(image.id)}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Remove image"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Image Comparison */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Original</h4>
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden group">
              <img 
                src={image.originalUrl} 
                alt="Original" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <Maximize2 className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <p className="text-sm text-gray-500">{formatFileSize(image.originalSize)}</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Compressed</h4>
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden group">
              {image.compressedUrl ? (
                <>
                  <img 
                    src={image.compressedUrl} 
                    alt="Compressed" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <Maximize2 className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {image.compressedSize ? formatFileSize(image.compressedSize) : 'Processing...'}
            </p>
          </div>
        </div>

        {/* Quality Control */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Quality: {image.quality}%
            </label>
            {image.compressedSize > 0 && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-emerald-600 font-medium">
                  {getCompressionRatio()}% smaller
                </span>
                <button
                  onClick={handleDownload}
                  disabled={!image.compressedBlob}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <input
              type="range"
              min="10"
              max="100"
              value={image.quality}
              onChange={(e) => handleQualityChange(parseInt(e.target.value))}
              disabled={isCompressing}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Higher compression</span>
              <span>Better quality</span>
            </div>
          </div>
        </div>

        {isCompressing && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-blue-700">Compressing image...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}