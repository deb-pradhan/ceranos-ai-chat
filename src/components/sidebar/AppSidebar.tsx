import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChatHistory } from '@/hooks/useChatHistory';
import { FileText, LogOut, MessageSquare, Plus, MoreHorizontal, Trash2, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AppSidebarProps {
  selectedChatId: string | null;
  onSelectChat: (chatId: string | null) => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ selectedChatId, onSelectChat }) => {
  const { user, signOut } = useAuth();
  const { chats, loading, deleteChat, updateChatTitle } = useChatHistory();
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

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
    <div className="w-80 h-full bg-bg-panel border-r border-border-line flex flex-col">
      {/* Header */}
      <div className="h-16 px-6 flex items-center border-b border-border-line">
        <h1 className="text-2xl font-brand text-text-primary">CERANOS</h1>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <Button
          onClick={handleNewChat}
          className="w-full bg-accent-blue hover:bg-accent-blue/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Navigation Links */}
      <div className="px-4 space-y-1">
        <Button
          variant="ghost"
          className="w-full justify-start text-text-secondary hover:text-text-primary hover:bg-bg-base"
        >
          <FileText className="w-4 h-4 mr-3" />
          Documentation
        </Button>
      </div>

      {/* Chat History */}
      <div className="flex-1 px-4 mt-6">
        <h3 className="text-sm font-medium text-text-secondary mb-3">Recent Chats</h3>
        <ScrollArea className="h-full">
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-bg-base/50 animate-pulse" />
              ))}
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center py-8 text-text-secondary">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No conversations yet</p>
              <p className="text-xs">Start a new chat to begin</p>
            </div>
          ) : (
            <div className="space-y-1">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`group relative flex items-center p-3 cursor-pointer transition-smooth hover:bg-bg-base ${
                    selectedChatId === chat.id 
                      ? 'bg-bg-base border-l-2 border-l-accent-blue' 
                      : ''
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
                      <p className="text-sm text-text-primary truncate">
                        {chat.title}
                      </p>
                    )}
                    <p className="text-xs text-text-secondary">
                      {new Date(chat.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 text-text-secondary hover:text-text-primary"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => handleEditTitle(chat.id, chat.title, e)}>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => handleDeleteChat(chat.id, e)}
                        className="text-state-negative"
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

      {/* User Info & Logout */}
      <div className="p-4 border-t border-border-line mt-auto">
        <div className="mb-3">
          <p className="text-xs text-text-secondary truncate">
            {user?.email}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full border-border-line text-text-secondary hover:text-text-primary hover:bg-bg-base"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};