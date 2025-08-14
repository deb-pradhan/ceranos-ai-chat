import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Loader2, Mail } from 'lucide-react';
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold text-text-primary">
            Welcome to CERANOS
          </DialogTitle>
          <DialogDescription className="text-text-secondary">
            {step === 'email' 
              ? 'Enter your email to get started with AI assistance'
              : 'Enter the 6-digit code sent to your email'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {step === 'email' ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-text-primary">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    autoFocus
                    disabled={loading}
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || !email.trim()}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Verification Code
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-text-primary">
                  Verification Code
                </Label>
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
                <p className="text-sm text-text-muted text-center">
                  Sent to {email}
                </p>
              </div>

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
              </div>
            </div>
          )}
        </div>

        {loading && step === 'otp' && (
          <div className="flex items-center justify-center py-2">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm text-text-muted">Verifying code...</span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};