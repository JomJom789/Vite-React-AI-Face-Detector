//* -------------------------------------------------------------------------- */
//*                                    Hooks                                   */
//* -------------------------------------------------------------------------- */
import React, { 
  useEffect 
} from 'react';

//* -------------------------------------------------------------------------- */
//*                                Hooks: Custom                               */
//* -------------------------------------------------------------------------- */
import { useToast } from '@/hooks/use-toast';
import { useFaceDetection } from '@/hooks/useFaceDetection';

//* -------------------------------------------------------------------------- */
//*                                Icons: Lucide                               */
//* -------------------------------------------------------------------------- */
import { Scan, Sparkles } from 'lucide-react';

//* -------------------------------------------------------------------------- */
//*                                 Shadcn Card                                */
//* -------------------------------------------------------------------------- */
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

//* -------------------------------------------------------------------------- */
//*                                   Shadcn                                   */
//* -------------------------------------------------------------------------- */
import { Button } from '@/components/ui/button';

//* -------------------------------------------------------------------------- */
//*                                   Section                                  */
//* -------------------------------------------------------------------------- */
import { ImageUploader } from './ImageUploader';
import { FaceDetectionResults } from './FaceDetectionResults';


//* -------------------------------------------------------------------------- */
//*                              FaceDetectionApp                              */
//* -------------------------------------------------------------------------- */
export const FaceDetectionApp: React.FC = () => {


  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */
  const { toast } = useToast();

  /* -------------------------------------------------------------------------- */
  /*                            Hooks: Face Detection                           */
  /* -------------------------------------------------------------------------- */
  const { 
    result, 
    detectFaces, 
    isModelLoaded, 
    initializeModel 
  } = useFaceDetection();  

  /* -------------------------------------------------------------------------- */
  /*                        useEffect: Initialized Model                        */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    initializeModel();
  }, [initializeModel]);

  /* -------------------------------------------------------------------------- */
  /*                             Handle Image Upload                            */
  /* -------------------------------------------------------------------------- */
  const handleImageUpload = async (file: File, imageElement: HTMLImageElement) => {
    
    if (!isModelLoaded) {
      toast({
        title: "Model Loading",
        description: "Please wait for the face detection model to load...",
        variant: "default",
      });
      return;
    }

    toast({
      title: "Processing Image",
      description: "Analyzing image for faces using TensorFlow FaceMesh...",
      variant: "default",
    });

    await detectFaces(imageElement);

  };

  /* -------------------------------------------------------------------------- */
  /*                                    View                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-background">
      
      {/* -------------------------------------------------------------------------- */}
      {/*                                Hero Section                                */}
      {/* -------------------------------------------------------------------------- */}
      <div className="bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6 shadow-glow">
              <Scan className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              AI Face Detection
            </h1>
            <p className="text-xl md:text-2xl font-light mb-8 max-w-2xl mx-auto">
              Upload any image and let our TensorFlow-powered AI detect faces instantly
            </p>
            <div className="flex items-center justify-center gap-2 text-sm opacity-90">
              <Sparkles className="h-4 w-4" />
              <span>Powered by TensorFlow FaceMesh</span>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------------- */}
      {/*                                Main Content                                */}
      {/* -------------------------------------------------------------------------- */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Model Status */}
          <Card className="bg-gradient-secondary border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isModelLoaded ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <span className="text-foreground">
                  {isModelLoaded ? 'Model Ready' : 'Loading Model...'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {isModelLoaded 
                  ? 'TensorFlow FaceMesh model is loaded and ready for face detection.'
                  : 'Please wait while we load the TensorFlow FaceMesh model...'
                }
              </p>
              {!isModelLoaded && (
                <Button 
                  onClick={initializeModel} 
                  className="mt-4 bg-gradient-primary"
                  disabled={result.processing}
                >
                  Retry Loading Model
                </Button>
              )}
            </CardContent>
          </Card>

          {/* -------------------------------------------------------------------------- */}
          {/*                                Image Upload                                */}
          {/* -------------------------------------------------------------------------- */}
          <div>
            
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Upload Image
            </h2>

            <ImageUploader 
              onImageUpload={handleImageUpload} 
              isProcessing={result.processing || !isModelLoaded}
            />

          </div>

          {/* -------------------------------------------------------------------------- */}
          {/*                                   Results                                  */}
          {/* -------------------------------------------------------------------------- */}
          <div>
            
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Detection Results
            </h2>
            
            <FaceDetectionResults 
              result={result} 
            />

          </div>

          {/* -------------------------------------------------------------------------- */}
          {/*                                Info Section                                */}
          {/* -------------------------------------------------------------------------- */}
          <Card className="bg-gradient-secondary border-border">
            <CardHeader>
              <CardTitle className="text-foreground">
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary-foreground font-bold">1</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Upload</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload any image containing faces
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-accent-foreground font-bold">2</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Analyze</h3>
                  <p className="text-sm text-muted-foreground">
                    TensorFlow FaceMesh processes the image
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary-foreground font-bold">3</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Results</h3>
                  <p className="text-sm text-muted-foreground">
                    Get face count and confidence scores
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

    </div>
  );
};