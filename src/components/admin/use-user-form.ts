import { useState } from 'react';
import { z } from 'zod';

const userSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  role: z.enum(['patient', 'doctor', 'nurse', 'receptionist', 'admin'], {
    errorMap: () => ({ message: 'Role is required.' })
  }),
});

export type UserFormFields = z.infer<typeof userSchema>;
export type UserFormErrors = Partial<Record<keyof UserFormFields, string[]>> & { _form?: string[] };

export function useUserForm(initial: UserFormFields) {
  const [fields, setFields] = useState<UserFormFields>(initial);
  const [errors, setErrors] = useState<UserFormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof UserFormFields, boolean>>>({});

  const validate = (override?: Partial<UserFormFields>) => {
    const result = userSchema.safeParse({ ...fields, ...override });
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors as UserFormErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleChange = (name: keyof UserFormFields, value: string) => {
    setFields(f => ({ ...f, [name]: value }));
    setTouched(t => ({ ...t, [name]: true }));
    validate({ [name]: value } as Partial<UserFormFields>);
  };

  const handleBlur = (name: keyof UserFormFields) => {
    setTouched(t => ({ ...t, [name]: true }));
    validate();
  };

  return {
    fields,
    setFields,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    setErrors,
    setTouched,
  };
}
