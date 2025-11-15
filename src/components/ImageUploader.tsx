//* -------------------------------------------------------------------------- */
//*                                    Hooks                                   */
//* -------------------------------------------------------------------------- */
import React, { useCallback, useState } from 'react';

//* -------------------------------------------------------------------------- */
//*                                Icons: Lucide                               */
//* -------------------------------------------------------------------------- */
import { Upload, Image as ImageIcon, X } from 'lucide-react';

//* -------------------------------------------------------------------------- */
//*                                   Shadcn                                   */
//* -------------------------------------------------------------------------- */
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

//* -------------------------------------------------------------------------- */
//*                          TS: Image Uploader Props                          */
//* -------------------------------------------------------------------------- */
interface ImageUploaderProps {
  onImageUpload: (file: File, imageElement: HTMLImageElement) => void;
  isProcessing: boolean;
}

//* -------------------------------------------------------------------------- */
//*                                ImageUploader                               */
//* -------------------------------------------------------------------------- */
export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageUpload, 
  isProcessing 
}) => {

  /* -------------------------------------------------------------------------- */
  /*                                    Data                                    */
  /* -------------------------------------------------------------------------- */
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  /* -------------------------------------------------------------------------- */
  /*                                  Triggers                                  */
  /* -------------------------------------------------------------------------- */
  const [dragActive, setDragActive] = useState(false);

  /* -------------------------------------------------------------------------- */
  /*                                Handle Files                                */
  /* -------------------------------------------------------------------------- */
  const handleFiles = useCallback((files: FileList | null) => {

    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    const img = new Image();
    img.onload = () => {
      onImageUpload(file, img);
      URL.revokeObjectURL(url);
    };

    img.src = url;

  }, [onImageUpload]);

  /* -------------------------------------------------------------------------- */
  /*                                 Handle Drag                                */
  /* -------------------------------------------------------------------------- */
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                                 Handle Drop                                */
  /* -------------------------------------------------------------------------- */
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  /* -------------------------------------------------------------------------- */
  /*                              Handle File Input                             */
  /* -------------------------------------------------------------------------- */
  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  }, [handleFiles]);

  /* -------------------------------------------------------------------------- */
  /*                                 Clear Image                                */
  /* -------------------------------------------------------------------------- */
  const clearImage = useCallback(() => {
    setPreviewUrl(null);
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                                    View                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <Card className="relative overflow-hidden bg-gradient-secondary border-border">
      <div
        className={`
          relative p-8 border-2 border-dashed transition-all duration-300
          ${dragActive 
            ? 'border-primary bg-primary/10' 
            : 'border-border hover:border-primary/50'
          }
          ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-full max-h-64 mx-auto rounded-lg shadow-primary"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={clearImage}
              disabled={isProcessing}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4 shadow-glow">
              <Upload className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Upload an Image
            </h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop an image here, or click to select
            </p>
            <Button 
              variant="default" 
              className="bg-gradient-primary hover:shadow-primary transition-all duration-300"
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Choose Image
            </Button>
          </div>
        )}

        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept="image/*"
          onChange={handleFileInput}
          disabled={isProcessing}
        />
      </div>
    </Card>
  );
};