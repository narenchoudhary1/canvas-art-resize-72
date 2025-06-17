
import React, { useState, useRef, useCallback } from 'react';
import { Upload, Download, RotateCcw, Image as ImageIcon, Smartphone, Monitor, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

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

const PRESET_SIZES: PresetSize[] = [
  { name: 'Instagram Square', width: 1080, height: 1080, category: 'Social Media', icon: Square },
  { name: 'Instagram Story', width: 1080, height: 1920, category: 'Social Media', icon: Smartphone },
  { name: 'Facebook Cover', width: 1200, height: 630, category: 'Social Media', icon: Monitor },
  { name: 'Twitter Header', width: 1500, height: 500, category: 'Social Media', icon: Monitor },
  { name: 'YouTube Thumbnail', width: 1280, height: 720, category: 'Social Media', icon: Monitor },
  { name: 'LinkedIn Banner', width: 1584, height: 396, category: 'Social Media', icon: Monitor },
  { name: 'HD (720p)', width: 1280, height: 720, category: 'Standard', icon: Monitor },
  { name: 'Full HD (1080p)', width: 1920, height: 1080, category: 'Standard', icon: Monitor },
  { name: 'Profile Picture', width: 400, height: 400, category: 'Profile', icon: Square },
];

const Index = () => {
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<ImageDimensions>({ width: 0, height: 0 });
  const [targetDimensions, setTargetDimensions] = useState<ImageDimensions>({ width: 0, height: 0 });
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const handleImageLoad = useCallback((file: File) => {
    const img = new Image();
    img.onload = () => {
      setOriginalImage(img);
      setOriginalDimensions({ width: img.width, height: img.height });
      setTargetDimensions({ width: img.width, height: img.height });
      toast({
        title: "✨ Image loaded!",
        description: `${img.width}×${img.height}px ready to resize`,
      });
    };
    img.src = URL.createObjectURL(file);
  }, [toast]);

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

  const resizeImage = async () => {
    if (!originalImage || !canvasRef.current) return null;
    
    setIsProcessing(true);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    canvas.width = targetDimensions.width;
    canvas.height = targetDimensions.height;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    ctx.drawImage(originalImage, 0, 0, targetDimensions.width, targetDimensions.height);
    
    setIsProcessing(false);
    return canvas;
  };

  const downloadImage = async () => {
    const canvas = await resizeImage();
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resized-${targetDimensions.width}x${targetDimensions.height}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "🎉 Downloaded!",
        description: `Your ${targetDimensions.width}×${targetDimensions.height}px image is ready`,
      });
    }, 'image/png', 1.0);
  };

  const resetImage = () => {
    setOriginalImage(null);
    setOriginalDimensions({ width: 0, height: 0 });
    setTargetDimensions({ width: 0, height: 0 });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
            Professional image resizing with instant preview
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            {/* Upload Card */}
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
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
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
                    onChange={(e) => handleFileSelect(e.target.files)}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Resize Controls */}
            {originalImage && (
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
                        onChange={(e) => updateDimensions(parseInt(e.target.value) || 0, 0)}
                        className="border-gray-200 focus:border-blue-500"
                        placeholder="Width"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Height</label>
                      <Input
                        type="number"
                        value={targetDimensions.height}
                        onChange={(e) => updateDimensions(0, parseInt(e.target.value) || 0)}
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
                      onChange={(e) => setMaintainAspectRatio(e.target.checked)}
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
            )}

            {/* Quick Presets */}
            {originalImage && (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Quick Presets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Social Media', 'Standard', 'Profile'].map((category) => (
                      <div key={category}>
                        <h3 className="font-medium text-sm text-gray-600 mb-2">{category}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {PRESET_SIZES.filter(p => p.category === category).map((preset) => (
                            <Button
                              key={preset.name}
                              variant="outline"
                              size="sm"
                              onClick={() => applyPresetSize(preset)}
                              className="justify-start h-auto p-3 text-left border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                            >
                              <div className="flex items-center gap-2 w-full">
                                <preset.icon className="w-4 h-4 text-gray-500" />
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-xs truncate">{preset.name}</div>
                                  <div className="text-xs text-gray-500">{preset.width}×{preset.height}</div>
                                </div>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6">
            {originalImage ? (
              <>
                {/* Preview Card */}
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

                {/* Action Buttons */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        onClick={downloadImage}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12"
                        disabled={isProcessing}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {isProcessing ? 'Processing...' : 'Download'}
                      </Button>
                      
                      <Button 
                        onClick={resetImage}
                        variant="outline"
                        className="h-12 border-gray-200"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
