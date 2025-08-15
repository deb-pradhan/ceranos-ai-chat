import React, { useState } from 'react';
import { Plus, MessageCircle, Trash2, User, LogOut, Settings, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useChatHistory } from '@/hooks/useChatHistory';
import { LoginPopup } from '@/components/auth/LoginPopup';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface AppSidebarProps {
  selectedChatId: string | null;
  onSelectChat: (chatId: string | null) => void;
  isMobile: boolean;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ 
  selectedChatId, 
  onSelectChat, 
  isMobile 
}) => {
  const { user, signOut } = useAuth();
  const { chats, deleteChat, loadChats } = useChatHistory();
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const filteredChats = chats.filter(chat => 
    chat.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewChat = () => {
    console.log('Starting new chat');
    onSelectChat(null);
  };

  const handleDeleteChat = async (chatId: string) => {
    console.log('Deleting chat:', chatId);
    setDeletingChatId(chatId);
    
    try {
      await deleteChat(chatId);
      
      if (selectedChatId === chatId) {
        onSelectChat(null);
      }
      
      await loadChats();
      
      toast({
        title: "Success",
        description: "Chat deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast({
        title: "Error",
        description: "Failed to delete chat",
        variant: "destructive"
      });
    } finally {
      setDeletingChatId(null);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Success", 
        description: "Logged out successfully"
      });
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className={cn(
      "flex flex-col h-full border-0 rounded-none shadow-none bg-card",
      isMobile ? "w-full" : "w-full"
    )}>
      {/* Header */}
      <CardHeader className="space-y-4 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold bg-sky-gradient bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            AI Assistant
          </CardTitle>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            Pro
          </Badge>
        </div>
        
        <Button
          onClick={handleNewChat}
          className="w-full justify-start bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200"
          size="lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Chat
        </Button>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/50 border-border/50 focus-visible:border-primary/50 focus-visible:ring-primary/20"
          />
        </div>
      </CardHeader>

      {/* Chat List */}
      <CardContent className="flex-1 p-0">
        <Separator className="mb-4" />
        
        <div className="px-4 mb-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Recent Conversations
          </h3>
        </div>

        <ScrollArea className="h-full px-2">
          <div className="space-y-1">
            {filteredChats.length === 0 ? (
              <div className="text-center text-muted-foreground py-12 px-4">
                <div className="p-4 rounded-full bg-muted/50 w-fit mx-auto mb-4">
                  <MessageCircle className="h-8 w-8" />
                </div>
                <p className="font-semibold text-lg mb-2">No conversations yet</p>
                <p className="text-sm">Start a new chat to begin your AI-powered journey!</p>
              </div>
            ) : (
              filteredChats.map((chat) => (
                <div key={chat.id} className="group relative mx-2">
                  <Button
                    variant={selectedChatId === chat.id ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start text-left h-auto p-4 relative transition-all duration-200",
                      "hover:bg-accent hover:text-accent-foreground hover:shadow-sm",
                      selectedChatId === chat.id && "bg-primary/5 text-primary border border-primary/20 shadow-sm"
                    )}
                    onClick={() => onSelectChat(chat.id)}
                  >
                    <MessageCircle className="h-4 w-4 mr-3 flex-shrink-0 opacity-60" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium text-sm leading-tight">
                        {chat.title || 'Untitled Chat'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(chat.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </Button>
                  
                  {/* Delete button */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md"
                        disabled={deletingChatId === chat.id}
                      >
                        {deletingChatId === chat.id ? (
                          <Skeleton className="h-4 w-4 rounded" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this conversation? This action cannot be undone and all messages will be permanently removed.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteChat(chat.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>

      {/* User Profile */}
      <div className="border-t p-4">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-3 h-auto hover:bg-accent rounded-lg">
                <Avatar className="h-10 w-10 mr-3 border-2 border-primary/20">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <div className="font-semibold text-foreground truncate">
                    {user.user_metadata?.name || 'User'}
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    {user.email}
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <User className="h-4 w-4 mr-2" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Preferences
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="space-y-3">
            <div className="text-center text-muted-foreground">
              <div className="p-3 rounded-full bg-muted/50 w-fit mx-auto mb-3">
                <User className="h-6 w-6" />
              </div>
              <p className="font-medium">Welcome!</p>
              <p className="text-sm mt-1">Sign in to save your conversations</p>
            </div>
            <Button
              onClick={() => setShowLoginPopup(true)}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Sign In
            </Button>
          </div>
        )}
      </div>

      <LoginPopup 
        open={showLoginPopup}
        onOpenChange={setShowLoginPopup}
        onSuccess={() => setShowLoginPopup(false)}
      />
    </Card>
  );
};