import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy } from 'lucide-react';
import { useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface PasswordResetLinkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resetLink: string;
  email: string;
}

export function PasswordResetLinkModal({ open, onOpenChange, resetLink, email }: PasswordResetLinkModalProps) {
  console.log('PasswordResetLinkModal: Render', { 
    open, 
    hasLink: !!resetLink, 
    linkLength: resetLink?.length,
    email 
  });
  
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const mountedRef = useRef(false);
  
  // Initialize on mount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Handle modal opening and input focus
  useEffect(() => {
    if (!open || !mountedRef.current) return;

    console.log('PasswordResetLinkModal: Modal opened', {
      hasLink: !!resetLink,
      linkLength: resetLink?.length,
      hasEmail: !!email
    });

    // Validate props and focus input
    if (!resetLink || !email) {
      console.warn('PasswordResetLinkModal: Invalid props on open', {
        hasLink: !!resetLink,
        hasEmail: !!email
      });
      onOpenChange(false);
      return;
    }

    // Focus and select input content
    const focusTimeout = setTimeout(() => {
      if (inputRef.current && mountedRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
        console.log('PasswordResetLinkModal: Input focused and selected');
      }
    }, 100);

    return () => clearTimeout(focusTimeout);
  }, [open, resetLink, email, onOpenChange]);

  const copyToClipboard = () => {
    console.log('PasswordResetLinkModal: Copying link');
    if (resetLink) {
      navigator.clipboard.writeText(resetLink);
      inputRef.current?.select();
      toast({
        title: '📋 Link Copied!',
        description: 'The setup link has been copied to your clipboard.',
        duration: 3000,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] glass-pane" aria-modal="true" role="dialog">
        <DialogHeader>
          <DialogTitle className="text-2xl">Secure Setup Link Ready</DialogTitle>
          <DialogDescription className="text-md mt-2">
            A secure, one-time setup link has been generated for <span className="font-semibold text-primary">{email}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Important Security Notes:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• This is a one-time use link that will expire in 24 hours</li>
              <li>• Share this link securely with the new user</li>
              <li>• The user will set their own password via this link</li>
            </ul>
          </div>
          
          <div className="relative">
            <Input
              id="reset-link-modal"
              readOnly
              value={resetLink}
              className="pr-10 font-mono text-sm"
              ref={inputRef}
              aria-label="Password reset link"
              onFocus={e => e.target.select()}
            />
            <Button 
              type="button" 
              size="icon" 
              variant="ghost" 
              className="absolute right-1 top-1 h-8 w-8 hover:bg-primary hover:text-primary-foreground" 
              onClick={copyToClipboard} 
              aria-label="Copy password reset link"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex justify-end space-x-2">
            <Button onClick={copyToClipboard} className="w-full">
              <Copy className="h-4 w-4 mr-2" />
              Copy Setup Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
