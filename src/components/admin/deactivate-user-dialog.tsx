'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useActionState, useEffect, useState } from 'react';
import { deactivateUser } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/app/admin/users/page';
import { Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';

const initialState = {
  message: '',
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <AlertDialogAction asChild>
            <Button type="submit" disabled={pending} variant="destructive" aria-busy={pending}>
                {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Deactivate
            </Button>
      </AlertDialogAction>
    )
}

export function DeactivateUserDialog({ user, onUserDeactivated, isOpen, onOpenChange }: { user: User; onUserDeactivated: () => void; isOpen: boolean; onOpenChange: (open: boolean) => void; }) {
  const [state, formAction] = useActionState(deactivateUser, initialState);
  const { toast } = useToast();
  const { pending } = useFormStatus();

  useEffect(() => {
    if (state.message) {
      if (state.message.includes('successfully')) {
        toast({
          title: 'Success!',
          description: state.message,
        });
        onUserDeactivated();
        onOpenChange(false);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: state.message,
        });
      }
    }
  }, [state, toast, onUserDeactivated, onOpenChange]);

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="glass-pane">
        <form action={formAction}>
            <input type="hidden" name="uid" value={user.id} />
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action will deactivate the user account for <span className="font-bold">{user.name}</span>.
                They will no longer be able to log in. This can be undone later.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-4">
            <AlertDialogCancel asChild>
                <Button variant="outline" disabled={pending} onClick={() => onOpenChange(false)}>Cancel</Button>
            </AlertDialogCancel>
            <SubmitButton />
            </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
