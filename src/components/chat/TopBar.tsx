
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
        return <Wifi className="icon-sm text-state-positive" />;
      case 'connecting':
        return <Wifi className="icon-sm text-yellow-500" />;
      case 'disconnected':
        return <WifiOff className="icon-sm text-state-negative" />;
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
    <div className="flex items-center justify-between h-12 sm:h-14 px-3 sm:px-4 border-b border-border-subtle bg-bg-base/95 backdrop-blur-xl shadow-sm">
      {/* Left Section */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile hamburger menu */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="flex-shrink-0 touch-target text-text-secondary hover:text-text-primary hover:bg-bg-panel rounded-lg transition-all duration-200"
          >
            <Menu className="icon-sm" />
          </Button>
        )}
        
        {/* Connection status */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <div className="flex-shrink-0">
            {getConnectionIcon()}
          </div>
          {!isMobile && (
            <span className="text-xs text-text-secondary font-medium truncate">{getConnectionText()}</span>
          )}
        </div>
      </div>

      {/* Theme toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="flex-shrink-0 touch-target text-text-secondary hover:text-text-primary hover:bg-bg-panel rounded-lg transition-all duration-200"
      >
        {theme === 'dark' ? <Sun className="icon-sm" /> : <Moon className="icon-sm" />}
      </Button>
    </div>
  );
};
