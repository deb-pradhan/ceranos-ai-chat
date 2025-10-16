import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { InstructionCard } from './InstructionCard';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { TopBar } from './TopBar';
import { LoginPopup } from '@/components/auth/LoginPopup';
import { useChatHistory } from '@/hooks/useChatHistory';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

interface ChatInterfaceProps {
  selectedChatId: string | null;
  onNewChat: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  selectedChatId, 
  onNewChat,
  onToggleSidebar,
  isSidebarOpen
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [streamingContent, setStreamingContent] = useState('');
  const [loadingPhase, setLoadingPhase] = useState<'thinking' | 'searching' | 'analyzing' | 'typing' | null>(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { createChat, addMessage, loadChatMessages } = useChatHistory();

  console.log('ChatInterface render: selectedChatId =', selectedChatId);

  useEffect(() => {
    if (selectedChatId) {
      console.log('Loading messages for chat:', selectedChatId);
      loadMessages(selectedChatId);
      setShowInstructions(false);
    } else {
      console.log('No chat selected, showing instructions');
      setMessages([]);
      setShowInstructions(true);
    }
  }, [selectedChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  const loadMessages = async (chatId: string) => {
    try {
      const chatMessages = await loadChatMessages(chatId);
      setMessages(chatMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error",
        description: "Failed to load chat messages",
        variant: "destructive"
      });
    }
  };

  const streamAssistantResponse = async (
    conversationMessages: Array<{ role: string; content: string }>,
    onChunk: (text: string) => void
  ): Promise<{ text: string }> => {
    try {
      console.log('[ChatInterface] Starting stream with', conversationMessages.length, 'messages');
      
      const { streamC1Response } = await import('@/utils/streamingUtils');
      
      let fullText = '';

      await streamC1Response(conversationMessages, (chunk) => {
        if (chunk.type === 'text' && chunk.content) {
          fullText += chunk.content;
          onChunk(chunk.content);
          
          // Log periodically (every 100 chars) to avoid console spam
          if (fullText.length % 100 < chunk.content.length) {
            console.log('[ChatInterface] Accumulated', fullText.length, 'chars');
          }
        } else if (chunk.type === 'error') {
          console.error('[ChatInterface] Stream error:', chunk.error);
          throw new Error(chunk.error || 'Stream error');
        }
      });

      console.log('[ChatInterface] Stream complete. Total length:', fullText.length);
      console.log('[ChatInterface] Content preview:', fullText.substring(0, 200));
      console.log('[ChatInterface] Looks like JSON?:', fullText.trim().startsWith('{') || fullText.trim().startsWith('['));

      return { text: fullText };
    } catch (error) {
      console.error('[ChatInterface] Stream error:', error);
      throw error;
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Check if user is authenticated
    if (!user) {
      setPendingMessage(content);
      setShowLoginPopup(true);
      return;
    }

    await processSendMessage(content);
  };

  const processSendMessage = async (content: string) => {
    console.log('Processing message:', content);
    setIsLoading(true);
    setShowInstructions(false);

    try {
      let currentChatId = selectedChatId;

      // Create new chat if none selected
      if (!currentChatId) {
        console.log('Creating new chat');
        const title = content.substring(0, 60) + (content.length > 60 ? '...' : '');
        currentChatId = await createChat(title);
        onNewChat(); // Refresh chat history
      }

      if (!currentChatId) {
        throw new Error('Failed to create or select chat');
      }

      // Add user message
      const userMessage = await addMessage(currentChatId, 'user', content);
      setMessages(prev => [...prev, userMessage]);

      // Build conversation history with system prompt
      const conversationMessages = [
        { 
          role: 'system', 
          content: 'You are a helpful AI assistant. Provide clear, concise, and accurate responses.' 
        },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: 'user', content }
      ];

      // Start streaming response
      setLoadingPhase('thinking');
      setStreamingContent('');
      
      let streamedText = '';
      const { text: fullText } = await streamAssistantResponse(
        conversationMessages,
        (chunk) => {
          streamedText += chunk;
          setStreamingContent(streamedText);
          setLoadingPhase('typing');
        }
      );

      setLoadingPhase(null);

      // Add complete assistant message
      console.log('[ChatInterface] Saving assistant message...');
      const assistantMessage = await addMessage(currentChatId, 'assistant', fullText);
      console.log('[ChatInterface] Saved message:', assistantMessage.id);
      setMessages(prev => [...prev, assistantMessage]);
      setStreamingContent('');

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Provide more specific error messages to users
      let errorDescription = "Failed to send message. Please try again.";
      
      if (error instanceof Error) {
        const errorMsg = error.message.toLowerCase();
        if (errorMsg.includes('api key') || errorMsg.includes('401')) {
          errorDescription = "API authentication failed. Please contact support.";
        } else if (errorMsg.includes('rate limit') || errorMsg.includes('429')) {
          errorDescription = "Too many requests. Please wait a moment and try again.";
        } else if (errorMsg.includes('server error') || errorMsg.includes('500')) {
          errorDescription = "Service temporarily unavailable. Please try again in a moment.";
        } else if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
          errorDescription = "Network error. Please check your connection and try again.";
        } else if (error.message && error.message.length < 100) {
          errorDescription = error.message;
        }
      }
      
      toast({
        title: "Error",
        description: errorDescription,
        variant: "destructive"
      });
      
      setStreamingContent('');
    } finally {
      setIsLoading(false);
      setLoadingPhase(null);
    }
  };

  const handleLoginSuccess = () => {
    if (pendingMessage) {
      processSendMessage(pendingMessage);
      setPendingMessage(null);
    }
  };

  const handleRegenerateResponse = async () => {
    if (messages.length < 2) return;
    
    const lastUserMessage = messages[messages.length - 2];
    if (lastUserMessage.role !== 'user') return;

    console.log('Regenerating response for:', lastUserMessage.content);
    
    // Remove last assistant message
    setMessages(prev => prev.slice(0, -1));
    
    // Regenerate response
    await handleSendMessage(lastUserMessage.content);
  };

  return (
    <div className="relative flex flex-col h-full bg-bg-base">
      <TopBar onToggleSidebar={onToggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-y-auto pb-32">
        {showInstructions && (
          <InstructionCard 
            onDismiss={() => setShowInstructions(false)}
            onExampleClick={handleSendMessage}
          />
        )}
        
        <MessageList 
          messages={messages}
          streamingContent={streamingContent}
          onRegenerateResponse={handleRegenerateResponse}
          isLoading={isLoading}
          loadingPhase={loadingPhase}
        />
        
        <div ref={messagesEndRef} />
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10">
        <ChatInput 
          onSendMessage={handleSendMessage}
          disabled={isLoading}
        />
      </div>

      <LoginPopup 
        open={showLoginPopup}
        onOpenChange={setShowLoginPopup}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
};