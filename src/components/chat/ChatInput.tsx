import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}
export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false
}) => {
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
  return <div className="border-t border-border-line bg-bg-base z-10 shadow-lg">
      <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        <form onSubmit={handleSubmit} className="flex items-end gap-2 sm:gap-3">
          {/* Attachment button (future) */}
          

          {/* Message input */}
          <div className="flex-1 relative">
            <Textarea ref={textareaRef} value={message} onChange={e => setMessage(e.target.value)} onKeyDown={handleKeyDown} placeholder="Ask Ceranos....." disabled={disabled} className="min-h-[52px] sm:min-h-[48px] max-h-28 sm:max-h-24 resize-none border-border-line bg-bg-base text-text-primary placeholder:text-text-secondary focus-visible:ring-focus-ring pr-12 sm:pr-4 text-base sm:text-sm" rows={1} />
            <div className="absolute bottom-2 right-2 text-xs sm:text-xs text-text-secondary pointer-events-none">
              <span className="hidden sm:inline">
                <span className="inline-block mr-1">⏎</span>Send · <span className="inline-block mr-1">⇧⏎</span>New line
              </span>
              <span className="sm:hidden">Tap to send</span>
            </div>
          </div>

          {/* Send button */}
          <Button type="submit" disabled={disabled || !message.trim()} className="flex-shrink-0 h-12 w-12 sm:h-11 sm:w-11 bg-accent-blue hover:bg-accent-blue/90 text-white disabled:bg-bg-panel disabled:text-text-secondary">
            {disabled ? <div className="w-5 h-5 sm:w-4 sm:h-4 border-2 border-text-secondary/20 border-t-text-secondary/60 rounded-full animate-spin"></div> : <Send className="w-5 h-5 sm:w-4 sm:h-4" />}
          </Button>
        </form>

        {/* Help text */}
        <div className="mt-2 text-xs sm:text-xs text-text-secondary">
          CERANOS can make mistakes. Consider checking important information.
        </div>
      </div>
    </div>;
};