
import React from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ImageDimensions {
  width: number;
  height: number;
}

interface ResizeControlsProps {
  originalDimensions: ImageDimensions;
  targetDimensions: ImageDimensions;
  maintainAspectRatio: boolean;
  onDimensionChange: (width: number, height: number) => void;
  onAspectRatioToggle: (maintain: boolean) => void;
}

const ResizeControls: React.FC<ResizeControlsProps> = ({
  originalDimensions,
  targetDimensions,
  maintainAspectRatio,
  onDimensionChange,
  onAspectRatioToggle,
}) => {
  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Resize Options</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Width</label>
            <Input
              type="number"
              value={targetDimensions.width}
              onChange={(e) => onDimensionChange(parseInt(e.target.value) || 0, 0)}
              className="border-gray-200 focus:border-blue-500"
              placeholder="Width"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Height</label>
            <Input
              type="number"
              value={targetDimensions.height}
              onChange={(e) => onDimensionChange(0, parseInt(e.target.value) || 0)}
              className="border-gray-200 focus:border-blue-500"
              placeholder="Height"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            id="aspectRatio"
            checked={maintainAspectRatio}
            onChange={(e) => onAspectRatioToggle(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <label htmlFor="aspectRatio" className="text-sm font-medium text-gray-700">
            Lock aspect ratio
          </label>
        </div>

        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          Original: {originalDimensions.width}×{originalDimensions.height}px
        </div>
      </CardContent>
    </Card>
  );
};

export default ResizeControls;
