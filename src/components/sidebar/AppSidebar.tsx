import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChatHistory } from '@/hooks/useChatHistory';
import { FileText, LogOut, MessageSquare, Plus, MoreHorizontal, Trash2, Edit3, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LoginPopup } from '@/components/auth/LoginPopup';
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

  const handleNewChat = () => {
    onSelectChat(null);
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      await signOut();
    }
  };

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this conversation?')) {
      const success = await deleteChat(chatId);
      if (success && selectedChatId === chatId) {
        onSelectChat(null);
      }
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

  return (
    <div className={`${isMobile ? 'w-64 max-w-[85vw]' : 'w-80 lg:w-[320px]'} h-full bg-bg-panel border-r border-border-line flex flex-col`}>
      {/* Header */}
      <div className="h-12 sm:h-14 px-3 sm:px-4 lg:px-6 flex items-center border-b border-border-line">
        <h1 className="text-base sm:text-lg lg:text-xl font-brand text-text-primary tracking-tight">CERANOS</h1>
      </div>

      {/* New Chat Button */}
      <div className="p-2 sm:p-3 lg:p-4">
        <Button
          onClick={handleNewChat}
          className="w-full bg-accent-blue hover:bg-accent-blue/90 text-white touch-target"
          size={isMobile ? "sm" : "lg"}
        >
          <Plus className="icon-sm mr-1.5 sm:mr-2 flex-shrink-0" />
          <span className="text-sm font-medium truncate">New Chat</span>
        </Button>
      </div>

      {/* Navigation Links */}
      <div className="px-2 sm:px-3 lg:px-4 space-y-1">
        <Button
          variant="ghost"
          className="w-full justify-start text-text-secondary hover:text-text-primary hover:bg-bg-base touch-target"
        >
          <FileText className="icon-sm mr-2 flex-shrink-0" />
          <span className="text-sm truncate">Documentation</span>
        </Button>
      </div>

      {/* Chat History */}
      <div className="flex-1 px-2 sm:px-3 lg:px-4 mt-3 sm:mt-4 lg:mt-6">
        <h3 className="text-xs font-semibold text-text-secondary mb-2 sm:mb-3 tracking-wide uppercase">Recent Chats</h3>
        <ScrollArea className="h-full">
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-bg-base/50 animate-pulse" />
              ))}
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center py-6 sm:py-8 text-text-secondary">
              <MessageSquare className="icon-lg mx-auto mb-3 opacity-50" />
              <p className="text-sm sm:text-base font-medium">No conversations yet</p>
              <p className="text-xs sm:text-sm mt-1">Start a new chat to begin</p>
            </div>
          ) : (
            <div className="space-y-1">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`group relative flex items-center p-2 sm:p-2.5 lg:p-3 cursor-pointer transition-all duration-200 hover:bg-bg-base rounded-lg touch-target-sm ${
                    selectedChatId === chat.id 
                      ? 'bg-bg-base border-l-2 border-l-accent-blue shadow-sm' 
                      : 'hover:shadow-sm'
                  }`}
                  onClick={() => onSelectChat(chat.id)}
                >
                  <div className="flex-1 min-w-0">
                    {editingChatId === chat.id ? (
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={handleSaveTitle}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveTitle();
                          if (e.key === 'Escape') setEditingChatId(null);
                        }}
                        className="w-full bg-transparent text-sm text-text-primary border-none outline-none"
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
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 text-text-secondary hover:text-text-primary rounded-md"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="icon-sm" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => handleEditTitle(chat.id, chat.title, e)}>
                        <Edit3 className="icon-sm mr-2" />
                        <span className="text-sm">Rename</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => handleDeleteChat(chat.id, e)}
                        className="text-state-negative"
                      >
                        <Trash2 className="icon-sm mr-2" />
                        <span className="text-sm">Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Authentication Section */}
      <div className="p-2 sm:p-3 lg:p-4 border-t border-border-line mt-auto">
        {user ? (
          // Authenticated user
          <>
            <div className="mb-2 sm:mb-3">
              <p className="text-xs text-text-secondary font-medium line-clamp-1 break-all">
                {user.email}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full border-border-line text-text-secondary hover:text-text-primary hover:bg-bg-base touch-target"
            >
              <LogOut className="icon-sm mr-1.5 flex-shrink-0" />
              <span className="text-sm truncate">Sign Out</span>
            </Button>
          </>
        ) : (
          // Not authenticated
          <>
            <div className="mb-2 sm:mb-3">
              <p className="text-xs text-text-secondary font-medium leading-relaxed">
                Sign in to save conversations
              </p>
            </div>
            <Button
              onClick={() => setShowLoginPopup(true)}
              className="w-full bg-accent-blue hover:bg-accent-blue/90 text-white touch-target"
            >
              <LogIn className="icon-sm mr-1.5 flex-shrink-0" />
              <span className="text-sm truncate">Sign In</span>
            </Button>
          </>
        )}
      </div>

      {/* Login Popup */}
      <LoginPopup 
        open={showLoginPopup} 
        onOpenChange={setShowLoginPopup}
        onSuccess={() => setShowLoginPopup(false)}
      />
    </div>
  );
};