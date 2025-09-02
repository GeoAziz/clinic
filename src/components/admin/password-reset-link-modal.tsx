import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy } from 'lucide-react';
import { useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface PasswordResetLinkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resetLink: string;
  email: string;
}

export function PasswordResetLinkModal({ open, onOpenChange, resetLink, email }: PasswordResetLinkModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const copyToClipboard = () => {
    if (resetLink) {
      navigator.clipboard.writeText(resetLink);
      toast({ title: 'Copied!', description: 'Password reset link copied to clipboard.' });
      inputRef.current?.select();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] glass-pane" aria-modal="true" role="dialog">
        <DialogHeader>
          <DialogTitle>Password Setup Link</DialogTitle>
          <DialogDescription>
            Share this link with <span className="font-semibold">{email}</span> so they can set up their password.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="relative">
            <Input
              id="reset-link-modal"
              readOnly
              value={resetLink}
              className="pr-10"
              ref={inputRef}
              aria-label="Password reset link"
              onFocus={e => e.target.select()}
            />
            <Button type="button" size="icon" variant="ghost" className="absolute right-1 top-1 h-8 w-8" onClick={copyToClipboard} aria-label="Copy password reset link">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
