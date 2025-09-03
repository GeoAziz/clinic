
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { Loader2 } from 'lucide-react';
import { updateUser } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { useUserForm, UserFormFields } from './use-user-form';
import type { User } from '@/app/admin/users/page';

const initialState = {
  error: undefined,
  message: '',
};

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <Button type="submit" disabled={pending} className="btn-gradient" aria-busy={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Save Changes
    </Button>
  );
}

export function EditUserDialog({ user, onUserUpdated, isOpen, onOpenChange }: { user: User; onUserUpdated: () => void; isOpen: boolean; onOpenChange: (open: boolean) => void }) {
  const [state, formAction] = useActionState(updateUser, initialState);
  const { toast } = useToast();
  
  const initialForm: UserFormFields = {
    fullName: user.name,
    email: user.email,
    role: user.role as 'patient' | 'doctor' | 'receptionist' | 'admin',
  };

  const {
    fields,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    setFields,
    setErrors,
    setTouched,
  } = useUserForm(initialForm);

  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (state.message) {
      if (state.message.includes('successfully')) {
         toast({
            title: 'User Updated!',
            description: state.message,
         });
         onUserUpdated();
         onOpenChange(false);
      } else {
         toast({
            variant: 'destructive',
            title: 'Error',
            description: state.message,
         });
      }
      setPending(false);
    }
  }, [state, toast, onUserUpdated, onOpenChange]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setFields(initialForm);
      setErrors({});
      setTouched({});
      state.message = '';
      setPending(false);
    }
    onOpenChange(open);
  };
  
  const handleClientSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!validate()) {
      e.preventDefault();
      return;
    }
    setPending(true);
    // allow form to submit to server action
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] glass-pane" aria-modal="true" role="dialog">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Make changes to the user's profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" action={formAction} onSubmit={handleClientSubmit} aria-live="polite" autoComplete="off">
          <input type="hidden" name="uid" value={user.id} />
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              required
              value={fields.fullName}
              onChange={e => handleChange('fullName', e.target.value)}
              onBlur={() => handleBlur('fullName')}
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              disabled={pending}
            />
            {touched.fullName && errors.fullName && (
              <p className="text-xs text-destructive" id="fullName-error">{errors.fullName[0]}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={fields.email}
              readOnly
              disabled
              className="text-muted-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select name="role" required value={fields.role} onValueChange={val => handleChange('role', val)} disabled={pending}>
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
            {touched.role && errors.role && (
              <p className="text-xs text-destructive" id="role-error">{errors.role[0]}</p>
            )}
          </div>
          {state.error?._form && (
            <p className="text-sm font-medium text-destructive">{state.error._form[0]}</p>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={pending}>Cancel</Button>
            </DialogClose>
            <SubmitButton pending={pending} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
