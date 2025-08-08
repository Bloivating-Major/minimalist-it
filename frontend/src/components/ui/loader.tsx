import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "accent";
}

export function Loader({ className, size = "md", variant = "primary" }: LoaderProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10", 
    lg: "w-16 h-16"
  };

  const variantClasses = {
    primary: "text-primary",
    secondary: "text-muted-foreground", 
    accent: "text-blue-500"
  };

  return (
    <div
      className={cn("minimalist-loader", sizeClasses[size], variantClasses[variant], className)}
      style={{
        aspectRatio: '1',
        position: 'relative',
        background: `
          conic-gradient(from 134deg at top, currentColor 92deg, transparent 0) top,
          conic-gradient(from -46deg at bottom, currentColor 92deg, transparent 0) bottom
        `,
        backgroundSize: '100% 50%',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div
        style={{
          content: '""',
          position: 'absolute',
          inset: '0',
          background: `
            linear-gradient(45deg, currentColor 14.5px, transparent 0 calc(100% - 14.5px), currentColor 0),
            linear-gradient(-45deg, currentColor 14.5px, transparent 0 calc(100% - 14.5px), currentColor 0)
          `,
          animation: 'minimalist-spin 1.5s infinite cubic-bezier(0.3, 1, 0, 1)'
        }}
      />
      <style>{`
        @keyframes minimalist-spin {
          33% { inset: -10px; transform: rotate(0deg); }
          66% { inset: -10px; transform: rotate(90deg); }
          100% { inset: 0; transform: rotate(90deg); }
        }
      `}</style>
    </div>
  );
}

// Loading Screen Component
interface LoadingScreenProps {
  message?: string;
  className?: string;
}

export function LoadingScreen({ message = "Loading...", className }: LoadingScreenProps) {
  return (
    <div className={cn(
      "fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50",
      className
    )}>
      <div className="flex flex-col items-center gap-4">
        <Loader size="lg" variant="primary" />
        <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
      </div>
    </div>
  );
}

// Inline Loader Component
interface InlineLoaderProps {
  message?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function InlineLoader({ message, className, size = "md" }: InlineLoaderProps) {
  return (
    <div className={cn("flex items-center justify-center gap-3 py-8", className)}>
      <Loader size={size} variant="primary" />
      {message && (
        <span className="text-sm text-muted-foreground animate-pulse">{message}</span>
      )}
    </div>
  );
}
