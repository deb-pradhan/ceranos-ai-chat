import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChatHistory } from '@/hooks/useChatHistory';
import { FileText, LogOut, MessageSquare, Plus, MoreHorizontal, Trash2, Edit3, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LoginPopup } from '@/components/auth/LoginPopup';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AppSidebarProps {
  selectedChatId: string | null;
  onSelectChat: (chatId: string | null) => void;
  isMobile?: boolean;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ selectedChatId, onSelectChat, isMobile = false }) => {
  const { user, signOut } = useAuth();
  const { chats, loading, deleteChat, updateChatTitle } = useChatHistory();
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [deleteDialogChatId, setDeleteDialogChatId] = useState<string | null>(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleNewChat = () => {
    onSelectChat(null);
  };

  const handleLogout = async () => {
    await signOut();
    setLogoutDialogOpen(false);
  };

  const handleDeleteChat = async () => {
    if (deleteDialogChatId) {
      const success = await deleteChat(deleteDialogChatId);
      if (success && selectedChatId === deleteDialogChatId) {
        onSelectChat(null);
      }
      setDeleteDialogChatId(null);
    }
  };

  const handleEditTitle = (chatId: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingChatId(chatId);
    setEditTitle(currentTitle);
  };

  const handleSaveTitle = async () => {
    if (editingChatId && editTitle.trim()) {
      await updateChatTitle(editingChatId, editTitle.trim());
    }
    setEditingChatId(null);
    setEditTitle('');
  };

  if (isMobile) {
    // Mobile version - simplified layout without Sidebar component
    return (
      <div className="w-full h-full bg-bg-panel border-r border-border-line flex flex-col">
        {/* Header */}
        <div className="h-14 px-4 flex items-center border-b border-border-line">
          <h1 className="text-lg font-brand text-text-primary tracking-tight">CERANOS</h1>
        </div>
        
        {/* New Chat Button */}
        <div className="p-3">
          <Button
            onClick={handleNewChat}
            className="w-full bg-accent-blue hover:bg-accent-blue/90 text-white"
            size="lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span>New Chat</span>
          </Button>
        </div>

        <Separator className="bg-border-line" />

        {/* Chat History */}
        <div className="flex-1 px-3 mt-4">
          <h3 className="text-xs font-semibold text-text-secondary mb-3 tracking-wide uppercase">Recent Chats</h3>
          <ScrollArea className="h-full">
            {loading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-bg-base/50 animate-pulse rounded-lg" />
                ))}
              </div>
            ) : chats.length === 0 ? (
              <div className="text-center py-8 text-text-secondary">
                <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p className="text-sm font-medium">No conversations yet</p>
                <p className="text-xs mt-1">Start a new chat to begin</p>
              </div>
            ) : (
              <div className="space-y-1">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`group relative flex items-center p-3 cursor-pointer transition-all duration-200 hover:bg-bg-base rounded-lg ${
                      selectedChatId === chat.id 
                        ? 'bg-bg-base border-l-2 border-l-accent-blue shadow-sm' 
                        : 'hover:shadow-sm'
                    }`}
                    onClick={() => onSelectChat(chat.id)}
                  >
                    <div className="flex-1 min-w-0">
                      {editingChatId === chat.id ? (
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onBlur={handleSaveTitle}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveTitle();
                            if (e.key === 'Escape') setEditingChatId(null);
                          }}
                          className="w-full bg-transparent text-sm border-none p-0 h-auto focus-visible:ring-0"
                          autoFocus
                        />
                      ) : (
                        <p className="text-sm text-text-primary font-medium leading-tight line-clamp-2 break-words">
                          {chat.title}
                        </p>
                      )}
                      <p className="text-xs text-text-secondary mt-1 font-medium">
                        {new Date(chat.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 text-text-secondary hover:text-text-primary"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => handleEditTitle(chat.id, chat.title, e)}>
                          <Edit3 className="w-4 h-4 mr-2" />
                          <span>Rename</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteDialogChatId(chat.id);
                          }}
                          className="text-state-negative"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        <Separator className="bg-border-line" />

        {/* Authentication Section */}
        <div className="p-3 mt-auto">
          {user ? (
            <>
              <div className="mb-3 p-2 bg-bg-base rounded-lg">
                <p className="text-xs text-text-secondary font-medium line-clamp-1 break-all">
                  {user.email}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setLogoutDialogOpen(true)}
                className="w-full border-border-line text-text-secondary hover:text-text-primary hover:bg-bg-base"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span>Sign Out</span>
              </Button>
            </>
          ) : (
            <>
              <div className="mb-3">
                <p className="text-xs text-text-secondary font-medium leading-relaxed">
                  Sign in to save conversations
                </p>
              </div>
              <Button
                onClick={() => setShowLoginPopup(true)}
                className="w-full bg-accent-blue hover:bg-accent-blue/90 text-white"
              >
                <LogIn className="w-4 h-4 mr-2" />
                <span>Sign In</span>
              </Button>
            </>
          )}
        </div>

        {/* Dialogs */}
        <LoginPopup 
          open={showLoginPopup} 
          onOpenChange={setShowLoginPopup}
          onSuccess={() => setShowLoginPopup(false)}
        />

        <AlertDialog open={!!deleteDialogChatId} onOpenChange={() => setDeleteDialogChatId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your conversation.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteChat} className="bg-state-negative hover:bg-state-negative/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sign Out</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to sign out? Your conversations will be saved for when you return.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>Sign Out</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  return (
    <Sidebar className="border-border-line">
      <SidebarHeader className="border-b border-border-line">
        <div className="px-2 py-2">
          <h1 className="text-xl font-brand text-text-primary tracking-tight">CERANOS</h1>
          {user && <Badge variant="secondary" className="mt-1 text-xs">Pro</Badge>}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* New Chat Button */}
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="p-2">
              <Button
                onClick={handleNewChat}
                className="w-full bg-accent-blue hover:bg-accent-blue/90 text-white"
                size="lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span>New Chat</span>
              </Button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="bg-border-line" />

        {/* Navigation Links */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-text-secondary hover:text-text-primary hover:bg-bg-base">
                  <FileText className="w-4 h-4" />
                  <span>Documentation</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Chat History */}
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel className="text-xs font-semibold text-text-secondary tracking-wide uppercase">
            Recent Chats
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <ScrollArea className="h-full">
              {loading ? (
                <div className="space-y-2 p-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-12 bg-bg-base/50 animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : chats.length === 0 ? (
                <div className="text-center py-8 text-text-secondary px-2">
                  <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-50" />
                  <p className="text-sm font-medium">No conversations yet</p>
                  <p className="text-xs mt-1">Start a new chat to begin</p>
                </div>
              ) : (
                <SidebarMenu>
                  {chats.map((chat) => (
                    <SidebarMenuItem key={chat.id}>
                      <SidebarMenuButton
                        isActive={selectedChatId === chat.id}
                        onClick={() => onSelectChat(chat.id)}
                        className={`group relative flex items-center p-3 transition-all duration-200 hover:bg-bg-base rounded-lg ${
                          selectedChatId === chat.id 
                            ? 'bg-bg-base border-l-2 border-l-accent-blue shadow-sm' 
                            : 'hover:shadow-sm'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          {editingChatId === chat.id ? (
                            <Input
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onBlur={handleSaveTitle}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveTitle();
                                if (e.key === 'Escape') setEditingChatId(null);
                              }}
                              className="w-full bg-transparent text-sm border-none p-0 h-auto focus-visible:ring-0"
                              autoFocus
                            />
                          ) : (
                            <div>
                              <p className="text-sm text-text-primary font-medium leading-tight line-clamp-2 break-words">
                                {chat.title}
                              </p>
                              <p className="text-xs text-text-secondary mt-1 font-medium">
                                {new Date(chat.updated_at).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 text-text-secondary hover:text-text-primary"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => handleEditTitle(chat.id, chat.title, e)}>
                              <Edit3 className="w-4 h-4 mr-2" />
                              <span>Rename</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteDialogChatId(chat.id);
                              }}
                              className="text-state-negative"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              )}
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border-line">
        {user ? (
          <>
            <div className="mb-3 p-2 bg-bg-base rounded-lg">
              <p className="text-xs text-text-secondary font-medium line-clamp-1 break-all">
                {user.email}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setLogoutDialogOpen(true)}
              className="w-full border-border-line text-text-secondary hover:text-text-primary hover:bg-bg-base"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span>Sign Out</span>
            </Button>
          </>
        ) : (
          <>
            <div className="mb-3">
              <p className="text-xs text-text-secondary font-medium leading-relaxed">
                Sign in to save conversations
              </p>
            </div>
            <Button
              onClick={() => setShowLoginPopup(true)}
              className="w-full bg-accent-blue hover:bg-accent-blue/90 text-white"
            >
              <LogIn className="w-4 h-4 mr-2" />
              <span>Sign In</span>
            </Button>
          </>
        )}
      </SidebarFooter>

      {/* Dialogs */}
      <LoginPopup 
        open={showLoginPopup} 
        onOpenChange={setShowLoginPopup}
        onSuccess={() => setShowLoginPopup(false)}
      />

      <AlertDialog open={!!deleteDialogChatId} onOpenChange={() => setDeleteDialogChatId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your conversation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteChat} className="bg-state-negative hover:bg-state-negative/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign Out</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out? Your conversations will be saved for when you return.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Sign Out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sidebar>
  );
};