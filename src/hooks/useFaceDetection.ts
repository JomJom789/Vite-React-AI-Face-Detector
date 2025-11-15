//* -------------------------------------------------------------------------- */
//*                                    Hooks                                   */
//* -------------------------------------------------------------------------- */
import { 
  useRef,
  useCallback, 
  useState
} from 'react';

//* -------------------------------------------------------------------------- */
//*                                     AI                                     */
//* -------------------------------------------------------------------------- */
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

//* -------------------------------------------------------------------------- */
//*                          TS: Face Detection Result                         */
//* -------------------------------------------------------------------------- */
export interface FaceDetectionResult {
  hasFace: boolean;
  confidence: number;
  faceCount: number;
  processing: boolean;
  error: string | null;
}

//* -------------------------------------------------------------------------- */
//*                              useFaceDetection                              */
//* -------------------------------------------------------------------------- */
export const useFaceDetection = () => {

  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */
  const detectorRef = useRef<faceLandmarksDetection.FaceLandmarksDetector | null>(null);

  /* -------------------------------------------------------------------------- */
  /*                                Data: Result                                */
  /* -------------------------------------------------------------------------- */
  const [result, setResult] = useState<FaceDetectionResult>({
    hasFace: false,
    confidence: 0,
    faceCount: 0,
    processing: false,
    error: null,
  });

  /* -------------------------------------------------------------------------- */
  /*                                  Triggers                                  */
  /* -------------------------------------------------------------------------- */
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  /* -------------------------------------------------------------------------- */
  /*                              Initialize Model                              */
  /* -------------------------------------------------------------------------- */
  const initializeModel = useCallback(async () => {
    try {
      if (detectorRef.current) return;

      await tf.ready();
      
      const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
      const detectorConfig = {
        runtime: 'tfjs' as const,
        maxFaces: 10,
        refineLandmarks: false,
      };

      detectorRef.current = await faceLandmarksDetection.createDetector(model, detectorConfig);
      setIsModelLoaded(true);
    } catch (error) {
      console.error('Error initializing face detection model:', error);
      setResult(prev => ({ 
        ...prev, 
        error: 'Failed to load face detection model',
        processing: false 
      }));
    }
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                                Detect Faces                                */
  /* -------------------------------------------------------------------------- */
  const detectFaces = useCallback(async (imageElement: HTMLImageElement) => {

    if (!detectorRef.current) {
      await initializeModel();
    }

    if (!detectorRef.current) {
      setResult(prev => ({ 
        ...prev, 
        error: 'Face detection model not available',
        processing: false 
      }));
      return;
    }

    setResult(prev => ({ ...prev, processing: true, error: null }));

    try {

      const faces = await detectorRef.current.estimateFaces(imageElement);
      
      const faceCount = faces.length;
      const hasFace = faceCount > 0;
      
      // Calculate confidence (FaceMesh doesn't provide score, so we use presence)
      const confidence = hasFace ? 0.95 : 0;

      setResult({
        hasFace,
        confidence,
        faceCount,
        processing: false,
        error: null,
      });

    } catch (error) {
      console.error('Error detecting faces:', error);
      setResult(prev => ({ 
        ...prev, 
        error: 'Error during face detection',
        processing: false 
      }));
    }
    
  }, [initializeModel]);

  /* -------------------------------------------------------------------------- */
  /*                                   Returns                                  */
  /* -------------------------------------------------------------------------- */
  return {
    result,
    detectFaces,
    isModelLoaded,
    initializeModel,
  };

};