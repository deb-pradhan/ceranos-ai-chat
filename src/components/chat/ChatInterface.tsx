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

  const getAssistantResponse = async (userMessage: string): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke('chat-webhook', {
        body: { message: userMessage }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error('Failed to get AI response');
      }

      if (!data.success) {
        throw new Error(data.error || 'Webhook request failed');
      }

      return data.response;
    } catch (error) {
      console.error('Error calling webhook:', error);
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

      // Start loading phases while waiting for webhook
      setLoadingPhase('thinking');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setLoadingPhase('analyzing');

      // Get real AI response from webhook
      const assistantResponse = await getAssistantResponse(content);
      
      // Switch to typing phase when we have the response
      setLoadingPhase('typing');
      setStreamingContent('');
      
      // Simulate typing effect with faster animation
      for (let i = 0; i <= assistantResponse.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 8)); // Faster typing (was 20ms)
        setStreamingContent(assistantResponse.substring(0, i));
      }

      setLoadingPhase(null);

      // Add complete assistant message
      const assistantMessage = await addMessage(currentChatId, 'assistant', assistantResponse);
      setMessages(prev => [...prev, assistantMessage]);
      setStreamingContent('');

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
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