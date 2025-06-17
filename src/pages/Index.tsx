
import React, { useState, useRef, useCallback } from 'react';
import { Upload, Download, RotateCcw, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
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
}

const PRESET_SIZES: PresetSize[] = [
  { name: 'Instagram Square', width: 1080, height: 1080, category: 'Social Media' },
  { name: 'Instagram Story', width: 1080, height: 1920, category: 'Social Media' },
  { name: 'Facebook Cover', width: 1200, height: 630, category: 'Social Media' },
  { name: 'Twitter Header', width: 1500, height: 500, category: 'Social Media' },
  { name: 'YouTube Thumbnail', width: 1280, height: 720, category: 'Social Media' },
  { name: 'LinkedIn Banner', width: 1584, height: 396, category: 'Social Media' },
  { name: 'HD (720p)', width: 1280, height: 720, category: 'Standard' },
  { name: 'Full HD (1080p)', width: 1920, height: 1080, category: 'Standard' },
  { name: 'Profile Picture', width: 400, height: 400, category: 'Profile' },
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
        title: "Image loaded successfully!",
        description: `Original size: ${img.width}x${img.height}px`,
      });
    };
    img.src = URL.createObjectURL(file);
  }, [toast]);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
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
      description: `Dimensions set to ${preset.width}x${preset.height}px (${preset.name})`,
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

    // Use high-quality image scaling
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
      a.download = `resized-image-${targetDimensions.width}x${targetDimensions.height}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download complete!",
        description: `Image resized to ${targetDimensions.width}x${targetDimensions.height}px`,
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Image Resizer Pro
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Professional image resizing tool with Canvas API. Upload, resize, and download high-quality images for any purpose.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Image
                </h2>
                
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                    isDragging 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">
                    Drag and drop your image here, or click to browse
                  </p>
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
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
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Resize Options</h2>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Width (px)</label>
                        <Input
                          type="number"
                          value={targetDimensions.width}
                          onChange={(e) => updateDimensions(parseInt(e.target.value) || 0, 0)}
                          placeholder="Width"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Height (px)</label>
                        <Input
                          type="number"
                          value={targetDimensions.height}
                          onChange={(e) => updateDimensions(0, parseInt(e.target.value) || 0)}
                          placeholder="Height"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="aspectRatio"
                        checked={maintainAspectRatio}
                        onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                        className="rounded"
                      />
                      <label htmlFor="aspectRatio" className="text-sm">
                        Maintain aspect ratio
                      </label>
                    </div>

                    <div className="text-sm text-gray-600">
                      Original: {originalDimensions.width}×{originalDimensions.height}px
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Preset Sizes */}
            {originalImage && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Quick Presets</h2>
                  
                  <div className="space-y-4">
                    {['Social Media', 'Standard', 'Profile'].map((category) => (
                      <div key={category}>
                        <h3 className="font-medium text-sm text-gray-600 mb-2">{category}</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {PRESET_SIZES.filter(p => p.category === category).map((preset) => (
                            <Button
                              key={preset.name}
                              variant="outline"
                              size="sm"
                              onClick={() => applyPresetSize(preset)}
                              className="text-xs h-auto py-2"
                            >
                              <div>
                                <div className="font-medium">{preset.name}</div>
                                <div className="text-gray-500">{preset.width}×{preset.height}</div>
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

          {/* Preview Section */}
          <div className="space-y-6">
            {originalImage ? (
              <>
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Preview</h2>
                    
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4 bg-gray-50">
                        <h3 className="font-medium mb-2">Original Image</h3>
                        <div className="max-w-full max-h-64 overflow-hidden rounded">
                          <img 
                            src={originalImage.src} 
                            alt="Original" 
                            className="max-w-full max-h-64 object-contain"
                          />
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          {originalDimensions.width}×{originalDimensions.height}px
                        </p>
                      </div>
                      
                      <div className="border rounded-lg p-4 bg-blue-50">
                        <h3 className="font-medium mb-2">Resized Preview</h3>
                        <canvas
                          ref={canvasRef}
                          className="max-w-full max-h-64 border rounded"
                          style={{ 
                            width: Math.min(300, targetDimensions.width),
                            height: Math.min(200, targetDimensions.height),
                            objectFit: 'contain'
                          }}
                        />
                        <p className="text-sm text-gray-600 mt-2">
                          {targetDimensions.width}×{targetDimensions.height}px
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex gap-3">
                      <Button 
                        onClick={downloadImage}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        disabled={isProcessing}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {isProcessing ? 'Processing...' : 'Download Resized Image'}
                      </Button>
                      
                      <Button 
                        onClick={resetImage}
                        variant="outline"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No Image Selected</h3>
                    <p className="text-gray-500">
                      Upload an image to see the preview and resizing options
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
