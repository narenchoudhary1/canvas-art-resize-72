
import React from 'react';
import { ImageIcon, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ImageDimensions {
  width: number;
  height: number;
}

interface ImagePreviewProps {
  originalImage: HTMLImageElement | null;
  originalDimensions: ImageDimensions;
  targetDimensions: ImageDimensions;
  originalFileSize: number;
  resizedFileSize: number;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  originalImage,
  originalDimensions,
  targetDimensions,
  originalFileSize,
  resizedFileSize,
  canvasRef,
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const compressionRatio = originalFileSize > 0 && resizedFileSize > 0 
    ? Math.round(((originalFileSize - resizedFileSize) / originalFileSize) * 100)
    : 0;

  if (!originalImage) {
    return (
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">No Image Selected</h3>
            <p className="text-gray-500 text-sm">
              Upload an image to see the preview and comparison
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Preview & Comparison</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Size Comparison Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="text-center">
              <div className="font-medium text-gray-700">Original</div>
              <div className="text-blue-600">{formatFileSize(originalFileSize)}</div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <div className="text-center">
              <div className="font-medium text-gray-700">Resized</div>
              <div className="text-purple-600">{formatFileSize(resizedFileSize)}</div>
            </div>
            {compressionRatio > 0 && (
              <div className="text-center">
                <div className="font-medium text-green-600">Saved</div>
                <div className="text-green-600">{compressionRatio}%</div>
              </div>
            )}
          </div>
        </div>

        {/* Original Image */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-medium mb-2 text-sm">Original</h3>
          <div className="bg-white rounded-lg p-2 shadow-sm">
            <img 
              src={originalImage.src} 
              alt="Original" 
              className="w-full h-32 md:h-40 object-contain rounded"
            />
          </div>
          <div className="mt-2 text-xs text-gray-500 flex justify-between">
            <span>{originalDimensions.width}×{originalDimensions.height}px</span>
            <span>{formatFileSize(originalFileSize)}</span>
          </div>
        </div>
        
        {/* Resized Preview */}
        <div className="bg-blue-50 rounded-xl p-4">
          <h3 className="font-medium mb-2 text-sm">Resized Preview</h3>
          <div className="bg-white rounded-lg p-2 shadow-sm">
            <canvas
              ref={canvasRef}
              className="w-full h-32 md:h-40 object-contain rounded border"
            />
          </div>
          <div className="mt-2 text-xs text-gray-500 flex justify-between">
            <span>{targetDimensions.width}×{targetDimensions.height}px</span>
            <span>{formatFileSize(resizedFileSize)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImagePreview;
