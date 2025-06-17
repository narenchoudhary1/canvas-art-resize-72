import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import UploadArea from '@/components/UploadArea';
import ResizeControls from '@/components/ResizeControls';
import PresetButtons from '@/components/PresetButtons';
import ImagePreview from '@/components/ImagePreview';
import ActionButtons from '@/components/ActionButtons';

interface ImageDimensions {
  width: number;
  height: number;
}

interface PresetSize {
  name: string;
  width: number;
  height: number;
  category: string;
  icon: React.ComponentType<any>;
}

const Index = () => {
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<ImageDimensions>({ width: 0, height: 0 });
  const [targetDimensions, setTargetDimensions] = useState<ImageDimensions>({ width: 0, height: 0 });
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quality, setQuality] = useState(0.9);
  const [originalFileSize, setOriginalFileSize] = useState(0);
  const [resizedFileSize, setResizedFileSize] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const handleImageLoad = useCallback((file: File) => {
    const img = new Image();
    img.onload = () => {
      setOriginalImage(img);
      setOriginalDimensions({ width: img.width, height: img.height });
      setTargetDimensions({ width: img.width, height: img.height });
      setOriginalFileSize(file.size);
      
      // Automatically set quality based on image size
      const pixels = img.width * img.height;
      if (pixels > 2000000) { // Large images (> 2MP)
        setQuality(0.8);
      } else if (pixels > 500000) { // Medium images (> 0.5MP)
        setQuality(0.85);
      } else {
        setQuality(0.9); // Small images
      }
      
      toast({
        title: "✨ Image loaded!",
        description: `${img.width}×${img.height}px (${(file.size / 1024 / 1024).toFixed(2)}MB)`,
      });
    };
    img.src = URL.createObjectURL(file);
  }, [toast]);

  // Auto-update canvas when dimensions or quality change
  useEffect(() => {
    if (originalImage) {
      updateCanvas();
    }
  }, [targetDimensions, quality, originalImage]);

  const updateCanvas = async () => {
    if (!originalImage || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = targetDimensions.width;
    canvas.height = targetDimensions.height;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    ctx.drawImage(originalImage, 0, 0, targetDimensions.width, targetDimensions.height);
    
    // Calculate estimated file size
    canvas.toBlob((blob) => {
      if (blob) {
        setResizedFileSize(blob.size);
      }
    }, 'image/jpeg', quality);
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }
    
    handleImageLoad(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const updateDimensions = (width: number, height: number, updateBoth = false) => {
    if (maintainAspectRatio && originalDimensions.width && originalDimensions.height && !updateBoth) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      if (width && !height) {
        setTargetDimensions({ width, height: Math.round(width / aspectRatio) });
      } else if (height && !width) {
        setTargetDimensions({ width: Math.round(height * aspectRatio), height });
      }
    } else {
      setTargetDimensions({ width: width || targetDimensions.width, height: height || targetDimensions.height });
    }
  };

  const applyPresetSize = (preset: PresetSize) => {
    updateDimensions(preset.width, preset.height, true);
    toast({
      title: "Preset applied",
      description: `${preset.name}: ${preset.width}×${preset.height}px`,
    });
  };

  const downloadImage = async () => {
    if (!canvasRef.current) return;
    
    setIsProcessing(true);
    
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
      if (!blob) return;
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resized-${targetDimensions.width}x${targetDimensions.height}-q${Math.round(quality * 100)}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setIsProcessing(false);
      
      toast({
        title: "🎉 Downloaded!",
        description: `${targetDimensions.width}×${targetDimensions.height}px (${(blob.size / 1024 / 1024).toFixed(2)}MB)`,
      });
    }, 'image/jpeg', quality);
  };

  const resetImage = () => {
    setOriginalImage(null);
    setOriginalDimensions({ width: 0, height: 0 });
    setTargetDimensions({ width: 0, height: 0 });
    setOriginalFileSize(0);
    setResizedFileSize(0);
    setQuality(0.9);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4">
            <ImageIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Image Resizer
          </h1>
          <p className="text-gray-600 max-w-md mx-auto text-sm md:text-base">
            Professional image resizing with quality control and size comparison
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            <UploadArea
              onFileSelect={handleFileSelect}
              isDragging={isDragging}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            />

            {originalImage && (
              <>
                <ResizeControls
                  originalDimensions={originalDimensions}
                  targetDimensions={targetDimensions}
                  maintainAspectRatio={maintainAspectRatio}
                  quality={quality}
                  onDimensionChange={updateDimensions}
                  onAspectRatioToggle={setMaintainAspectRatio}
                  onQualityChange={setQuality}
                />

                <PresetButtons onPresetSelect={applyPresetSize} />
              </>
            )}
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6">
            <ImagePreview
              originalImage={originalImage}
              originalDimensions={originalDimensions}
              targetDimensions={targetDimensions}
              originalFileSize={originalFileSize}
              resizedFileSize={resizedFileSize}
              canvasRef={canvasRef}
            />

            {originalImage && (
              <ActionButtons
                onDownload={downloadImage}
                onReset={resetImage}
                isProcessing={isProcessing}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
