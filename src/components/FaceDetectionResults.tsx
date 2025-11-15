//* -------------------------------------------------------------------------- */
//*                                    Hooks                                   */
//* -------------------------------------------------------------------------- */
import React from 'react';

//* -------------------------------------------------------------------------- */
//*                                Hooks: Custom                               */
//* -------------------------------------------------------------------------- */
import { FaceDetectionResult } from '@/hooks/useFaceDetection';

//* -------------------------------------------------------------------------- */
//*                                Icons: Lucide                               */
//* -------------------------------------------------------------------------- */
import { 
  CheckCircle,
   XCircle, 
   Loader2, 
   Users, 
   Zap 
} from 'lucide-react';

//* -------------------------------------------------------------------------- */
//*                                Shadcn: Card                                */
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
import { Badge } from '@/components/ui/badge';

//* -------------------------------------------------------------------------- */
//*                      TS: Face Detection Results Props                      */
//* -------------------------------------------------------------------------- */
interface FaceDetectionResultsProps {
  result: FaceDetectionResult;
}

//* -------------------------------------------------------------------------- */
//*                            FaceDetectionResults                            */
//* -------------------------------------------------------------------------- */
export const FaceDetectionResults: React.FC<FaceDetectionResultsProps> = ({ result }) => {
  
  /* -------------------------------------------------------------------------- */
  /*                                    Data                                    */
  /* -------------------------------------------------------------------------- */
  const { 
    hasFace,
    confidence, 
    faceCount, 
    processing, 
    error 
  } = result;

  /* -------------------------------------------------------------------------- */
  /*                             Render: Processing                             */
  /* -------------------------------------------------------------------------- */
  if (processing) {
    return (
      <Card className="bg-gradient-secondary border-border">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground">
              Analyzing image...
            </p>
            <p className="text-sm text-muted-foreground">
              Using TensorFlow FaceMesh detection
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                                Render: Error                               */
  /* -------------------------------------------------------------------------- */
  if (error) {
    return (
      <Card className="bg-gradient-secondary border-destructive">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p className="text-lg font-medium text-destructive">
              Detection Failed
            </p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!hasFace && !processing && confidence === 0) {
    return null;
  }

  /* -------------------------------------------------------------------------- */
  /*                                    View                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <Card className={`
      bg-gradient-secondary border-border transition-all duration-500
      ${hasFace ? 'shadow-glow' : ''}
    `}>
      
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {hasFace ? (
            <CheckCircle className="h-6 w-6 text-green-500" />
          ) : (
            <XCircle className="h-6 w-6 text-red-500" />
          )}
          <span className="text-foreground">
            {hasFace ? 'Face Detected!' : 'No Face Detected'}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
            <div className="p-2 bg-gradient-primary rounded-full">
              <Users className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Face Count</p>
              <p className="text-lg font-bold text-primary">{faceCount}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
            <div className="p-2 bg-gradient-accent rounded-full">
              <Zap className="h-4 w-4 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Confidence</p>
              <p className="text-lg font-bold text-accent">
                {(confidence * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Badge 
            variant={hasFace ? "default" : "secondary"}
            className={`
              px-4 py-2 text-sm font-medium
              ${hasFace 
                ? 'bg-gradient-primary text-primary-foreground shadow-primary' 
                : 'bg-muted text-muted-foreground'
              }
            `}
          >
            {hasFace 
              ? `${faceCount} face${faceCount !== 1 ? 's' : ''} found`
              : 'No faces detected'
            }
          </Badge>
        </div>

      </CardContent>
    </Card>
  );
};