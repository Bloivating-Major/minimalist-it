import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { TodoList } from "@/components/TodoList"
import { LoginPage } from "@/components/LoginPage"
import { MobileLoginGuide } from "@/components/MobileLoginGuide"
import { MobileQRShare } from "@/components/MobileQRShare"
import { AuthError } from "@/components/AuthError"
import { UserProfile } from "@/components/UserProfile"
import { AuthProvider, useAuth } from "@/contexts/AuthContext"
import { Toaster } from "sonner"
import { CheckSquare, Smartphone } from "lucide-react"
import { useState } from "react"

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [showMobileQR, setShowMobileQR] = useState(false);

  // Check if we're on the error page
  if (window.location.pathname === '/auth/error') {
    return <AuthError />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="p-3 bg-foreground rounded-lg">
            <CheckSquare className="h-8 w-8 text-background" />
          </div>
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-foreground border-t-transparent"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Check if we're on mobile/network IP (not localhost)
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    if (!isLocalhost) {
      return <MobileLoginGuide />;
    }

    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-foreground rounded-lg">
              <CheckSquare className="h-5 w-5 text-background" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                TodoMaster
              </h1>
              <p className="text-sm text-muted-foreground">Minimalist productivity</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMobileQR(!showMobileQR)}
              className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
              title="Share mobile access"
            >
              <Smartphone className="h-5 w-5" />
            </button>
            <ThemeToggle />
            <UserProfile />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {showMobileQR && (
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <MobileQRShare />
              </div>
            </div>
          )}
          <TodoList />
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="todo-ui-theme">
      <AuthProvider>
        <AppContent />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'hsl(var(--card))',
              color: 'hsl(var(--card-foreground))',
              border: '1px solid hsl(var(--border))',
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
