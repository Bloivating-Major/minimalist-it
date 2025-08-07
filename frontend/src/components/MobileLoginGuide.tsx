import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, Smartphone, Monitor, Camera } from "lucide-react";
import { GoogleIcon } from "@/components/ui/google-icon";
import { SimpleQRScanner } from "./SimpleQRScanner";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

export function MobileLoginGuide() {
  const [showScanner, setShowScanner] = useState(false);
  const { login, isLoading } = useAuth();

  const handleDesktopLogin = () => {
    // Open desktop version in a new tab/window
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const desktopUrl = hostname === 'localhost' ? 'http://localhost:5173' : `${protocol}//${hostname}:5173`;
    window.open(desktopUrl, '_blank');
  };

  const handleGoogleLogin = () => {
    login();
  };

  const handleScanSuccess = (token: string) => {
    // Store the token and redirect
    localStorage.setItem('auth_token', token);
    toast.success("Successfully signed in!");
    // Reload the page to trigger authentication
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-foreground rounded-lg">
              <CheckSquare className="h-8 w-8 text-background" />
            </div>
          </div>
          <h1 className="text-3xl font-semibold text-foreground">TodoMaster</h1>
          <p className="text-muted-foreground mt-2">Minimalist productivity</p>
        </div>

        {/* Mobile Notice Card */}
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <Smartphone className="h-8 w-8 text-blue-500" />
            </div>
            <CardTitle className="text-xl">Mobile Access</CardTitle>
            <CardDescription>
              Google OAuth requires a secure domain for mobile access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Steps */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <p className="font-medium text-sm text-green-800 dark:text-green-200">Scan QR Code (Recommended)</p>
                  <p className="text-xs text-green-700 dark:text-green-300">Use your camera to scan QR code from desktop</p>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <span className="text-xs text-muted-foreground">OR</span>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <p className="font-medium text-sm">Sign in on Desktop</p>
                  <p className="text-xs text-muted-foreground">Use your computer to authenticate with Google</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => setShowScanner(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                <Camera className="h-5 w-5 mr-2" />
                Scan QR Code
              </Button>

              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-border"></div>
                <span className="text-xs text-muted-foreground">OR</span>
                <div className="flex-1 h-px bg-border"></div>
              </div>

              <Button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full bg-white dark:bg-white text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-100 border border-gray-300 dark:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                size="lg"
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-400 border-t-transparent mr-3" />
                ) : (
                  <GoogleIcon className="mr-3" size={20} />
                )}
                Continue with Google
              </Button>

              <Button
                onClick={handleDesktopLogin}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Monitor className="h-5 w-5 mr-2" />
                Open Desktop Version
              </Button>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Multiple ways to access your todos
                </p>
              </div>
            </div>


          </CardContent>
        </Card>

        {/* Features */}
        <div className="text-center space-y-4">
          <h3 className="text-sm font-medium text-foreground">How QR Scanning Works</h3>
          <div className="grid grid-cols-1 gap-3 text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-2">
              <div className="h-1.5 w-1.5 bg-green-500 rounded-full"></div>
              <span>Desktop user generates QR code after login</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="h-1.5 w-1.5 bg-blue-500 rounded-full"></div>
              <span>Mobile user scans QR code with camera</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="h-1.5 w-1.5 bg-purple-500 rounded-full"></div>
              <span>Instant sign-in with same account</span>
            </div>
          </div>
        </div>

        {/* QR Scanner Modal */}
        {showScanner && (
          <SimpleQRScanner
            onScanSuccess={handleScanSuccess}
            onClose={() => setShowScanner(false)}
          />
        )}
      </div>
    </div>
  );
}
