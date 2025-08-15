import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 96)}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;

    console.log('ChatInput: Sending message:', message);
    onSendMessage(message.trim());
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === 'Escape') {
      if (message.trim()) {
        const confirmed = window.confirm('Clear your current message?');
        if (confirmed) {
          setMessage('');
        }
      }
    }
  };

  const handleAttachments = () => {
    // Future: File attachment functionality
    console.log('Attachments clicked (future feature)');
  };

  return (
    <div className="border-t border-border-subtle bg-bg-base/95 backdrop-blur-xl">
      <div className="px-3 sm:px-4 py-3 sm:py-4">
        <Card className="shadow-md border-border-line bg-bg-panel/50 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="flex items-end gap-3 p-3">
            {/* Attachment button (future) */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleAttachments}
                  disabled={disabled}
                  className="flex-shrink-0 h-10 w-10 text-text-secondary hover:text-text-primary hover:bg-bg-base rounded-xl transition-all duration-200"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Attach files (coming soon)</p>
              </TooltipContent>
            </Tooltip>

            {/* Message input */}
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask CERANOS about the markets..."
                disabled={disabled}
                className="min-h-[44px] max-h-24 resize-none border-border-subtle bg-bg-elevated text-text-primary placeholder:text-text-secondary focus-visible:ring-2 focus-visible:ring-accent-blue/20 focus-visible:border-accent-blue rounded-lg shadow-sm transition-all duration-200 px-3 py-3 text-sm"
                rows={1}
              />
              <div className="absolute bottom-2 right-2 sm:bottom-2.5 sm:right-3 text-xs text-text-tertiary pointer-events-none">
                <span className="hidden sm:inline font-medium tracking-wide">
                  <kbd className="px-1.5 py-0.5 text-xs bg-bg-base border border-border-line rounded">⏎</kbd> Send · 
                  <kbd className="px-1.5 py-0.5 text-xs bg-bg-base border border-border-line rounded ml-1">⇧⏎</kbd> New line
                </span>
                <span className="sm:hidden font-medium">Tap to send</span>
              </div>
            </div>

            {/* Send button */}
            <Button
              type="submit"
              disabled={disabled || !message.trim()}
              size="icon"
              className="flex-shrink-0 h-10 w-10 bg-accent-blue hover:bg-accent-blue-subtle text-white disabled:bg-bg-base disabled:text-text-secondary rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:shadow-sm"
            >
              {disabled ? (
                <div className="w-4 h-4 border-2 border-text-secondary/20 border-t-text-secondary/60 rounded-full animate-spin"></div>
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
        </Card>

        {/* Help text */}
        <div className="mt-2 text-xs text-text-tertiary font-medium text-center">
          CERANOS can make mistakes. Consider checking important information.
        </div>
      </div>
    </div>
  );
};