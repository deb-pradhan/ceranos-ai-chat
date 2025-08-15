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
    <div className={`${isMobile ? 'w-84' : 'w-84'} h-full glass-effect border-r border-border-line/50 flex flex-col`}>
      {/* Header */}
      <div className={`h-18 ${isMobile ? 'px-5' : 'px-7'} flex items-center border-b border-border-line/50`}>
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-blue-subtle flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-200">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-brand text-hierarchy-primary tracking-tight`}>CERANOS</h1>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-5">
        <Button
          onClick={handleNewChat}
          className={`w-full h-12 bg-gradient-to-r from-accent-blue to-accent-blue-subtle hover:from-accent-blue-subtle hover:to-accent-blue text-white rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 space-x-3`}
        >
          <Plus className="w-5 h-5" />
          <span className="font-semibold">New Chat</span>
        </Button>
      </div>

      {/* Navigation Links */}
      <div className="px-5 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start glass-effect hover:bg-bg-elevated/60 rounded-2xl p-4 transition-all duration-200 hover:scale-[1.01]"
        >
          <FileText className="w-5 h-5 mr-3" />
          <span className="font-medium">Documentation</span>
        </Button>
      </div>

      {/* Chat History */}
      <div className={`flex-1 ${isMobile ? 'px-4' : 'px-5'} mt-6`}>
        <h3 className="text-sm font-semibold text-hierarchy-tertiary mb-4 px-4 uppercase tracking-wider">Recent Chats</h3>
        <ScrollArea className="h-full">
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 glass-effect animate-apple-pulse rounded-2xl" />
              ))}
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-bg-elevated/60 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-text-secondary/50" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-secondary">No conversations yet</p>
                <p className="text-xs text-text-tertiary">Start a new chat to begin</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {chats.map((chat, index) => (
                <div
                  key={chat.id}
                  className={`group relative flex items-center p-4 cursor-pointer transition-all duration-300 hover:scale-[1.01] rounded-2xl animate-fade-in-up ${
                    selectedChatId === chat.id 
                      ? 'bg-gradient-to-r from-accent-blue/20 to-accent-blue-subtle/20 text-accent-blue border border-accent-blue/30 shadow-md' 
                      : 'hover:bg-bg-elevated/60 glass-effect hover:shadow-md'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
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
                        className="w-full bg-transparent text-sm text-hierarchy-primary border-none outline-none font-semibold"
                        autoFocus
                      />
                    ) : (
                      <p className="text-sm font-semibold text-hierarchy-primary truncate leading-tight">
                        {chat.title}
                      </p>
                    )}
                    <p className="text-xs text-hierarchy-tertiary mt-1.5 font-medium">
                      {new Date(chat.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 text-text-secondary hover:text-text-primary rounded-lg transition-all duration-200 hover:scale-105"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass-effect border-border-subtle/50">
                      <DropdownMenuItem onClick={(e) => handleEditTitle(chat.id, chat.title, e)} className="hover:bg-bg-elevated/60">
                        <Edit3 className="w-4 h-4 mr-2" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => handleDeleteChat(chat.id, e)}
                        className="text-state-negative hover:bg-state-negative/10"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
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
      <div className={`${isMobile ? 'p-4' : 'p-5'} border-t border-border-line/50 mt-auto`}>
        {user ? (
          // Authenticated user
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 rounded-2xl glass-effect hover:bg-bg-elevated/60 transition-all duration-200">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-text-secondary to-text-tertiary flex items-center justify-center shadow-md">
                <LogIn className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-hierarchy-primary tracking-tight truncate">
                  {user.email}
                </p>
                <p className="text-xs text-hierarchy-tertiary font-medium">
                  Market Analyst
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className={`w-full h-11 border-border-subtle/60 hover:bg-bg-elevated/60 rounded-2xl transition-all duration-200 hover:scale-[1.01]`}
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="font-medium">Sign Out</span>
            </Button>
          </div>
        ) : (
          // Not authenticated
          <div className="space-y-4">
            <div className="p-4 rounded-2xl glass-effect">
              <p className="text-xs text-hierarchy-tertiary font-medium leading-relaxed">
                Sign in to save your conversations and access advanced features
              </p>
            </div>
            <Button
              onClick={() => setShowLoginPopup(true)}
              className={`w-full h-11 bg-gradient-to-r from-accent-blue to-accent-blue-subtle hover:from-accent-blue-subtle hover:to-accent-blue text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}
            >
              <LogIn className="w-4 h-4 mr-2" />
              <span className="font-semibold">Sign In</span>
            </Button>
          </div>
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