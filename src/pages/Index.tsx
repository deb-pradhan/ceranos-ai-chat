import React, { useState } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppSidebar } from '@/components/sidebar/AppSidebar';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

const Index = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSelectChat = (chatId: string | null) => {
    console.log('Selecting chat:', chatId);
    setSelectedChatId(chatId);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const handleNewChat = () => {
    setSelectedChatId(null);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen w-full bg-background">
        {/* Mobile Layout with Drawer */}
        {isMobile ? (
          <div className="flex flex-col h-screen">
            <Drawer open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <DrawerTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm border shadow-lg"
                  onClick={toggleSidebar}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="h-[85vh]">
                <div className="h-full overflow-hidden">
                  <AppSidebar 
                    selectedChatId={selectedChatId}
                    onSelectChat={handleSelectChat}
                    isMobile={true}
                  />
                </div>
              </DrawerContent>
            </Drawer>
            
            <div className="flex-1 overflow-hidden">
              <ChatInterface 
                selectedChatId={selectedChatId}
                onNewChat={handleNewChat}
                onToggleSidebar={toggleSidebar}
                isSidebarOpen={isSidebarOpen}
              />
            </div>
          </div>
        ) : (
          /* Desktop Layout with Resizable Panels */
          <SidebarProvider>
            <ResizablePanelGroup direction="horizontal" className="h-screen">
              <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                <AppSidebar 
                  selectedChatId={selectedChatId}
                  onSelectChat={handleSelectChat}
                  isMobile={false}
                />
              </ResizablePanel>
              
              <ResizableHandle className="w-2 bg-border hover:bg-accent-primary/20 transition-colors" />
              
              <ResizablePanel defaultSize={80}>
                <ChatInterface 
                  selectedChatId={selectedChatId}
                  onNewChat={handleNewChat}
                  onToggleSidebar={toggleSidebar}
                  isSidebarOpen={isSidebarOpen}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </SidebarProvider>
        )}
      </div>
    </AuthProvider>
  );
};

export default Index;
