
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
    <div className="flex items-center justify-between h-12 sm:h-14 px-4 sm:px-6 border-b border-border-subtle bg-bg-base/95 backdrop-blur-xl shadow-sm">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Mobile hamburger menu */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="text-text-secondary hover:text-text-primary hover:bg-bg-panel rounded-lg transition-all duration-200"
          >
            <Menu className="icon-sm" />
          </Button>
        )}
        
        {/* Connection status */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {getConnectionIcon()}
          {!isMobile && (
            <span className="text-xs sm:text-sm text-text-secondary font-semibold tracking-wide">{getConnectionText()}</span>
          )}
        </div>
      </div>

      {/* Theme toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="text-text-secondary hover:text-text-primary hover:bg-bg-panel rounded-lg transition-all duration-200"
      >
        {theme === 'dark' ? <Sun className="icon-sm" /> : <Moon className="icon-sm" />}
      </Button>
    </div>
  );
};
