
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

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Loader2, Copy } from 'lucide-react';
import { createUser } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useUserForm, UserFormFields } from './use-user-form';
import { PasswordResetLinkModal } from './password-reset-link-modal';



const initialForm: UserFormFields = {
  fullName: '',
  email: '',
  role: 'patient',
};

const initialState = {
  error: { _form: [] as string[] },
  data: undefined,
  message: '',
};


function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <Button type="submit" disabled={pending} className="btn-gradient" aria-busy={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Create User
    </Button>
  );
}


export function CreateUserDialog({ onUserCreated }: { onUserCreated: () => void }) {
  const [state, formAction] = useActionState(createUser, initialState);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
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
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [lastResetLink, setLastResetLink] = useState<string | null>(null);
  const [lastEmail, setLastEmail] = useState<string | null>(null);

  useEffect(() => {
    // Debug logging for modal state and returned data
    console.log('User creation state:', state);
    console.log('showLinkModal:', showLinkModal);
    if (state?.data?.resetLink) {
      setLastResetLink(state.data.resetLink);
      setLastEmail(state.data.email);
      setShowLinkModal(true);
      toast({
        title: 'User Created!',
        description: `A password setup link has been generated for ${state.data.email}.`,
      });
      onUserCreated();
      setPending(false);
    } else if (state?.message && state.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
      setPending(false);
    }
  }, [state, toast, onUserCreated, showLinkModal]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setFields(initialForm);
      setErrors({});
      setTouched({});
      state.data = undefined;
      state.error = undefined;
      state.message = '';
      setPending(false);
    }
    setIsOpen(open);
  };

  const copyToClipboard = () => {
    if (state?.data?.resetLink) {
      navigator.clipboard.writeText(state.data.resetLink);
      toast({ title: 'Copied!', description: 'Password reset link copied to clipboard.' });
    }
  };


  // Ref to hidden submit button
  const hiddenSubmitRef = useRef<HTMLButtonElement>(null);

  // Only allow server action if client validation passes
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
      <DialogTrigger asChild>
        <Button className="btn-gradient animate-pulse-glow">Add New User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] glass-pane" aria-modal="true" role="dialog">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            {state?.data ? "Share this link with the user to set up their password." : "Create a new user profile. They will receive an email to set their password."}
          </DialogDescription>
        </DialogHeader>

  {/* Show form always, link modal is now separate */}
      {/* Debug info for troubleshooting modal visibility */}
      <div style={{ background: '#fffbe6', color: '#b8860b', padding: '8px', marginBottom: '8px', borderRadius: '4px', fontSize: '0.9em' }}>
        <strong>Debug:</strong> showLinkModal={String(showLinkModal)}, resetLink={lastResetLink}, email={lastEmail}
      </div>
      {/* Debug: show modal props in console */}
      {showLinkModal && (
        <div style={{ background: '#e0f7fa', color: '#006064', padding: '8px', marginBottom: '8px', borderRadius: '4px', fontSize: '0.9em' }}>
          <strong>Debug Modal:</strong> Modal should be open.<br />
          resetLink: {String(lastResetLink)}<br />
          email: {String(lastEmail)}
        </div>
      )}
      <PasswordResetLinkModal
        open={showLinkModal}
        onOpenChange={setShowLinkModal}
        resetLink={lastResetLink || ''}
        email={lastEmail || ''}
      />
          <form className="space-y-4" action={formAction} onSubmit={handleClientSubmit} aria-live="polite" autoComplete="off">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="Zizo Vybz"
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
                placeholder="user@clinic.io"
                required
                value={fields.email}
                onChange={e => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                disabled={pending}
              />
              {touched.email && errors.email && (
                <p className="text-xs text-destructive" id="email-error">{errors.email[0]}</p>
              )}
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
            {errors._form && (
              <p className="text-sm font-medium text-destructive">{errors._form[0]}</p>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={pending}>Cancel</Button>
              </DialogClose>
              <SubmitButton pending={pending} />
              {/* Hidden submit button for programmatic submit if needed */}
              <button type="submit" ref={hiddenSubmitRef} style={{ display: 'none' }} tabIndex={-1} aria-hidden="true">Submit</button>
            </DialogFooter>
          </form>
      </DialogContent>
    </Dialog>
  );
}
