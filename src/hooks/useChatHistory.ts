import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: number;
  chat_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

export const useChatHistory = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadChats();
    }
  }, [user]);

  const loadChats = async () => {
    if (!user) return;

    console.log('Loading chats for user:', user.id);
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error loading chats:', error);
        throw error;
      }

      console.log('Loaded chats:', data?.length || 0);
      setChats(data || []);
    } catch (error) {
      console.error('Failed to load chats:', error);
      toast({
        title: "Error",
        description: "Failed to load chat history",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createChat = async (title: string): Promise<string | null> => {
    if (!user) return null;

    console.log('Creating new chat with title:', title);

    try {
      const { data, error } = await supabase
        .from('chats')
        .insert({
          user_id: user.id,
          title: title.trim()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating chat:', error);
        throw error;
      }

      console.log('Created chat:', data.id);
      await loadChats(); // Refresh chat list
      return data.id;
    } catch (error) {
      console.error('Failed to create chat:', error);
      toast({
        title: "Error",
        description: "Failed to create new chat",
        variant: "destructive"
      });
      return null;
    }
  };

  const deleteChat = async (chatId: string) => {
    if (!user) return false;

    console.log('Deleting chat:', chatId);

    try {
      const { error } = await supabase
        .from('chats')
        .delete()
        .eq('id', chatId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting chat:', error);
        throw error;
      }

      console.log('Deleted chat:', chatId);
      await loadChats(); // Refresh chat list
      return true;
    } catch (error) {
      console.error('Failed to delete chat:', error);
      toast({
        title: "Error",
        description: "Failed to delete chat",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateChatTitle = async (chatId: string, newTitle: string) => {
    if (!user) return false;

    console.log('Updating chat title:', chatId, newTitle);

    try {
      const { error } = await supabase
        .from('chats')
        .update({ title: newTitle.trim() })
        .eq('id', chatId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating chat title:', error);
        throw error;
      }

      console.log('Updated chat title:', chatId);
      await loadChats(); // Refresh chat list
      return true;
    } catch (error) {
      console.error('Failed to update chat title:', error);
      toast({
        title: "Error",
        description: "Failed to update chat title",
        variant: "destructive"
      });
      return false;
    }
  };

  const addMessage = async (chatId: string, role: 'user' | 'assistant' | 'system', content: string): Promise<Message> => {
    if (!user) throw new Error('User not authenticated');

    console.log('Adding message to chat:', chatId, role);

    const { data, error } = await supabase
      .from('messages')
      .insert({
        chat_id: chatId,
        user_id: user.id,
        role,
        content: content.trim()
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding message:', error);
      throw error;
    }

      console.log('Added message:', data.id);
      return data as Message;
  };

  const loadChatMessages = async (chatId: string): Promise<Message[]> => {
    if (!user) return [];

    console.log('Loading messages for chat:', chatId);

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        throw error;
      }

      console.log('Loaded messages:', data?.length || 0);
      return (data || []) as Message[];
    } catch (error) {
      console.error('Failed to load messages:', error);
      throw error;
    }
  };

  return {
    chats,
    loading,
    loadChats,
    createChat,
    deleteChat,
    updateChatTitle,
    addMessage,
    loadChatMessages
  };
};