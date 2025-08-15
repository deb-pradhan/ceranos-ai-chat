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
    <div className="border-t border-border-line/50 glass-subtle p-6 lg:p-8">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="flex items-end space-x-4">
          <div className="flex-1 relative group">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask CERANOS about the markets..."
              disabled={disabled}
              className="min-h-[52px] max-h-32 py-4 px-5 text-base resize-none border-border-subtle/60 glass-effect rounded-2xl focus:border-accent-blue/80 focus:ring-accent-blue/20 focus:ring-2 transition-all duration-300 placeholder:text-text-tertiary group-hover:shadow-md"
              rows={1}
            />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-accent-blue/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleAttachments}
              className="h-14 w-14 rounded-2xl hover:scale-105 transition-transform duration-200"
              disabled={disabled}
            >
              <Plus className="w-5 h-5" />
            </Button>
            
            <Button
              type="submit"
              disabled={disabled || !message.trim()}
              className="h-14 w-14 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              size="icon"
            >
              {disabled ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-5 text-xs">
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-2 text-hierarchy-tertiary">
              <kbd className="px-2.5 py-1.5 glass-effect border border-border-subtle/50 rounded-lg text-xs font-mono font-medium">
                ⏎
              </kbd>
              <span className="font-medium">Send</span>
            </span>
            <span className="flex items-center space-x-2 text-hierarchy-tertiary">
              <kbd className="px-2.5 py-1.5 glass-effect border border-border-subtle/50 rounded-lg text-xs font-mono font-medium">
                Esc
              </kbd>
              <span className="font-medium">Clear</span>
            </span>
          </div>
          
          <p className="text-hierarchy-caption font-medium">
            AI can make mistakes. Check important info.
          </p>
        </div>
      </form>
    </div>
  );
};