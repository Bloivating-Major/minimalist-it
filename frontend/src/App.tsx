import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { TodoList } from "@/components/TodoList"
import { LoginPage } from "@/components/LoginPage"
import { AuthError } from "@/components/AuthError"
import { UserProfile } from "@/components/UserProfile"
import { AuthProvider, useAuth } from "@/contexts/AuthContext"
import { Toaster } from "sonner"
import { CheckSquare } from "lucide-react"

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

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
