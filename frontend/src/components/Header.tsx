import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User, CheckSquare } from "lucide-react";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <header className="glass-morphism border-b border-border/50 relative px-6 py-4 z-50">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent">
            <CheckSquare className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            TaskFlow
          </h1>
        </div>

        {/* User Menu */}
        <div className="relative">
          <Button
            variant="glass"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">
              {user?.fullname}
            </span>
          </Button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 glass-morphism rounded-lg shadow-xl border border-border/50 py-2 z-50 animate-fade-in">
              <div className="px-4 py-3 border-b border-border/30">
                <p className="text-sm font-medium text-foreground">
                  {user?.fullname}
                </p>
                <p className="text-xs text-muted-foreground">
                  @{user?.username}
                </p>
              </div>
              <div className="py-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
