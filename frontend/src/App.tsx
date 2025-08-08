import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { TodoList } from "@/components/TodoList"
import { LoginPage } from "@/components/LoginPage"
import { AuthError } from "@/components/AuthError"
import { UserProfile } from "@/components/UserProfile"
import { AuthProvider, useAuth } from "@/contexts/AuthContext"
import { Toaster } from "sonner"
import { CheckSquare } from "lucide-react"
import { LoadingScreen } from "@/components/ui/loader"
import { PWAInstall, PWAStatus } from "@/components/PWAInstall"

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  // Check if we're on the error page
  if (window.location.pathname === '/auth/error') {
    return <AuthError />;
  }

  if (isLoading) {
    return <LoadingScreen message="Loading your todos..." />;
  }

  if (!isAuthenticated) {
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
                Minimalist It
              </h1>
              <p className="text-sm text-muted-foreground">Simple todo management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <UserProfile />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <PWAInstall />
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
        <PWAStatus />
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
