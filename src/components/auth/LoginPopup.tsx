import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Loader2, Mail, Shield, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface LoginPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const LoginPopup: React.FC<LoginPopupProps> = ({ 
  open, 
  onOpenChange, 
  onSuccess 
}) => {
  const { sendOTP, verifyOTP } = useAuth();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  React.useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  React.useEffect(() => {
    if (!open) {
      // Reset state when popup closes
      setStep('email');
      setEmail('');
      setOtp('');
      setLoading(false);
      setResendCooldown(0);
    }
  }, [open]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    const { error } = await sendOTP(email);
    
    if (error) {
      setLoading(false);
      return;
    }

    setStep('otp');
    setResendCooldown(60);
    setLoading(false);
    toast({
      title: "Code sent!",
      description: "Check your email for a 6-digit verification code."
    });
  };

  const handleVerifyOTP = async (otpValue: string) => {
    if (otpValue.length !== 6) return;
    
    setLoading(true);
    const { error } = await verifyOTP(email, otpValue);
    
    if (error) {
      setOtp('');
      setLoading(false);
      return;
    }

    setLoading(false);
    toast({
      title: "Welcome!",
      description: "You've been successfully logged in."
    });
    onOpenChange(false);
    onSuccess?.();
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    
    setLoading(true);
    const { error } = await sendOTP(email);
    
    if (!error) {
      setResendCooldown(60);
      toast({
        title: "Code resent!",
        description: "A new verification code has been sent to your email."
      });
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border-line bg-bg-elevated">
        <DialogHeader className="text-center space-y-3">
          <div className="flex items-center justify-center mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-accent-blue to-accent-blue-subtle rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-brand text-text-primary">
            Welcome to CERANOS
          </DialogTitle>
          <DialogDescription className="text-text-secondary">
            {step === 'email' 
              ? 'Enter your email to unlock AI-powered market insights'
              : 'Enter the 6-digit code sent to your email'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {step === 'email' ? (
            <Card className="border-border-subtle bg-bg-panel/30">
              <CardContent className="p-6">
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-text-primary font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary h-4 w-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-bg-elevated border-border-line"
                        autoFocus
                        disabled={loading}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-accent-blue hover:bg-accent-blue-subtle" 
                    disabled={loading || !email.trim()}
                    size="lg"
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Shield className="mr-2 h-4 w-4" />
                    Send Verification Code
                  </Button>
                </form>

                <Separator className="my-4" />
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">Secure</Badge>
                    <Badge variant="outline" className="text-xs">No Password</Badge>
                  </div>
                  <p className="text-xs text-text-tertiary">
                    We'll send you a secure code to verify your email
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border-subtle bg-bg-panel/30">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="text-center">
                    <Label className="text-text-primary font-medium">
                      Verification Code
                    </Label>
                    <p className="text-sm text-text-secondary mt-1">
                      Code sent to <Badge variant="secondary">{email}</Badge>
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <InputOTP
                      value={otp}
                      onChange={(value) => {
                        setOtp(value);
                        if (value.length === 6) {
                          handleVerifyOTP(value);
                        }
                      }}
                      maxLength={6}
                      disabled={loading}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>

                <Separator />

                <div className="flex flex-col space-y-2">
                  <Button
                    variant="outline"
                    onClick={() => setStep('email')}
                    disabled={loading}
                    className="w-full"
                  >
                    Change Email
                  </Button>
                  
                  <Button
                    variant="ghost"
                    onClick={handleResendOTP}
                    disabled={loading || resendCooldown > 0}
                    className="w-full text-sm"
                  >
                    {resendCooldown > 0 
                      ? `Resend code in ${resendCooldown}s`
                      : 'Resend verification code'
                    }
                  </Button>
                  
                  {resendCooldown > 0 && (
                    <Progress 
                      value={((60 - resendCooldown) / 60) * 100} 
                      className="h-1 mt-2" 
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {loading && step === 'otp' && (
          <Card className="border-accent-blue/20 bg-accent-blue/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2 text-accent-blue" />
                <span className="text-sm text-accent-blue font-medium">Verifying code...</span>
              </div>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
};