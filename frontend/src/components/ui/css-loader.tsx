import { cn } from "@/lib/utils";
import "./loader.css";

interface CSSLoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: string;
}

export function CSSLoader({ className, size = "md", color }: CSSLoaderProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16"
  };

  return (
    <div 
      className={cn("minimalist-loader", sizeClasses[size], className)}
      style={color ? { color } : undefined}
    />
  );
}

// Variants
export function SpinLoader({ className, size = "md" }: Omit<CSSLoaderProps, 'color'>) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10", 
    lg: "w-16 h-16"
  };

  return (
    <div className={cn("spin-loader", sizeClasses[size], className)} />
  );
}

export function PulseLoader({ className, size = "md" }: Omit<CSSLoaderProps, 'color'>) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16"
  };

  return (
    <div className={cn("pulse-loader", sizeClasses[size], className)} />
  );
}

export function DotsLoader({ className }: { className?: string }) {
  return (
    <div className={cn("dots-loader", className)}>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}
