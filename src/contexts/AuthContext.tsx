import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string) => Promise<{ error: any }>;
  sendOTP: (email: string) => Promise<{ error: any }>;
  verifyOTP: (email: string, token: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      console.log('AuthProvider: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string) => {
    console.log('Attempting sign in for:', email);
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl
      }
    });

    if (error) {
      console.error('Sign in error:', error);
      toast({
        title: "Sign In Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      console.log('Magic link sent successfully');
      toast({
        title: "Check your email",
        description: "We've sent you a magic link to sign in."
      });
    }

    return { error };
  };

  const sendOTP = async (email: string) => {
    console.log('=== STARTING OTP SEND PROCESS ===');
    console.log('Email:', email);
    console.log('Timestamp:', new Date().toISOString());
    
    // Method 1: Try signInWithOtp (current method)
    console.log('--- Attempting Method 1: signInWithOtp ---');
    const otpParams = {
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: undefined,
        data: {
          type: 'signup'
        }
      }
    };
    console.log('OTP Parameters:', JSON.stringify(otpParams, null, 2));
    
    const { error: otpError } = await supabase.auth.signInWithOtp(otpParams);
    
    if (otpError) {
      console.error('Method 1 (signInWithOtp) failed:', otpError);
      console.log('--- Attempting Method 2: signUp (fallback) ---');
      
      // Method 2: Fallback to signUp method
      const signUpParams = {
        email,
        password: 'temporary-password-' + Math.random().toString(36).substring(7), // Temporary password
        options: {
          emailRedirectTo: undefined,
          data: {
            verification_type: 'otp'
          }
        }
      };
      console.log('SignUp Parameters:', JSON.stringify(signUpParams, null, 2));
      
      const { error: signUpError } = await supabase.auth.signUp(signUpParams);
      
      if (signUpError) {
        console.error('Method 2 (signUp) also failed:', signUpError);
        console.log('=== BOTH METHODS FAILED ===');
        toast({
          title: "Error sending code",
          description: `Failed to send verification code: ${signUpError.message}`,
          variant: "destructive"
        });
        return { error: signUpError };
      } else {
        console.log('Method 2 (signUp) succeeded - OTP should be sent');
        console.log('=== FALLBACK METHOD SUCCESS ===');
        toast({
          title: "Verification code sent (via signup)",
          description: "Check your email for a 6-digit verification code. Note: This used an alternative method."
        });
        return { error: null };
      }
    } else {
      console.log('Method 1 (signInWithOtp) succeeded');
      console.log('=== PRIMARY METHOD SUCCESS ===');
      
      // Check what type of verification was actually sent
      console.log('--- Checking verification method type ---');
      try {
        // Try to get session to see if magic link was used instead
        const { data: sessionData } = await supabase.auth.getSession();
        console.log('Current session after OTP send:', sessionData);
        
        if (sessionData.session) {
          console.warn('WARNING: Session exists immediately after OTP send - this suggests magic link was used!');
        } else {
          console.log('No immediate session - this suggests OTP was properly sent');
        }
      } catch (sessionError) {
        console.error('Error checking session:', sessionError);
      }
      
      toast({
        title: "Verification code sent",
        description: "Check your email for a 6-digit verification code. It expires in 10 minutes."
      });
      return { error: null };
    }
  };

  const verifyOTP = async (email: string, token: string) => {
    console.log('=== STARTING OTP VERIFICATION PROCESS ===');
    console.log('Email:', email);
    console.log('Token:', token);
    console.log('Token length:', token.length);
    console.log('Token type:', typeof token);
    console.log('Timestamp:', new Date().toISOString());
    
    const verifyParams = {
      email,
      token,
      type: 'email' as const
    };
    console.log('Verify Parameters:', JSON.stringify(verifyParams, null, 2));
    
    const { error, data } = await supabase.auth.verifyOtp(verifyParams);
    
    if (error) {
      console.error('=== OTP VERIFICATION FAILED ===');
      console.error('Error details:', error);
      console.error('Error code:', error.status);
      console.error('Error message:', error.message);
      
      toast({
        title: "Invalid Code",
        description: "The verification code is incorrect or has expired. Please try again.",
        variant: "destructive"
      });
    } else {
      console.log('=== OTP VERIFICATION SUCCESS ===');
      console.log('Verification response data:', data);
      console.log('User data:', data?.user);
      console.log('Session data:', data?.session);
      
      if (data?.session) {
        console.log('Session created successfully');
        console.log('Access token received:', !!data.session.access_token);
        console.log('Refresh token received:', !!data.session.refresh_token);
      }
    }

    return { error };
  };

  const signOut = async () => {
    console.log('Signing out user');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign Out Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      console.log('User signed out successfully');
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    sendOTP,
    verifyOTP,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};