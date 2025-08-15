import React, { useState } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppSidebar } from '@/components/sidebar/AppSidebar';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Sheet, SheetContent } from '@/components/ui/sheet';

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
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-bg-base">
          {/* Desktop Sidebar */}
          {!isMobile && (
            <AppSidebar 
              selectedChatId={selectedChatId}
              onSelectChat={handleSelectChat}
              isMobile={false}
            />
          )}

          {/* Mobile Sidebar Sheet */}
          {isMobile && (
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetContent side="left" className="p-0 w-80 bg-bg-panel border-border-line">
                <AppSidebar 
                  selectedChatId={selectedChatId}
                  onSelectChat={handleSelectChat}
                  isMobile={true}
                />
              </SheetContent>
            </Sheet>
          )}

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
      </SidebarProvider>
    </AuthProvider>
  );
};

export default Index;
