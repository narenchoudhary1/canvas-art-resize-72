
import React from 'react';
import { ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ImageDimensions {
  width: number;
  height: number;
}

interface ImagePreviewProps {
  originalImage: HTMLImageElement | null;
  originalDimensions: ImageDimensions;
  targetDimensions: ImageDimensions;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  originalImage,
  originalDimensions,
  targetDimensions,
  canvasRef,
}) => {
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
              Upload an image to see the preview
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
          <p className="text-xs text-gray-500 mt-2 text-center">
            {originalDimensions.width}×{originalDimensions.height}px
          </p>
        </div>
        
        {/* Resized Preview */}
        <div className="bg-blue-50 rounded-xl p-4">
          <h3 className="font-medium mb-2 text-sm">Resized</h3>
          <div className="bg-white rounded-lg p-2 shadow-sm">
            <canvas
              ref={canvasRef}
              className="w-full h-32 md:h-40 object-contain rounded border"
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            {targetDimensions.width}×{targetDimensions.height}px
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImagePreview;
