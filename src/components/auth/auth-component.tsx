'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { auth, db } from '@/lib/firebase/client';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';


const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // RBAC check
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                toast({ title: 'Login Successful', description: `Welcome back, ${userData.displayName || userData.fullName || user.email}!` });
                // Redirect based on role
                switch (userData.role) {
                    case 'admin':
                        router.push('/admin');
                        break;
                    case 'patient':
                        router.push('/'); // Or a patient dashboard
                        break;
                    // Add other roles like doctor, nurse etc.
                    default:
                        router.push('/');
                }
            } else {
                 await auth.signOut();
                 toast({ variant: 'destructive', title: 'Login Failed', description: 'User data not found.' });
            }

        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Login Failed', description: error.message });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
      <form className="space-y-6" onSubmit={handleLogin}>
        <div className="space-y-2">
          <Label htmlFor="email-login">Email</Label>
          <Input id="email-login" type="email" placeholder="you@example.com" className="h-12 glass-pane focus:neon-border" value={email} onChange={(e) => setEmail(e.target.value)} required/>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password-login">Password</Label>
          <div className="relative">
            <Input id="password-login" type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="h-12 glass-pane focus:neon-border pr-10" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Button type="button" variant="ghost" size="icon" className="absolute inset-y-0 right-0 h-full px-3 text-muted-foreground hover:text-primary" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff /> : <Eye />}
              <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
            </Button>
          </div>
        </div>
        <div className="text-right">
            <Button variant="link" size="sm">Forgot Password?</Button>
        </div>
        <Button type="submit" className="w-full btn-gradient animate-pulse-glow h-12 text-lg" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin"/> : <LogIn className="mr-2"/>}
            Secure Login
        </Button>
      </form>
    );
};

const SignupForm = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('');
    const [profileType, setProfileType] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                fullName,
                email,
                phone,
                dob,
                gender,
                profileType,
                role: 'patient',
                createdAt: new Date(),
            });

            toast({ title: 'Signup Successful!', description: 'Your account has been created.' });
            router.push('/');

        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Signup Failed', description: error.message });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
      <form className="space-y-4" onSubmit={handleSignup}>
        <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="fullname">Full Name</Label>
                <Input id="fullname" placeholder="John Doe" className="glass-pane focus:neon-border" value={fullName} onChange={e => setFullName(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email-signup">Email</Label>
                <Input id="email-signup" type="email" placeholder="you@example.com" className="glass-pane focus:neon-border" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
        </div>
         <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" className="glass-pane focus:neon-border" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" className="glass-pane focus:neon-border" value={dob} onChange={e => setDob(e.target.value)} required/>
            </div>
        </div>
         <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="password-signup">Password</Label>
                <Input id="password-signup" type="password" placeholder="••••••••" className="glass-pane focus:neon-border" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select onValueChange={setGender} value={gender}>
                    <SelectTrigger className="glass-pane focus:neon-border">
                        <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
         <div className="space-y-2">
            <Label htmlFor="profile-type">Profile Type</Label>
            <Select onValueChange={setProfileType} value={profileType}>
                <SelectTrigger className="glass-pane focus:neon-border">
                    <SelectValue placeholder="Select profile type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="online">Online Profile</SelectItem>
                    <SelectItem value="physical">Link Existing Hospital Record</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <Button type="submit" className="w-full btn-gradient animate-pulse-glow h-12 text-lg mt-4" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : <UserPlus className="mr-2"/>}
            Create Account
        </Button>
      </form>
    );
};


export default function AuthComponent() {
  return (
    <Card className="glass-pane w-full max-w-lg">
      <Tabs defaultValue="login" className="w-full">
        <CardHeader>
            <TabsList className="grid w-full grid-cols-2 h-12">
                <TabsTrigger value="login" className="text-lg">Login</TabsTrigger>
                <TabsTrigger value="signup" className="text-lg">Sign Up</TabsTrigger>
            </TabsList>
        </CardHeader>
        <CardContent className="pt-6">
            <TabsContent value="login">
                <LoginForm />
            </TabsContent>
            <TabsContent value="signup">
                <SignupForm />
            </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
