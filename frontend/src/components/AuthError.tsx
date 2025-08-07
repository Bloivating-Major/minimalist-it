import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

export function AuthError() {
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');
    
    switch (message) {
      case 'oauth_not_configured':
        setErrorMessage("Google OAuth is not configured. Please contact the administrator.");
        break;
      case 'access_denied':
        setErrorMessage("Access was denied. Please try again.");
        break;
      case 'invalid_request':
        setErrorMessage("Invalid request. Please try again.");
        break;
      default:
        setErrorMessage("An unexpected error occurred during authentication.");
    }
  }, []);

  const handleRetry = () => {
    window.location.href = '/';
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <Card className="border border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <CardTitle className="text-xl text-red-900 dark:text-red-100">
              Authentication Error
            </CardTitle>
            <CardDescription className="text-red-700 dark:text-red-300">
              {errorMessage}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleRetry}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              
              <Button
                onClick={handleGoBack}
                variant="outline"
                className="w-full border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>If this problem persists, please contact support.</p>
        </div>
      </div>
    </div>
  );
}
