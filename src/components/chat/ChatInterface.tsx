import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { InstructionCard } from './InstructionCard';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { TopBar } from './TopBar';
import { useChatHistory } from '@/hooks/useChatHistory';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

interface ChatInterfaceProps {
  selectedChatId: string | null;
  onNewChat: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  selectedChatId, 
  onNewChat 
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [streamingContent, setStreamingContent] = useState('');
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

  const simulateAssistantResponse = (userMessage: string): string => {
    const responses = {
      'btc': 'Bitcoin is currently showing strong momentum with institutional support continuing to grow. Current price action suggests consolidation above key support levels.',
      'eth': 'Ethereum is benefiting from increased DeFi activity and upcoming network upgrades. Layer 2 adoption continues to accelerate.',
      'market': 'The crypto market is experiencing mixed sentiment. Bitcoin dominance is holding steady while altcoins show selective strength.',
      'default': `I understand you're asking about "${userMessage}". As an AI focused on crypto markets, I can help analyze trends, sentiment, and key metrics. However, please note this is a demo response. In a production environment, I would provide real-time market analysis based on current data.`
    };

    const message = userMessage.toLowerCase();
    if (message.includes('btc') || message.includes('bitcoin')) return responses.btc;
    if (message.includes('eth') || message.includes('ethereum')) return responses.eth;
    if (message.includes('market') || message.includes('trend')) return responses.market;
    return responses.default;
  };

  const handleSendMessage = async (content: string) => {
    if (!user || !content.trim()) return;

    console.log('Sending message:', content);
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

      // Simulate streaming response
      const assistantResponse = simulateAssistantResponse(content);
      setStreamingContent('');
      
      // Simulate typing effect
      for (let i = 0; i <= assistantResponse.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 20));
        setStreamingContent(assistantResponse.substring(0, i));
      }

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
      <TopBar />
      
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
        />
        
        <div ref={messagesEndRef} />
      </div>

      <ChatInput 
        onSendMessage={handleSendMessage}
        disabled={isLoading}
      />
    </div>
  );
};