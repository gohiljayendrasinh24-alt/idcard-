import React, { useEffect, useRef, useState } from 'react';
import { Camera, RefreshCw, X, Check } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
  isEn?: boolean;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  isEn = false,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setPhotoData(null);
      setCameraError(null);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setIsLoading(true);
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 640 },
          facingMode: 'user',
        },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsLoading(false);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError(
        isEn
          ? 'Unable to access camera. Please check camera permissions.'
          : 'કેમેરા શરૂ કરવામાં મુશ્કેલી આવી છે. કૃપા કરીને બ્રાઉઝર પરમિશન ચેક કરો.'
      );
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const takeSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Crop center square/portrait
    const vWidth = videoRef.current.videoWidth || 640;
    const vHeight = videoRef.current.videoHeight || 480;
    const cropWidth = Math.min(vWidth, vHeight * (400 / 480));
    const cropHeight = cropWidth * (480 / 400);
    const startX = (vWidth - cropWidth) / 2;
    const startY = (vHeight - cropHeight) / 2;

    ctx.drawImage(
      videoRef.current,
      startX,
      startY,
      cropWidth,
      cropHeight,
      0,
      0,
      400,
      480
    );
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setPhotoData(dataUrl);
  };

  const confirmPhoto = () => {
    if (photoData) {
      onCapture(photoData);
      onClose();
    }
  };

  const retakePhoto = () => {
    setPhotoData(null);
    startCamera();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-slate-900 text-sm">
              {isEn ? 'Take Student Photo (Webcam)' : 'કેમેરા વડે વિદ્યાર્થીનો ફોટો લો'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Viewport / Preview */}
        <div className="p-5 flex flex-col items-center">
          <div className="relative w-72 h-84 bg-slate-900 rounded-xl overflow-hidden shadow-inner flex items-center justify-center border-2 border-slate-300">
            {photoData ? (
              <img
                src={photoData}
                alt="Captured"
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
                {/* Portrait Oval Guideline */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-48 h-64 border-2 border-dashed border-white/60 rounded-[50%] shadow-xs flex items-center justify-center">
                    <span className="text-[11px] text-white/80 bg-black/40 px-2 py-0.5 rounded font-medium">
                      {isEn ? 'Center Face Here' : 'ચહેરો અહીં ગોઠવો'}
                    </span>
                  </div>
                </div>
              </>
            )}

            {isLoading && !photoData && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 text-white text-xs gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                <span>{isEn ? 'Starting camera...' : 'કેમેરા શરૂ થઈ રહ્યો છે...'}</span>
              </div>
            )}

            {cameraError && (
              <div className="absolute inset-0 p-4 bg-slate-900/90 flex flex-col items-center justify-center text-center text-rose-300 text-xs gap-2">
                <p>{cameraError}</p>
                <button
                  onClick={startCamera}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs"
                >
                  {isEn ? 'Try Again' : 'ફરી પ્રયાસ કરો'}
                </button>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-500 mt-3 text-center">
            {isEn
              ? 'Keep head upright and make sure lighting is adequate.'
              : 'ચહેરો સીધો રાખો અને પૂરતો પ્રકાશ હોવો જરૂરી છે.'}
          </p>

          {/* Action Buttons */}
          <div className="mt-4 flex items-center gap-3 w-full justify-center">
            {photoData ? (
              <>
                <button
                  onClick={retakePhoto}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>{isEn ? 'Retake' : 'ફરી લો'}</span>
                </button>
                <button
                  onClick={confirmPhoto}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>{isEn ? 'Use Photo' : 'આ ફોટો વાપરો'}</span>
                </button>
              </>
            ) : (
              <button
                onClick={takeSnapshot}
                disabled={isLoading || !!cameraError}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-all shadow-md flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                <span>{isEn ? 'Capture Photo' : 'ફોટો ક્લિક કરો'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
