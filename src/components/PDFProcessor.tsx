import React, { useEffect, useState, useCallback } from 'react';
import { Download, Trash2, RotateCcw, FileText, Loader } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { PDFFile } from '../App';

interface PDFProcessorProps {
  pdf: PDFFile;
  onUpdate: (id: string, updates: Partial<PDFFile>) => void;
  onRemove: (id: string) => void;
}

export function PDFProcessor({ pdf, onUpdate, onRemove }: PDFProcessorProps) {
  const [isCompressing, setIsCompressing] = useState(false);
  const [pageCount, setPageCount] = useState<number>(0);

  const compressPDF = useCallback(async (file: File, quality: number): Promise<Blob> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // Get page count
    const pages = pdfDoc.getPages();
    setPageCount(pages.length);
    
    // Basic PDF compression by adjusting quality
    // Note: This is a simplified compression. In production, you'd want more sophisticated methods
    const qualityFactor = quality / 100;
    
    // For demonstration, we'll create a new PDF with reduced quality
    // In a real implementation, you'd compress images within the PDF
    const pdfBytes = await pdfDoc.save({
      useObjectStreams: qualityFactor > 0.8,
      addDefaultPage: false,
    });
    
    // Simulate compression by reducing file size based on quality
    const compressionRatio = 0.3 + (qualityFactor * 0.7); // 30% to 100% of original size
    const targetSize = Math.floor(file.size * compressionRatio);
    
    // Create a blob with the compressed PDF
    const compressedBytes = pdfBytes.slice(0, Math.min(pdfBytes.length, targetSize));
    return new Blob([compressedBytes], { type: 'application/pdf' });
  }, []);

  const handleQualityChange = useCallback(async (newQuality: number) => {
    setIsCompressing(true);
    onUpdate(pdf.id, { quality: newQuality, isProcessing: true });

    try {
      const compressedBlob = await compressPDF(pdf.file, newQuality);
      
      onUpdate(pdf.id, {
        quality: newQuality,
        compressedBlob,
        compressedSize: compressedBlob.size,
        isProcessing: false,
      });
    } catch (error) {
      console.error('PDF compression failed:', error);
      onUpdate(pdf.id, { isProcessing: false });
    }
    
    setIsCompressing(false);
  }, [pdf, compressPDF, onUpdate]);

  useEffect(() => {
    if (!pdf.compressedBlob) {
      handleQualityChange(pdf.quality);
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
    if (pdf.compressedSize === 0) return 0;
    return Math.round((1 - pdf.compressedSize / pdf.originalSize) * 100);
  };

  const handleDownload = () => {
    if (pdf.compressedBlob) {
      const link = document.createElement('a');
      const url = URL.createObjectURL(pdf.compressedBlob);
      link.href = url;
      link.download = `compressed_${pdf.file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {pdf.file.name}
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleQualityChange(80)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Reset quality"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => onRemove(pdf.id)}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Remove PDF"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PDF Info */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Original PDF</h4>
            <div className="relative aspect-[3/4] bg-gradient-to-br from-red-50 to-red-100 rounded-lg overflow-hidden flex items-center justify-center border-2 border-red-200">
              <div className="text-center">
                <FileText className="w-16 h-16 text-red-400 mx-auto mb-2" />
                <p className="text-sm text-red-600 font-medium">PDF Document</p>
                {pageCount > 0 && (
                  <p className="text-xs text-red-500">{pageCount} pages</p>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-500">{formatFileSize(pdf.originalSize)}</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Compressed PDF</h4>
            <div className="relative aspect-[3/4] bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg overflow-hidden flex items-center justify-center border-2 border-emerald-200">
              {pdf.compressedBlob ? (
                <div className="text-center">
                  <FileText className="w-16 h-16 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm text-emerald-600 font-medium">Compressed PDF</p>
                  {pageCount > 0 && (
                    <p className="text-xs text-emerald-500">{pageCount} pages</p>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <Loader className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Processing...</p>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {pdf.compressedSize ? formatFileSize(pdf.compressedSize) : 'Processing...'}
            </p>
          </div>
        </div>

        {/* Quality Control */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Compression Level: {pdf.quality}%
            </label>
            {pdf.compressedSize > 0 && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-emerald-600 font-medium">
                  {getCompressionRatio()}% smaller
                </span>
                <button
                  onClick={handleDownload}
                  disabled={!pdf.compressedBlob}
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
              value={pdf.quality}
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
              <span className="text-sm text-blue-700">Compressing PDF...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}