
import AuthComponent from '@/components/auth/auth-component';
import Image from 'next/image';

export default function AuthPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 items-center justify-center bg-background">
      <div className="hidden md:flex flex-col items-center justify-center p-8 h-full bg-card/30 relative overflow-hidden">
  <Image src="https://picsum.photos/800/1200" fill style={{ objectFit: 'cover' }} alt="Holographic Hospital Globe" className="opacity-10" data-ai-hint="holographic globe" />
        <div className="relative z-10 text-center">
            <h1 className="text-4xl font-headline font-bold neon-glow">Welcome to the Future of Care</h1>
            <p className="text-muted-foreground mt-4 max-w-md">Your health journey, reimagined. Secure, seamless, and always about you.</p>
        </div>
      </div>
      <div className="flex items-center justify-center p-4 md:p-8">
        <AuthComponent />
      </div>
    </div>
  );
}
