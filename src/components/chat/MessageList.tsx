import React from 'react';
import { Copy, RotateCcw, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
      <div key={message.id} className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        <Card className={`${isUser ? 'ml-8 sm:ml-12 bg-bg-elevated' : 'mr-8 sm:mr-12 bg-bg-panel border-l-2 border-l-accent-blue/30'} shadow-sm`}>
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start gap-3 sm:gap-4">
              {/* Avatar */}
              {isUser ? (
                <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg shadow-sm bg-accent-blue text-white">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              ) : (
                <Avatar className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 shadow-sm border-2 border-accent-blue/20">
                  <AvatarImage src="/lovable-uploads/c8e5d972-92c7-4717-aba0-6514a59cf8e9.png" alt="CERANOS Bot" />
                  <AvatarFallback className="bg-accent-blue/10 text-accent-blue border-0">
                    <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
                  </AvatarFallback>
                </Avatar>
              )}

              {/* Message content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant={isUser ? "default" : "secondary"} className="text-xs font-semibold">
                    {isUser ? 'You' : 'CERANOS'}
                  </Badge>
                  <span className="text-xs text-text-tertiary font-medium">
                    {formatTimestamp(message.created_at)}
                  </span>
                </div>

                <div className="prose prose-sm max-w-none text-text-primary">
                  {isUser ? (
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed break-words bg-transparent m-0 p-0">
                      {message.content}
                    </pre>
                  ) : (
                    <MarkdownContent content={message.content} />
                  )}
                </div>

                <Separator className="my-3 bg-border-subtle" />

                {/* Message actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(message.content)}
                    className="h-8 px-3 text-text-tertiary hover:text-text-primary hover:bg-bg-base transition-all duration-200"
                  >
                    <Copy className="w-3 h-3 mr-1.5" />
                    <span className="text-xs font-medium">Copy</span>
                  </Button>

                  {isLastAssistantMessage && !isLoading && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onRegenerateResponse}
                      className="h-8 px-3 text-text-tertiary hover:text-text-primary hover:bg-bg-base transition-all duration-200"
                    >
                      <RotateCcw className="w-3 h-3 mr-1.5" />
                      <span className="text-xs font-medium">Regenerate</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (messages.length === 0 && !streamingContent && !loadingPhase) {
    return (
      <div className="flex-1 flex items-center justify-center text-text-secondary px-4">
        <div className="text-center max-w-sm">
          <Avatar className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-3">
            <AvatarImage src="/lovable-uploads/c8e5d972-92c7-4717-aba0-6514a59cf8e9.png" alt="CERANOS Bot" />
            <AvatarFallback className="bg-text-secondary/10 text-text-secondary/50">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
            </AvatarFallback>
          </Avatar>
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
          <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 animate-fade-in">
            <Card className="mr-8 sm:mr-12 bg-bg-panel border-l-2 border-l-accent-blue/20 shadow-sm">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <Avatar className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 shadow-sm border-2 border-accent-blue/20">
                    <AvatarImage src="/lovable-uploads/c8e5d972-92c7-4717-aba0-6514a59cf8e9.png" alt="CERANOS Bot" />
                    <AvatarFallback className="bg-accent-blue/10 text-accent-blue border-0">
                      <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="text-xs font-semibold">CERANOS</Badge>
                      <span className="text-xs text-text-tertiary font-medium">now</span>
                    </div>
                    <div className="py-1">
                      <LoadingIndicator phase={loadingPhase} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Streaming message */}
        {streamingContent && (
          <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
            <Card className="mr-8 sm:mr-12 bg-bg-panel border-l-2 border-l-accent-blue/20 shadow-sm">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <Avatar className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 shadow-sm border-2 border-accent-blue/20">
                    <AvatarImage src="/lovable-uploads/c8e5d972-92c7-4717-aba0-6514a59cf8e9.png" alt="CERANOS Bot" />
                    <AvatarFallback className="bg-accent-blue/10 text-accent-blue border-0">
                      <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="text-xs font-semibold">CERANOS</Badge>
                      <span className="text-xs text-text-tertiary font-medium">now</span>
                    </div>
                    <div className="prose prose-sm max-w-none text-text-primary relative">
                      <MarkdownContent 
                        content={streamingContent + '\u200B'} 
                        className="bg-transparent m-0 p-0"
                      />
                      <span className="inline-block w-1.5 h-4 bg-accent-blue ml-1 animate-pulse rounded-sm"></span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};