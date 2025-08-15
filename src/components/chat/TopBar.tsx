
import React, { useState } from 'react';
import { Wifi, WifiOff, Moon, Sun, Menu, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile hamburger menu */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="h-9 w-9 text-text-secondary hover:text-text-primary hover:bg-bg-panel rounded-lg transition-all duration-200"
          >
            <Menu className="w-4 h-4" />
          </Button>
        )}
        
        {/* Logo for mobile */}
        {isMobile && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-accent-blue to-accent-blue-subtle rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-brand text-text-primary">CERANOS</span>
          </div>
        )}
        
        {/* Connection status for desktop */}
        {!isMobile && (
          <div className="flex items-center gap-2">
            <Badge variant={connectionStatus === 'connected' ? 'default' : 'destructive'} className="text-xs">
              {getConnectionIcon()}
              <span className="ml-1">{getConnectionText()}</span>
            </Badge>
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="hidden sm:inline-flex text-xs">
          GPT-4
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-9 w-9 text-text-secondary hover:text-text-primary hover:bg-bg-panel rounded-lg transition-all duration-200"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
};
