
import React, { useState } from 'react';
import { Wifi, WifiOff, Moon, Sun, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { useIsMobile } from '@/hooks/use-mobile';

interface TopBarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connected');
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="w-4 h-4 text-state-positive" />;
      case 'connecting':
        return <Wifi className="w-4 h-4 text-yellow-500" />;
      case 'disconnected':
        return <WifiOff className="w-4 h-4 text-state-negative" />;
    }
  };

  const getConnectionText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'Disconnected';
    }
  };

  return (
    <div className="h-18 border-b border-border-line/50 glass-subtle px-6 lg:px-8 flex items-center justify-between backdrop-blur-xl">
      <div className="flex items-center space-x-4">
        {/* Mobile hamburger menu */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="h-11 w-11 rounded-xl hover:bg-bg-panel/60 hover:scale-105 transition-all duration-200 lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
        )}
        
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 rounded-full bg-accent-green animate-apple-pulse shadow-sm" />
          <span className="text-sm font-semibold text-hierarchy-primary tracking-tight">
            {getConnectionText()}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-11 w-11 rounded-xl hover:bg-bg-panel/60 hover:scale-105 transition-all duration-200"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </Button>
      </div>
    </div>
  );
};
