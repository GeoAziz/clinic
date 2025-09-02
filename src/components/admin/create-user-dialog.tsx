
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Loader2, Copy } from 'lucide-react';
import { createUser } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';


const initialState = {
  error: null,
  data: null,
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="btn-gradient">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Create User
    </Button>
  );
}

export function CreateUserDialog({ onUserCreated }: { onUserCreated: () => void }) {
    const [state, formAction] = useActionState(createUser, initialState);
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (state?.data) {
            toast({
                title: 'User Created!',
                description: `A password setup link has been generated for ${state.data.email}.`,
            });
            onUserCreated(); // Callback to refresh the user list
            // Don't close the dialog, show the link instead
        } else if (state?.message && state.error) {
             toast({
                variant: 'destructive',
                title: 'Error',
                description: state.message,
            });
        }
    }, [state, toast, onUserCreated]);

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            // Reset state when closing
            state.data = null;
            state.error = null;
            state.message = '';
        }
        setIsOpen(open);
    }

    const copyToClipboard = () => {
        if (state?.data?.resetLink) {
            navigator.clipboard.writeText(state.data.resetLink);
            toast({ title: 'Copied!', description: 'Password reset link copied to clipboard.' });
        }
    }

    return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="btn-gradient animate-pulse-glow">Add New User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] glass-pane">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            {state?.data ? "Share this link with the user to set up their password." : "Create a new user profile. They will receive an email to set their password."}
          </DialogDescription>
        </DialogHeader>

        {state?.data?.resetLink ? (
             <div className="space-y-4 py-4">
                <p className="text-sm text-green-400">User created successfully!</p>
                <div className="relative">
                    <Input
                        id="reset-link"
                        readOnly
                        value={state.data.resetLink}
                        className="pr-10"
                    />
                    <Button type="button" size="icon" variant="ghost" className="absolute right-1 top-1 h-8 w-8" onClick={copyToClipboard}>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
                 <Button onClick={() => handleOpenChange(false)}>Close</Button>
            </div>
        ) : (
            <form action={formAction} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" name="fullName" placeholder="Zizo Vybz" required />
                    {state?.error?.fullName && <p className="text-xs text-destructive">{state.error.fullName[0]}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="user@clinic.io" required />
                    {state?.error?.email && <p className="text-xs text-destructive">{state.error.email[0]}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select name="role" required defaultValue="patient">
                        <SelectTrigger id="role">
                            <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="patient">Patient</SelectItem>
                            <SelectItem value="doctor">Doctor</SelectItem>
                            <SelectItem value="receptionist">Receptionist</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                    {state?.error?.role && <p className="text-xs text-destructive">{state.error.role[0]}</p>}
                </div>
                 {state?.error?._form && <p className="text-sm font-medium text-destructive">{state.error._form[0]}</p>}
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <SubmitButton />
                </DialogFooter>
            </form>
        )}
      </DialogContent>
    </Dialog>
    );
}
