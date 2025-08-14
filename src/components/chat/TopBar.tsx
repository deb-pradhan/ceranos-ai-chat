
import React, { useState } from 'react';
import { Wifi, WifiOff, Moon, Sun, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/hooks/useTheme';

export const TopBar: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connected');
  const { theme, toggleTheme } = useTheme();

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
    <div className="flex items-center justify-end h-12 px-6 border-b border-border-line bg-bg-base">
      <div className="flex items-center gap-4">
        {/* Connection status */}
        <div className="flex items-center gap-2 px-2">
          {getConnectionIcon()}
          <span className="text-xs text-text-secondary">{getConnectionText()}</span>
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

        {/* Settings menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-text-secondary hover:text-text-primary hover:bg-bg-panel">
              <Settings className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="border-border-line bg-bg-panel">
            <DropdownMenuItem className="text-text-primary hover:bg-bg-base">
              Preferences
            </DropdownMenuItem>
            <DropdownMenuItem className="text-text-primary hover:bg-bg-base">
              API Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="text-text-primary hover:bg-bg-base">
              Export Chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
