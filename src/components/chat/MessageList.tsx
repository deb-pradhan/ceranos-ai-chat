import React from 'react';
import { Copy, RotateCcw, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { LoadingIndicator } from './LoadingIndicators';
import { UIRenderer } from './UIRenderer';
import { useTheme } from '@/hooks/useTheme';

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
  const { theme } = useTheme();
  
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
        className={`px-4 md:px-6 py-4 md:py-6 ${isUser ? 'message-user' : 'message-assistant bg-bg-panel border-l-2 border-l-accent-orange/20'}`}
      >
        <div className="flex items-start gap-3 md:gap-4">
          {/* Avatar */}
          <div className={`flex-shrink-0 w-7 h-7 md:w-8 md:h-8 ${isUser ? 'bg-accent-orange/10 text-accent-orange rounded-full flex items-center justify-center' : ''}`}>
            {isUser ? <User className="w-3 h-3 md:w-4 md:h-4" /> : <img src="/lovable-uploads/938a410a-22f0-4046-91b8-c1136053ba95.png" alt="Brownstone Bot" className="w-full h-full object-contain" />}
          </div>

          {/* Message content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-text-primary">
                {isUser ? 'You' : 'BROWNSTONE'}
              </span>
              <span className="text-xs text-text-secondary">
                {formatTimestamp(message.created_at)}
              </span>
            </div>

            {/* Different rendering for user vs assistant messages */}
            {message.role === 'assistant' ? (
              // For assistant: Use UIRenderer which handles both text and UI specs
              <UIRenderer uiSpec={message.content} isStreaming={false} mode={theme} />
            ) : (
              // For user: Show as plain text
              <div className="prose prose-sm max-w-none text-text-primary">
                <pre className="whitespace-pre-wrap font-sans text-sm md:text-base leading-relaxed">
                  {message.content}
                </pre>
              </div>
            )}

            {/* Message actions */}
            <div className="flex items-center gap-2 mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(message.content)}
                className="h-8 px-2 text-text-secondary hover:text-text-primary hover:bg-bg-base"
              >
                <Copy className="w-3 h-3 mr-1" />
                Copy
              </Button>

              {isLastAssistantMessage && !isLoading && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRegenerateResponse}
                  className="h-8 px-2 text-text-secondary hover:text-text-primary hover:bg-bg-base"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Regenerate
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
      <div className="flex-1 flex items-center justify-center text-text-secondary">
        <div className="text-center border-l-2 border-l-accent-orange/20 p-8">
          <img src="/lovable-uploads/938a410a-22f0-4046-91b8-c1136053ba95.png" alt="Brownstone Bot" className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Ready to analyze the markets</p>
          <p className="text-sm">Ask me anything about crypto trends, sentiment, or on-chain data</p>
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
          <div className="px-4 md:px-6 py-4 md:py-6 message-assistant bg-bg-panel border-l-2 border-l-accent-orange/20 animate-fade-in-up">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8">
                <img src="/lovable-uploads/938a410a-22f0-4046-91b8-c1136053ba95.png" alt="Brownstone Bot" className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-text-primary">BROWNSTONE</span>
                  <span className="text-xs text-text-secondary">now</span>
                </div>
                <div className="py-2">
                  <LoadingIndicator phase={loadingPhase} />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Streaming message */}
        {streamingContent && (
          <div className="px-4 md:px-6 py-4 md:py-6 message-assistant bg-bg-panel border-l-2 border-l-accent-orange/20">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8">
                <img src="/lovable-uploads/938a410a-22f0-4046-91b8-c1136053ba95.png" alt="Brownstone Bot" className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-text-primary">BROWNSTONE</span>
                  <span className="text-xs text-text-secondary">now</span>
                </div>
                {/* Use UIRenderer for streaming - handles both text and UI specs */}
                <UIRenderer uiSpec={streamingContent} isStreaming={true} mode={theme} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};