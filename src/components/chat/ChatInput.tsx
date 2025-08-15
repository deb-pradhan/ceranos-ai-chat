import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

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
      <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5">
        <form onSubmit={handleSubmit} className="flex items-end gap-2 sm:gap-3">
          {/* Attachment button (future) */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleAttachments}
            disabled={disabled}
            className="flex-shrink-0 text-text-secondary hover:text-text-primary hover:bg-bg-panel rounded-xl transition-all duration-200"
          >
            <Plus className="icon-md" />
          </Button>

          {/* Message input */}
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask CERANOS about the markets..."
              disabled={disabled}
              className="min-h-[44px] sm:min-h-[52px] max-h-24 sm:max-h-28 resize-none border-border-line bg-bg-panel text-text-primary placeholder:text-text-secondary focus-visible:ring-2 focus-visible:ring-focus-ring/20 focus-visible:border-accent-blue rounded-xl shadow-sm transition-all duration-200 px-3 sm:px-4 py-3 text-sm sm:text-base"
              rows={1}
            />
            <div className="absolute bottom-2.5 sm:bottom-3 right-3 sm:right-4 text-xs text-text-tertiary pointer-events-none">
              <span className="hidden sm:inline font-semibold tracking-wide">
                <span className="inline-block mr-1">⏎</span>Send · <span className="inline-block mr-1">⇧⏎</span>New line
              </span>
              <span className="sm:hidden font-semibold tracking-wide">Tap to send</span>
            </div>
          </div>

          {/* Send button */}
          <Button
            type="submit"
            disabled={disabled || !message.trim()}
            size="icon"
            className="flex-shrink-0 bg-accent-blue hover:bg-accent-blue-subtle text-white disabled:bg-bg-panel disabled:text-text-secondary rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
          >
            {disabled ? (
              <div className="icon-sm border-2 border-text-secondary/20 border-t-text-secondary/60 rounded-full animate-spin"></div>
            ) : (
              <Send className="icon-md" />
            )}
          </Button>
        </form>

        {/* Help text */}
        <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-text-tertiary font-semibold tracking-wide">
          CERANOS can make mistakes. Consider checking important information.
        </div>
      </div>
    </div>
  );
};