
import React from 'react';
import { Smartphone, Monitor, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PresetSize {
  name: string;
  width: number;
  height: number;
  category: string;
  icon: React.ComponentType<any>;
}

interface PresetButtonsProps {
  onPresetSelect: (preset: PresetSize) => void;
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

const PresetButtons: React.FC<PresetButtonsProps> = ({ onPresetSelect }) => {
  return (
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
                    onClick={() => onPresetSelect(preset)}
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
  );
};

export default PresetButtons;
