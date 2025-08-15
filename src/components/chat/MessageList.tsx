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
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`flex space-x-4 max-w-[85%] lg:max-w-[70%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
          {!isUser && (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-blue to-accent-blue-subtle flex items-center justify-center flex-shrink-0 shadow-lg hover:scale-105 transition-transform duration-200">
              <Bot className="w-5 h-5 text-white" />
            </div>
          )}
          
          <div className={`group relative transition-all duration-300 hover:scale-[1.01] ${
            isUser 
              ? 'bg-gradient-to-br from-accent-blue to-accent-blue-subtle text-white shadow-lg' 
              : 'glass-effect shadow-lg hover:shadow-xl'
          } rounded-2xl px-6 py-5`}>
            <div className={`prose prose-sm max-w-none ${
              isUser 
                ? 'prose-invert [&>*]:text-white' 
                : 'text-hierarchy-primary [&>h1]:text-hierarchy-primary [&>h2]:text-hierarchy-primary [&>h3]:text-hierarchy-primary'
            }`}>
              <pre className="whitespace-pre-wrap font-sans text-sm md:text-base leading-relaxed tracking-tight">
                {message.content}
              </pre>
            </div>
            
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-current/10">
              <span className={`text-xs font-medium ${
                isUser ? 'text-white/70' : 'text-hierarchy-tertiary'
              }`}>
                {formatTimestamp(message.created_at)}
              </span>
              
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(message.content)}
                  className={`h-8 w-8 p-0 rounded-lg transition-all duration-200 hover:scale-110 ${
                    isUser 
                      ? 'hover:bg-white/20 text-white/70 hover:text-white' 
                      : 'hover:bg-bg-elevated/80 text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Copy className="w-3.5 h-3.5" />
                </Button>
                
                {isLastAssistantMessage && !isLoading && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRegenerateResponse}
                    className="h-8 w-8 p-0 rounded-lg hover:bg-bg-elevated/80 text-text-secondary hover:text-text-primary transition-all duration-200 hover:scale-110"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (messages.length === 0 && !streamingContent && !loadingPhase) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-6 animate-fade-in-scale max-w-md">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-accent-blue to-accent-blue-subtle flex items-center justify-center shadow-xl hover:scale-105 transition-transform duration-300">
            <Bot className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-hierarchy-primary tracking-tight">
              Welcome to CERANOS
            </h2>
            <p className="text-hierarchy-secondary text-base leading-relaxed">
              Your AI-powered market analysis assistant. Ask me anything about markets, trading strategies, or financial data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin p-4 lg:p-6">
      <div className="min-h-full space-y-6">
        {messages.map((message, index) => (
          <div 
            key={message.id} 
            className="message-enter"
            style={{ '--index': index } as React.CSSProperties}
          >
            {renderMessage(message, index)}
          </div>
        ))}
        
        {/* Loading phase indicator */}
        {loadingPhase && (
          <div className="animate-fade-in-up">
            <div className="flex justify-start">
              <div className="flex space-x-4 max-w-[85%] lg:max-w-[70%]">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-blue to-accent-blue-subtle flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="glass-effect rounded-2xl px-6 py-4 shadow-lg">
                  <LoadingIndicator phase={loadingPhase} />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Streaming message */}
        {streamingContent && (
          <div className="animate-fade-in-up">
            <div className="flex justify-start">
              <div className="flex space-x-4 max-w-[85%] lg:max-w-[70%]">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-blue to-accent-blue-subtle flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="glass-effect rounded-2xl px-6 py-4 shadow-lg">
                  <div className="prose prose-sm max-w-none text-hierarchy-primary">
                    <pre className="whitespace-pre-wrap font-sans text-sm md:text-base leading-relaxed">
                      {streamingContent}
                      <span className="inline-block w-0.5 h-5 bg-accent-blue ml-1 animate-apple-pulse rounded-full"></span>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};