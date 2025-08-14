-- Fix security warnings by setting search_path for functions

-- Drop and recreate update_chat_updated_at function with proper search_path
DROP FUNCTION IF EXISTS public.update_chat_updated_at();

CREATE OR REPLACE FUNCTION public.update_chat_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.chats 
  SET updated_at = now() 
  WHERE id = NEW.chat_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Drop and recreate handle_new_user function with proper search_path  
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';