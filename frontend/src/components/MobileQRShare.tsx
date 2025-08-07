import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Copy, Check, Smartphone } from "lucide-react";
import QRCode from "react-qr-code";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

export function MobileQRShare() {
  const { token } = useAuth();
  const [copied, setCopied] = useState(false);
  const [mobileUrl, setMobileUrl] = useState("");

  useEffect(() => {
    // Get the network IP for mobile access
    const hostname = window.location.hostname;
    const port = window.location.port || '5173';
    
    // Create mobile URL with token
    if (token) {
      const baseUrl = `http://${hostname === 'localhost' ? '192.168.29.152' : hostname}:${port}`;
      const urlWithToken = `${baseUrl}?token=${token}`;
      setMobileUrl(urlWithToken);
    }
  }, [token]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(mobileUrl);
      setCopied(true);
      toast.success("Mobile URL copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy URL");
    }
  };

  if (!token || !mobileUrl) {
    return null;
  }

  return (
    <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <QrCode className="h-8 w-8 text-blue-500" />
        </div>
        <CardTitle className="text-lg">Access on Mobile</CardTitle>
        <CardDescription>
          Scan the QR code or copy the link to access your todos on mobile
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* QR Code */}
        <div className="flex justify-center p-4 bg-white rounded-lg">
          <QRCode
            size={200}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={mobileUrl}
            viewBox={`0 0 200 200`}
          />
        </div>

        {/* Mobile URL */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Mobile URL:</p>
          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded border">
            <code className="flex-1 text-xs text-muted-foreground truncate">
              {mobileUrl}
            </code>
            <Button
              size="sm"
              variant="ghost"
              onClick={copyToClipboard}
              className="h-8 w-8 p-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-3 pt-2 border-t border-border/50">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
              1
            </div>
            <div>
              <p className="text-sm font-medium">Scan QR Code</p>
              <p className="text-xs text-muted-foreground">Use your phone's camera to scan the QR code above</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
              2
            </div>
            <div>
              <p className="text-sm font-medium">Access Your Todos</p>
              <p className="text-xs text-muted-foreground">You'll be automatically signed in on your mobile device</p>
            </div>
          </div>
        </div>

        {/* Alternative */}
        <div className="text-center pt-2">
          <p className="text-xs text-muted-foreground">
            <Smartphone className="h-3 w-3 inline mr-1" />
            Or manually enter the URL in your mobile browser
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
