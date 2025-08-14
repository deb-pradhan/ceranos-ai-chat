import React from 'react';
import { Brain, Search, BarChart3, PenTool } from 'lucide-react';

interface LoadingIndicatorProps {
  phase: 'thinking' | 'searching' | 'analyzing' | 'typing';
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ phase }) => {
  const getPhaseConfig = () => {
    switch (phase) {
      case 'thinking':
        return {
          icon: Brain,
          text: 'Thinking',
          animation: 'animate-pulse'
        };
      case 'searching':
        return {
          icon: Search,
          text: 'Searching markets',
          animation: 'animate-spin'
        };
      case 'analyzing':
        return {
          icon: BarChart3,
          text: 'Analyzing data',
          animation: 'animate-pulse'
        };
      case 'typing':
        return {
          icon: PenTool,
          text: 'Typing response',
          animation: 'animate-bounce'
        };
    }
  };

  const config = getPhaseConfig();
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-3 text-text-secondary">
      <Icon className={`w-4 h-4 ${config.animation}`} />
      <span className="text-sm">{config.text}</span>
      <div className="flex gap-1">
        <div className="w-1 h-1 bg-accent-blue rounded-full animate-loading-dot animation-delay-0"></div>
        <div className="w-1 h-1 bg-accent-blue rounded-full animate-loading-dot animation-delay-100"></div>
        <div className="w-1 h-1 bg-accent-blue rounded-full animate-loading-dot animation-delay-200"></div>
      </div>
    </div>
  );
};