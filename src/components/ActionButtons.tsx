
import React from 'react';
import { Download, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ActionButtonsProps {
  onDownload: () => void;
  onReset: () => void;
  isProcessing: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onDownload,
  onReset,
  isProcessing,
}) => {
  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={onDownload}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12"
            disabled={isProcessing}
          >
            <Download className="w-4 h-4 mr-2" />
            {isProcessing ? 'Processing...' : 'Download'}
          </Button>
          
          <Button 
            onClick={onReset}
            variant="outline"
            className="h-12 border-gray-200"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionButtons;
