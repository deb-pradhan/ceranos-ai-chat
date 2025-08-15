import React from 'react';
import { Copy, RotateCcw, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { LoadingIndicator } from './LoadingIndicators';
import { MarkdownContent } from './MarkdownContent';

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
          <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 flex items-center justify-center rounded-lg shadow-sm ${isUser ? 'bg-accent-blue text-white' : 'bg-text-secondary/10 text-text-secondary'}`}>
            {isUser ? <User className="icon-xs sm:icon-sm" /> : <Bot className="icon-xs sm:icon-sm" />}
          </div>

          {/* Message content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-bold text-text-primary tracking-tight">
                {isUser ? 'You' : 'CERANOS'}
              </span>
              <span className="text-xs text-text-tertiary font-medium">
                {formatTimestamp(message.created_at)}
              </span>
            </div>

            <div className="max-w-none">
              {isUser ? (
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed break-words text-text-primary">
                  {message.content}
                </pre>
              ) : (
                <MarkdownContent content={message.content} />
              )}
            </div>

            {/* Message actions */}
            <div className="flex items-center gap-1 mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(message.content)}
                className="touch-target-sm px-2 text-text-tertiary hover:text-text-primary hover:bg-bg-elevated rounded-lg transition-all duration-200"
              >
                <Copy className="icon-xs mr-1" />
                <span className="text-xs font-medium">Copy</span>
              </Button>

              {isLastAssistantMessage && !isLoading && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRegenerateResponse}
                  className="touch-target-sm px-2 text-text-tertiary hover:text-text-primary hover:bg-bg-elevated rounded-lg transition-all duration-200"
                >
                  <RotateCcw className="icon-xs mr-1" />
                  <span className="text-xs font-medium">Regenerate</span>
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
        <div className="text-center max-w-sm">
          <Bot className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-3 text-text-secondary/50" />
          <p className="text-sm sm:text-base font-bold text-text-primary mb-2">Ready to analyze the markets</p>
          <p className="text-xs sm:text-sm font-medium leading-relaxed">Ask me anything about crypto trends, sentiment, or on-chain data</p>
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
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-text-secondary/10 text-text-secondary rounded-lg shadow-sm">
                <Bot className="icon-xs sm:icon-sm" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold text-text-primary">CERANOS</span>
                  <span className="text-xs text-text-secondary font-medium">now</span>
                </div>
                <div className="py-1">
                  <LoadingIndicator phase={loadingPhase} />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Streaming message */}
        {streamingContent && (
          <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-5 md:py-6 message-assistant bg-bg-panel border-l-2 border-l-accent-blue/20">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-text-secondary/10 text-text-secondary rounded-lg shadow-sm">
                <Bot className="icon-xs sm:icon-sm" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold text-text-primary">CERANOS</span>
                  <span className="text-xs text-text-secondary font-medium">now</span>
                </div>
                <div className="max-w-none">
                  <MarkdownContent 
                    content={streamingContent + '\u200B'} 
                    className="relative"
                  />
                  <span className="inline-block w-1.5 h-3 bg-accent-blue/50 ml-1 animate-pulse"></span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};