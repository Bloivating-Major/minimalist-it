import { useState } from "react";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "../contexts/AuthContext";

export function UserProfile() {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 hover:bg-muted/50"
      >
        {user.picture ? (
          <img
            src={user.picture}
            alt={user.name}
            className="h-8 w-8 rounded-full"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <User className="h-4 w-4" />
          </div>
        )}
        <span className="hidden md:inline text-sm font-medium">{user.name}</span>
      </Button>

      {showDropdown && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-64 z-20">
            <Card className="border border-border dropdown-backdrop user-profile shadow-2xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="h-10 w-10 rounded-full ring-2 ring-border/20"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center ring-2 ring-border/20">
                      <User className="h-5 w-5" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={logout}
                  variant="outline"
                  className="w-full justify-start border-border hover:bg-muted/50 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
