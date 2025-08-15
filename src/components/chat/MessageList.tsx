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
        className={`px-4 md:px-6 py-4 md:py-6 ${isUser ? 'message-user' : 'message-assistant bg-bg-panel border-l-2 border-l-accent-blue/20'}`}
      >
        <div className="flex items-start gap-3 md:gap-4">
          {/* Avatar */}
          <div className={`flex-shrink-0 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center ${isUser ? 'bg-accent-blue/10 text-accent-blue' : 'bg-bg-base text-text-secondary'} border border-border-line`}>
            {isUser ? <User className="w-3 h-3 md:w-4 md:h-4" /> : <Bot className="w-3 h-3 md:w-4 md:h-4" />}
          </div>

          {/* Message content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-text-primary">
                {isUser ? 'You' : 'CERANOS'}
              </span>
              <span className="text-xs text-text-secondary">
                {formatTimestamp(message.created_at)}
              </span>
            </div>

            <div className="prose prose-sm max-w-none text-text-primary">
              <pre className="whitespace-pre-wrap font-sans text-sm md:text-base leading-relaxed">
                {message.content}
              </pre>
            </div>

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
        <div className="text-center">
          <Bot className="w-12 h-12 mx-auto mb-4 text-text-secondary/50" />
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
          <div className="px-4 md:px-6 py-4 md:py-6 message-assistant bg-bg-panel border-l-2 border-l-accent-blue/20 animate-fade-in-up">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-bg-base text-text-secondary border border-border-line">
                <Bot className="w-3 h-3 md:w-4 md:h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-text-primary">CERANOS</span>
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
          <div className="px-4 md:px-6 py-4 md:py-6 message-assistant bg-bg-panel border-l-2 border-l-accent-blue/20">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-bg-base text-text-secondary border border-border-line">
                <Bot className="w-3 h-3 md:w-4 md:h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-text-primary">CERANOS</span>
                  <span className="text-xs text-text-secondary">now</span>
                </div>
                <div className="prose prose-sm max-w-none text-text-primary">
                  <pre className="whitespace-pre-wrap font-sans text-sm md:text-base leading-relaxed">
                    {streamingContent}
                    <span className="inline-block w-2 h-4 bg-accent-blue/50 ml-1 animate-pulse"></span>
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