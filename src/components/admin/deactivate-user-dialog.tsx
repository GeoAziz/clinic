
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useActionState, useEffect, useState } from 'react';
import { deactivateUser } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/app/admin/users/page';
import { Loader2 } from 'lucide-react';

const initialState = {
  message: '',
};

function SubmitButton({ pending }: { pending: boolean }) {
    return (
        <AlertDialogAction asChild>
            <Button type="submit" disabled={pending} variant="destructive" aria-busy={pending}>
                {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Deactivate
            </Button>
      </AlertDialogAction>
    )
}

export function DeactivateUserDialog({ user, onUserDeactivated, children }: { user: User; onUserDeactivated: () => void; children: React.ReactNode }) {
  const [state, formAction] = useActionState(deactivateUser, initialState);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (state.message) {
      if (state.message.includes('successfully')) {
        toast({
          title: 'Success!',
          description: state.message,
        });
        onUserDeactivated();
        setIsOpen(false);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: state.message,
        });
      }
      setPending(false);
    }
  }, [state, toast, onUserDeactivated]);
  
  const handleFormAction = (formData: FormData) => {
    setPending(true);
    formAction(formData);
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="glass-pane">
        <form action={handleFormAction}>
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
                <Button variant="outline" disabled={pending}>Cancel</Button>
            </AlertDialogCancel>
            <SubmitButton pending={pending} />
            </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
