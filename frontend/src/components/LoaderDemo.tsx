import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CSSLoader, SpinLoader, PulseLoader, DotsLoader } from "@/components/ui/css-loader";
import { LoadingScreen, InlineLoader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function LoaderDemo() {
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);

  const showDemo = () => {
    setShowLoadingScreen(true);
    setTimeout(() => setShowLoadingScreen(false), 3000);
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      {showLoadingScreen && <LoadingScreen message="Demo loading screen..." />}
      
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Loader Components Demo</h1>
        <p className="text-muted-foreground">Beautiful animated loaders for Minimalist It</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Minimalist Loader */}
        <Card>
          <CardHeader>
            <CardTitle>Minimalist Loader</CardTitle>
            <CardDescription>Your custom animated loader</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <CSSLoader size="sm" />
              <CSSLoader size="md" />
              <CSSLoader size="lg" />
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Small, Medium, Large</p>
            </div>
          </CardContent>
        </Card>

        {/* Spin Loader */}
        <Card>
          <CardHeader>
            <CardTitle>Spin Loader</CardTitle>
            <CardDescription>Classic spinning loader</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <SpinLoader size="sm" />
              <SpinLoader size="md" />
              <SpinLoader size="lg" />
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Smooth rotation</p>
            </div>
          </CardContent>
        </Card>

        {/* Pulse Loader */}
        <Card>
          <CardHeader>
            <CardTitle>Pulse Loader</CardTitle>
            <CardDescription>Pulsing circle animation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <PulseLoader size="sm" />
              <PulseLoader size="md" />
              <PulseLoader size="lg" />
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Gentle pulsing</p>
            </div>
          </CardContent>
        </Card>

        {/* Dots Loader */}
        <Card>
          <CardHeader>
            <CardTitle>Dots Loader</CardTitle>
            <CardDescription>Three bouncing dots</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center">
              <DotsLoader />
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Bouncing sequence</p>
            </div>
          </CardContent>
        </Card>

        {/* Inline Loader */}
        <Card>
          <CardHeader>
            <CardTitle>Inline Loader</CardTitle>
            <CardDescription>Loader with message</CardDescription>
          </CardHeader>
          <CardContent>
            <InlineLoader message="Loading todos..." size="md" />
          </CardContent>
        </Card>

        {/* Loading Screen Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Loading Screen</CardTitle>
            <CardDescription>Full screen overlay</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={showDemo} className="w-full">
              Show Loading Screen
            </Button>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">3 second demo</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Examples</CardTitle>
          <CardDescription>How to use these loaders in your components</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Button Loading State:</h4>
            <div className="flex gap-2">
              <Button disabled>
                <CSSLoader size="sm" className="mr-2" />
                Loading...
              </Button>
              <Button disabled>
                <DotsLoader className="mr-2" />
                Processing
              </Button>
            </div>
          </div>
          
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Content Loading:</h4>
            <InlineLoader message="Fetching your todos..." />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
