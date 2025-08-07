import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare } from "lucide-react";
import { GoogleIcon } from "@/components/ui/google-icon";

import { useAuth } from "../contexts/AuthContext";

export function LoginPage() {
  const { login, isLoading } = useAuth();

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
          <h1 className="text-3xl font-semibold text-foreground">Minimal List It</h1>
          <p className="text-muted-foreground mt-2">Minimalist productivity</p>
        </div>

        {/* Login Card */}
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access your todos and stay organized
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              onClick={login}
              disabled={isLoading}
              className="w-full bg-white dark:bg-white text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-100 border border-gray-300 dark:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] font-medium text-base py-6 rounded-lg disabled:hover:scale-100 disabled:opacity-60"
              size="lg"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-400 border-t-transparent mr-3" />
              ) : (
                <GoogleIcon className="mr-3 transition-transform duration-200" size={20} />
              )}
              Continue with Google
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Secure authentication powered by Google OAuth
              </p>
              <p className="text-xs text-muted-foreground">
                We'll never share your personal information
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="text-center space-y-4">
          <h3 className="text-sm font-medium text-foreground">Why Minimal List It?</h3>
          <div className="grid grid-cols-1 gap-3 text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-2">
              <div className="h-1.5 w-1.5 bg-foreground rounded-full"></div>
              <span>Minimalist design focused on productivity</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="h-1.5 w-1.5 bg-foreground rounded-full"></div>
              <span>Secure cloud sync across all devices</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="h-1.5 w-1.5 bg-foreground rounded-full"></div>
              <span>Priority management and progress tracking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
