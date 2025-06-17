
import React, { useRef } from 'react';
import { Upload, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UploadAreaProps {
  onFileSelect: (files: FileList | null) => void;
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

const UploadArea: React.FC<UploadAreaProps> = ({
  onFileSelect,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Upload className="w-5 h-5 text-blue-600" />
          Upload Image
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-xl p-6 md:p-8 text-center transition-all duration-300 ${
            isDragging 
              ? 'border-blue-500 bg-blue-50 scale-105' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
        >
          <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-gray-600 mb-4 text-sm md:text-base">
            Drop your image here or click to browse
          </p>
          <Button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Choose File
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => onFileSelect(e.target.files)}
            className="hidden"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadArea;
