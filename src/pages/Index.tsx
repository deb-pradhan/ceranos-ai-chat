import React, { useState } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppSidebar } from '@/components/sidebar/AppSidebar';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSelectChat = (chatId: string | null) => {
    console.log('Selecting chat:', chatId);
    setSelectedChatId(chatId);
    // Close sidebar on mobile after selecting chat
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const handleNewChat = () => {
    setSelectedChatId(null);
    // Close sidebar on mobile after starting new chat
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <AuthProvider>
      <div className="h-screen flex bg-bg-base relative">
        {/* Mobile overlay */}
        {isMobile && isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div className={`
          ${isMobile 
            ? `fixed left-0 top-0 h-full z-50 transform transition-transform duration-300 ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`
            : 'relative'
          }
        `}>
          <AppSidebar 
            selectedChatId={selectedChatId}
            onSelectChat={handleSelectChat}
            isMobile={isMobile}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ChatInterface 
            selectedChatId={selectedChatId}
            onNewChat={handleNewChat}
            onToggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
          />
        </div>
      </div>
    </AuthProvider>
  );
};

export default Index;
