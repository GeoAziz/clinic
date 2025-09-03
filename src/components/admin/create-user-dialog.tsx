
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
  data: undefined as ({ resetLink: string, email: string } | undefined),
  message: '',
};


function SubmitButton({defaultRole}: {defaultRole?: string}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="btn-gradient" aria-busy={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {defaultRole ? 'Create Patient' : 'Create User'}
    </Button>
  );
}


export function CreateUserDialog({ onUserCreated, defaultRole, buttonText = "Add New User" }: { onUserCreated: () => void, defaultRole?: 'patient' | 'doctor' | 'nurse' | 'receptionist' | 'admin', buttonText?: string }) {
  const [state, formAction] = useActionState(createUser, initialState);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
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
  } = useUserForm({ ...initialForm, role: defaultRole || 'patient' });

  const [showLinkModal, setShowLinkModal] = useState(false);
  const [lastResetLink, setLastResetLink] = useState<string | null>(null);
  const [lastEmail, setLastEmail] = useState<string | null>(null);
  const { pending } = useFormStatus();


  useEffect(() => {
    if (!state) return;

    if (state.data?.resetLink && state.data?.email) {
      setLastResetLink(state.data.resetLink);
      setLastEmail(state.data.email);
      
      setIsOpen(false);
      
      setTimeout(() => {
        setShowLinkModal(true);
        toast({
          title: '✅ User Created Successfully!',
          description: `Setup link is ready for ${state.data.email}`,
          duration: 5000,
        });
        onUserCreated();
      }, 100);
      
    } else if (state?.message && state.error) {
      toast({
        variant: 'destructive',
        title: '❌ Error Creating User',
        description: state.message,
        duration: 5000,
      });
    }
  }, [state, onUserCreated, toast]);

    const handleOpenChange = (open: boolean) => {
    setIsOpen(open);

    if (!open && !showLinkModal) {
      setFields({ ...initialForm, role: defaultRole || 'patient' });
      setErrors({});
      setTouched({});
      formRef.current?.reset();
    }
  };


  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button className="btn-gradient animate-pulse-glow">{buttonText}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] glass-pane" aria-modal="true" role="dialog">
          <DialogHeader>
            <DialogTitle>{defaultRole ? 'Add New Patient' : 'Add New User'}</DialogTitle>
            <DialogDescription>
              {defaultRole ? 'Create a new patient profile. They will receive a password setup link.' : 'Create a new user profile. They will receive a password setup link.'}
            </DialogDescription>
          </DialogHeader>
          <form ref={formRef} action={formAction} className="space-y-4" aria-live="polite" autoComplete="off">
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
            {defaultRole ? (
                <input type="hidden" name="role" value={defaultRole} />
            ) : (
                <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select name="role" required value={fields.role} onValueChange={val => handleChange('role', val)} disabled={pending}>
                    <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="patient">Patient</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="nurse">Nurse</SelectItem>
                    <SelectItem value="receptionist">Receptionist</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                </Select>
                {touched.role && errors.role && (
                    <p className="text-xs text-destructive" id="role-error">{errors.role[0]}</p>
                )}
                </div>
            )}
            {state.error?._form && (
              <p className="text-sm font-medium text-destructive">{state.error._form[0]}</p>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={pending}>Cancel</Button>
              </DialogClose>
              <SubmitButton defaultRole={defaultRole} />
            </DialogFooter>
          </form>
      </DialogContent>
    </Dialog>

    <PasswordResetLinkModal
      open={showLinkModal}
      onOpenChange={setShowLinkModal}
      resetLink={lastResetLink || ''}
      email={lastEmail || ''}
    />
    </>
  );
}
