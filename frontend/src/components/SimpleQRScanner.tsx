import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Camera, X, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface SimpleQRScannerProps {
  onScanSuccess: (token: string) => void;
  onClose: () => void;
}

export function SimpleQRScanner({ onScanSuccess, onClose }: SimpleQRScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [error, setError] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeScanner = () => {
      try {
        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          showTorchButtonIfSupported: true,
          showZoomSliderIfSupported: true,
          rememberLastUsedCamera: true,
          supportedScanTypes: [],
        };

        const scanner = new Html5QrcodeScanner("simple-qr-scanner", config, false);
        scannerRef.current = scanner;

        const handleScanSuccess = (decodedText: string) => {
          try {
            console.log("QR Code detected:", decodedText);
            // Check if the scanned text is a valid URL with token
            const url = new URL(decodedText);
            const token = url.searchParams.get('token');
            
            if (token) {
              scanner.clear();
              toast.success("QR Code scanned successfully!");
              onScanSuccess(token);
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

        scanner.render(handleScanSuccess, handleScanFailure);
        setIsInitialized(true);
        setError("");

      } catch (err) {
        console.error("Error initializing scanner:", err);
        setError("Failed to initialize camera scanner. Please check camera permissions.");
        toast.error("Scanner initialization failed");
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initializeScanner, 100);

    return () => {
      clearTimeout(timer);
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, [onScanSuccess]);

  const handleClose = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/90 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Camera className="h-6 w-6 text-white" />
          <div>
            <h2 className="text-lg font-semibold text-white">Scan QR Code</h2>
            <p className="text-sm text-gray-300">Point your camera at the QR code</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="h-10 w-10 p-0 text-white hover:bg-white/20"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Scanner Container */}
      <div className="flex-1 relative bg-black">
        <div 
          id="simple-qr-scanner" 
          className="w-full h-full"
        />
        
        {/* Error Overlay */}
        {error && (
          <div className="absolute top-4 left-4 right-4 z-10">
            <div className="flex items-center gap-2 p-3 bg-red-500/90 border border-red-400 rounded-lg backdrop-blur-sm">
              <AlertCircle className="h-4 w-4 text-white flex-shrink-0" />
              <p className="text-sm text-white">{error}</p>
            </div>
          </div>
        )}

        {/* Instructions Overlay */}
        {isInitialized && !error && (
          <div className="absolute bottom-20 left-4 right-4 z-10">
            <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4 text-center">
              <p className="text-white text-sm">
                Position the QR code within the scanning area
              </p>
              <p className="text-white/70 text-xs mt-1">
                Make sure the code is well-lit and clearly visible
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="p-4 bg-black/90 backdrop-blur-sm">
        <Button
          variant="outline"
          onClick={handleClose}
          className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          Cancel Scanning
        </Button>
      </div>
    </div>
  );
}
