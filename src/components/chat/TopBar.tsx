
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
    <div className={`flex items-center justify-between h-12 ${isMobile ? 'px-4' : 'px-6'} border-b border-border-line bg-bg-base`}>
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger menu */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="h-8 w-8 text-text-secondary hover:text-text-primary hover:bg-bg-panel"
          >
            <Menu className="w-4 h-4" />
          </Button>
        )}
        
        {/* Connection status */}
        <div className="flex items-center gap-2">
          {getConnectionIcon()}
          {!isMobile && (
            <span className="text-xs text-text-secondary">{getConnectionText()}</span>
          )}
        </div>
      </div>

      {/* Theme toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="h-8 w-8 text-text-secondary hover:text-text-primary hover:bg-bg-panel"
      >
        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </Button>
    </div>
  );
};
