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
  ui_spec?: any;
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
  const [streamingUISpec, setStreamingUISpec] = useState<any>(null);
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
  ): Promise<{ text: string; uiSpec?: any }> => {
    try {
      const { streamC1Response } = await import('@/utils/streamingUtils');
      
      let fullText = '';
      let uiSpec: any = null;

      await streamC1Response(conversationMessages, (chunk) => {
        if (chunk.type === 'text' && chunk.content) {
          fullText += chunk.content;
          onChunk(chunk.content);
        } else if (chunk.type === 'ui' && chunk.uiSpec) {
          uiSpec = chunk.uiSpec;
          setStreamingUISpec(chunk.uiSpec);
        } else if (chunk.type === 'error') {
          throw new Error(chunk.error || 'Stream error');
        }
      });

      return { text: fullText, uiSpec };
    } catch (error) {
      console.error('Error streaming response:', error);
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
      const { text: fullText, uiSpec } = await streamAssistantResponse(
        conversationMessages,
        (chunk) => {
          streamedText += chunk;
          setStreamingContent(streamedText);
          setLoadingPhase('typing');
        }
      );

      setLoadingPhase(null);

      // Add complete assistant message with UI spec if available
      const assistantMessage = await addMessage(currentChatId, 'assistant', fullText, uiSpec);
      setMessages(prev => [...prev, assistantMessage]);
      setStreamingContent('');
      setStreamingUISpec(null);

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
    <div className="flex flex-col h-full bg-bg-base">
      <TopBar onToggleSidebar={onToggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {showInstructions && (
          <InstructionCard 
            onDismiss={() => setShowInstructions(false)}
            onExampleClick={handleSendMessage}
          />
        )}
        
        <MessageList 
          messages={messages}
          streamingContent={streamingContent}
          streamingUISpec={streamingUISpec}
          onRegenerateResponse={handleRegenerateResponse}
          isLoading={isLoading}
          loadingPhase={loadingPhase}
        />
        
        <div ref={messagesEndRef} />
      </div>

      <ChatInput 
        onSendMessage={handleSendMessage}
        disabled={isLoading}
      />

      <LoginPopup 
        open={showLoginPopup}
        onOpenChange={setShowLoginPopup}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
};