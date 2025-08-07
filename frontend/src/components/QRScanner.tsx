import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, X, CheckCircle, AlertCircle, Flashlight, FlashlightOff } from "lucide-react";
import { toast } from "sonner";

interface QRScannerProps {
  onScanSuccess: (token: string) => void;
  onClose: () => void;
}

export function QRScanner({ onScanSuccess, onClose }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>("");
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [cameras, setCameras] = useState<any[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [permissionState, setPermissionState] = useState<'requesting' | 'granted' | 'denied' | 'prompt'>('prompt');
  const [isInitializing, setIsInitializing] = useState(false);

  const requestCameraPermission = async () => {
    console.log("Requesting camera permission...");
    setPermissionState('requesting');
    setIsInitializing(true);
    setError("");

    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not supported in this browser");
      }

      console.log("Requesting camera access...");
      // Request camera permission with specific constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment' // Prefer back camera
        }
      });

      console.log("Camera permission granted!");
      stream.getTracks().forEach(track => track.stop()); // Stop the test stream

      setPermissionState('granted');
      await initializeScanner();
    } catch (err: any) {
      console.error("Camera permission error:", err);
      setPermissionState('denied');
      setIsInitializing(false);

      if (err.name === 'NotAllowedError') {
        setError("Camera access denied. Please click 'Allow' when your browser asks for camera permission.");
        toast.error("Camera permission denied");
      } else if (err.name === 'NotFoundError') {
        setError("No camera found on this device.");
        toast.error("No camera available");
      } else if (err.name === 'NotSupportedError') {
        setError("Camera not supported in this browser.");
        toast.error("Camera not supported");
      } else {
        setError(`Camera error: ${err.message || 'Unknown error'}`);
        toast.error("Camera access failed");
      }
    }
  };

  const initializeScanner = async () => {
    try {
      // Get available cameras
      const devices = await Html5Qrcode.getCameras();
      setCameras(devices);

      if (devices.length === 0) {
        setError("No cameras found on this device");
        setIsInitializing(false);
        return;
      }

      // Prefer back camera for mobile devices
      const backCamera = devices.find(device =>
        device.label.toLowerCase().includes('back') ||
        device.label.toLowerCase().includes('rear')
      );
      const cameraId = backCamera ? backCamera.id : devices[0].id;
      setSelectedCamera(cameraId);

      // Initialize scanner
      const scanner = new Html5Qrcode("qr-scanner");
      scannerRef.current = scanner;

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      const handleScanSuccess = (decodedText: string) => {
        try {
          // Check if the scanned text is a valid URL with token
          const url = new URL(decodedText);
          const token = url.searchParams.get('token');

          if (token) {
            scanner.stop().then(() => {
              setIsScanning(false);
              toast.success("QR Code scanned successfully!");
              onScanSuccess(token);
            }).catch(console.error);
          } else {
            setError("Invalid QR code. Please scan a valid TodoMaster QR code.");
            toast.error("Invalid QR code format");
          }
        } catch (err) {
          setError("Invalid QR code format. Please scan a valid TodoMaster QR code.");
          toast.error("Invalid QR code");
        }
      };

      const handleScanFailure = (error: string) => {
        // Handle scan failure silently - this fires frequently during scanning
        console.log("Scan error:", error);
      };

      // Start scanning
      await scanner.start(cameraId, config, handleScanSuccess, handleScanFailure);
      setIsScanning(true);
      setIsInitializing(false);
      setError("");

    } catch (err) {
      console.error("Error initializing scanner:", err);
      setError("Failed to initialize camera scanner.");
      setIsInitializing(false);
      toast.error("Scanner initialization failed");
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const handleClose = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().catch(console.error);
    }
    setIsScanning(false);
    onClose();
  };

  const toggleTorch = async () => {
    if (scannerRef.current) {
      try {
        const capabilities = await scannerRef.current.getRunningTrackCapabilities();
        if (capabilities.torch) {
          await scannerRef.current.applyVideoConstraints({
            advanced: [{ torch: !torchEnabled }]
          });
          setTorchEnabled(!torchEnabled);
        }
      } catch (error) {
        console.error("Torch not supported:", error);
        toast.error("Flashlight not supported on this device");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Camera className="h-6 w-6 text-white" />
          <div>
            <h2 className="text-lg font-semibold text-white">Scan QR Code</h2>
            <p className="text-sm text-gray-300">
              {permissionState === 'prompt' && 'Camera access required'}
              {permissionState === 'requesting' && 'Requesting camera access...'}
              {permissionState === 'granted' && 'Point camera at QR code'}
              {permissionState === 'denied' && 'Camera access denied'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Torch/Flashlight Button - only show when scanning */}
          {isScanning && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTorch}
              className="h-10 w-10 p-0 text-white hover:bg-white/20"
            >
              {torchEnabled ? (
                <Flashlight className="h-5 w-5" />
              ) : (
                <FlashlightOff className="h-5 w-5" />
              )}
            </Button>
          )}
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-10 w-10 p-0 text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative">
        {/* Camera Permission Prompt */}
        {permissionState === 'prompt' && (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center text-white max-w-sm">
              <div className="mb-6">
                <Camera className="h-16 w-16 mx-auto mb-4 text-white/60" />
                <h3 className="text-xl font-semibold mb-2">Camera Access Required</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  To scan QR codes, we need access to your device's camera.
                  Your privacy is important - the camera is only used for scanning.
                </p>
              </div>
              <Button
                onClick={() => {
                  console.log("Camera permission button clicked");
                  requestCameraPermission();
                }}
                className="bg-white text-black hover:bg-white/90 font-medium px-8 py-3"
                size="lg"
              >
                <Camera className="h-5 w-5 mr-2" />
                Allow Camera Access
              </Button>
            </div>
          </div>
        )}

        {/* Camera Permission Denied */}
        {permissionState === 'denied' && (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center text-white max-w-sm">
              <div className="mb-6">
                <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-400" />
                <h3 className="text-xl font-semibold mb-2">Camera Access Denied</h3>
                <p className="text-white/80 text-sm leading-relaxed mb-4">
                  Camera access is required to scan QR codes. Please enable camera
                  permissions in your browser settings and try again.
                </p>
              </div>
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    console.log("Retry button clicked");
                    requestCameraPermission();
                  }}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 w-full"
                >
                  Try Again
                </Button>
                <p className="text-xs text-white/60">
                  Look for the camera icon in your browser's address bar
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {(permissionState === 'requesting' || isInitializing) && (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center text-white">
              <div className="mb-4">
                <div className="h-12 w-12 mx-auto border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
              </div>
              <p className="text-white/80">
                {permissionState === 'requesting' ? 'Requesting camera access...' : 'Initializing camera...'}
              </p>
            </div>
          </div>
        )}

        {/* Camera Feed */}
        {permissionState === 'granted' && !isInitializing && (
          <>
            <div
              id="qr-scanner"
              className="w-full h-full"
            />

            {/* Scanning Overlay */}
            {isScanning && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="relative w-64 h-64 border-2 border-white/50 rounded-lg">
                  {/* Corner indicators */}
                  <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
                  <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
                  <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg"></div>

                  {/* Scanning line animation */}
                  <div className="absolute inset-0 overflow-hidden rounded-lg">
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-white animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Controls - only show when camera is active */}
      {permissionState === 'granted' && (
        <div className="p-4 bg-black/80 backdrop-blur-sm">
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {/* Instructions */}
          <div className="text-center text-white mb-4">
            <p className="text-sm opacity-80">
              {isScanning ? "Scanning for QR code..." : "Initializing camera..."}
            </p>
            {isScanning && (
              <p className="text-xs opacity-60 mt-1">
                Position the QR code within the white brackets
              </p>
            )}
          </div>

          {/* Cancel Button */}
          <Button
            variant="outline"
            onClick={handleClose}
            className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Cancel Scanning
          </Button>
        </div>
      )}
    </div>
  );
}
