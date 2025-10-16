import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, ArrowLeft } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    console.log('LoginScreen: Submitting login form for email:', email);
    setIsLoading(true);
    
    const { error } = await signIn(email.trim());
    
    if (!error) {
      setEmailSent(true);
    }
    
    setIsLoading(false);
  };

  const handleBackToDocs = () => {
    // In a real app, this would navigate to a docs page
    console.log('Navigate to docs');
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-border-line">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto">
              <h1 className="text-2xl font-brand text-text-primary">BROWNSTONE</h1>
            </div>
            <CardTitle className="text-text-primary">Check your email</CardTitle>
            <CardDescription className="text-text-secondary">
              We've sent a magic link to <strong>{email}</strong>. 
              Click the link in your email to sign in.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setEmailSent(false)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to login
            </Button>
            <p className="text-xs text-text-secondary text-center">
              Didn't receive an email? Check your spam folder or try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border-line">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto">
            <h1 className="text-3xl font-brand text-text-primary">BROWNSTONE</h1>
          </div>
          <CardTitle className="text-text-primary">Welcome back</CardTitle>
          <CardDescription className="text-text-secondary">
            Sign in to your account to access the crypto market AI chat
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-text-primary">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="border-border-line focus-visible:ring-focus-ring"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-accent-orange hover:bg-accent-orange/90 text-white"
              disabled={isLoading || !email.trim()}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                  Sending magic link...
                </div>
              ) : (
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Send magic link
                </div>
              )}
            </Button>
          </form>
          <div className="mt-6 pt-4 border-t border-border-line">
            <Button
              type="button"
              variant="link"
              className="w-full text-text-secondary hover:text-accent-orange"
              onClick={handleBackToDocs}
            >
              Back to docs
            </Button>
            <p className="text-xs text-text-secondary text-center mt-4">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};