import React, { useState } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { AppSidebar } from '@/components/sidebar/AppSidebar';
import { ChatInterface } from '@/components/chat/ChatInterface';

const Index = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const handleSelectChat = (chatId: string | null) => {
    console.log('Selecting chat:', chatId);
    setSelectedChatId(chatId);
  };

  const handleNewChat = () => {
    setSelectedChatId(null);
  };

  return (
    <AuthProvider>
      <AuthGuard>
        <div className="h-screen flex bg-bg-base">
          <AppSidebar 
            selectedChatId={selectedChatId}
            onSelectChat={handleSelectChat}
          />
          <div className="flex-1 flex flex-col overflow-hidden">
            <ChatInterface 
              selectedChatId={selectedChatId}
              onNewChat={handleNewChat}
            />
          </div>
        </div>
      </AuthGuard>
    </AuthProvider>
  );
};

export default Index;
