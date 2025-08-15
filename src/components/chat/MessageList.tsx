import React from 'react';
import { Copy, RotateCcw, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { LoadingIndicator } from './LoadingIndicators';

interface Message {
  id: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

interface MessageListProps {
  messages: Message[];
  streamingContent: string;
  onRegenerateResponse: () => void;
  isLoading: boolean;
  loadingPhase: 'thinking' | 'searching' | 'analyzing' | 'typing' | null;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  streamingContent,
  onRegenerateResponse,
  isLoading,
  loadingPhase
}) => {
  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied",
        description: "Message copied to clipboard"
      });
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderMessage = (message: Message, index: number) => {
    const isUser = message.role === 'user';
    const isLastAssistantMessage = !isUser && index === messages.length - 1;

    return (
      <div
        key={message.id}
        className={`px-3 sm:px-4 md:px-6 py-4 sm:py-5 md:py-6 ${isUser ? 'message-user' : 'message-assistant bg-bg-panel/50 border-l-2 sm:border-l-4 border-l-accent-blue/30'}`}
      >
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Avatar */}
          <div className={`flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg ${isUser ? 'bg-accent-blue/15 text-accent-blue border border-accent-blue/20' : 'bg-bg-elevated text-text-secondary border border-border-subtle'} shadow-sm`}>
            {isUser ? <User className="icon-sm" /> : <Bot className="icon-sm" />}
          </div>

          {/* Message content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <span className="text-sm sm:text-base font-bold text-text-primary tracking-tight">
                {isUser ? 'You' : 'CERANOS'}
              </span>
              <span className="text-xs sm:text-sm text-text-tertiary font-semibold tracking-wide">
                {formatTimestamp(message.created_at)}
              </span>
            </div>

            <div className="prose prose-sm max-w-none text-text-primary">
              <pre className="whitespace-pre-wrap font-sans text-sm sm:text-base leading-relaxed tracking-tight">
                {message.content}
              </pre>
            </div>

            {/* Message actions */}
            <div className="flex items-center gap-1 sm:gap-2 mt-3 sm:mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(message.content)}
                className="h-8 sm:h-9 px-2 sm:px-3 text-text-tertiary hover:text-text-primary hover:bg-bg-elevated rounded-lg transition-all duration-200"
              >
                <Copy className="icon-xs sm:w-3 sm:h-3 mr-1 sm:mr-1.5" />
                <span className="text-xs sm:text-sm font-semibold">Copy</span>
              </Button>

              {isLastAssistantMessage && !isLoading && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRegenerateResponse}
                  className="h-8 sm:h-9 px-2 sm:px-3 text-text-tertiary hover:text-text-primary hover:bg-bg-elevated rounded-lg transition-all duration-200"
                >
                  <RotateCcw className="icon-xs sm:w-3 sm:h-3 mr-1 sm:mr-1.5" />
                  <span className="text-xs sm:text-sm font-semibold">Regenerate</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (messages.length === 0 && !streamingContent && !loadingPhase) {
    return (
      <div className="flex-1 flex items-center justify-center text-text-secondary px-4">
        <div className="text-center max-w-md">
          <Bot className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-text-secondary/50" />
          <p className="text-base sm:text-lg font-bold text-text-primary mb-2">Ready to analyze the markets</p>
          <p className="text-sm sm:text-base font-medium leading-relaxed">Ask me anything about crypto trends, sentiment, or on-chain data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="min-h-full">
        {messages.map((message, index) => renderMessage(message, index))}
        
        {/* Loading phase indicator */}
        {loadingPhase && (
          <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-5 md:py-6 message-assistant bg-bg-panel border-l-2 border-l-accent-blue/20 animate-fade-in">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-bg-base text-text-secondary border border-border-line rounded-lg">
                <Bot className="icon-sm" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm sm:text-base font-bold text-text-primary">CERANOS</span>
                  <span className="text-xs sm:text-sm text-text-secondary font-semibold">now</span>
                </div>
                <div className="py-1 sm:py-2">
                  <LoadingIndicator phase={loadingPhase} />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Streaming message */}
        {streamingContent && (
          <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-5 md:py-6 message-assistant bg-bg-panel border-l-2 border-l-accent-blue/20">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-bg-base text-text-secondary border border-border-line rounded-lg">
                <Bot className="icon-sm" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm sm:text-base font-bold text-text-primary">CERANOS</span>
                  <span className="text-xs sm:text-sm text-text-secondary font-semibold">now</span>
                </div>
                <div className="prose prose-sm max-w-none text-text-primary">
                  <pre className="whitespace-pre-wrap font-sans text-sm sm:text-base leading-relaxed">
                    {streamingContent}
                    <span className="inline-block w-1.5 sm:w-2 h-3 sm:h-4 bg-accent-blue/50 ml-1 animate-pulse"></span>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};