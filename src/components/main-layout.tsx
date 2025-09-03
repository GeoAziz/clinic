
'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Logo = () => (
  <Link href="/" className="flex items-center gap-2 group">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" 
         className="text-primary transition-all duration-300 group-hover:text-accent group-hover:scale-110 group-hover:drop-shadow-[0_0_5px_hsl(var(--primary))]">
      <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 7L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 7L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 4.5L7 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
    </svg>
    <span className="font-headline text-xl font-bold text-foreground transition-all duration-300 group-hover:text-accent group-hover:neon-glow-primary">
      Zizo_HealthVerse
    </span>
  </Link>
);


export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthenticatedRoute = pathname.startsWith('/admin') || pathname.startsWith('/patient');

  if (isAuthenticatedRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-primary/20">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <Logo />
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/" className="font-semibold laser-underline">Home</Link>
            <Link href="/about" className="font-semibold laser-underline">About Clinic</Link>
            <Link href="/services" className="font-semibold laser-underline">Services</Link>
            <Link href="/doctors" className="font-semibold laser-underline">Doctors</Link>
            <Link href="/contact" className="font-semibold laser-underline">Contact</Link>
             <Link href="/ai-check" className="font-semibold laser-underline text-accent">AI Check</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" className="neon-border">
              <Link href="/auth">Login / Sign Up</Link>
            </Button>
            <Button className="btn-gradient animate-pulse-glow">
              <Link href="/book">Book Appointment</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
          {children}
      </main>

      <footer className="bg-card/50 border-t border-primary/10">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <Logo />
              <p className="text-sm text-muted-foreground mt-2">Your Health, Secured by the Future.</p>
            </div>
            <div>
              <h3 className="font-headline text-lg font-semibold">Quick Links</h3>
              <ul className="mt-2 space-y-1">
                <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary">About</Link></li>
                <li><Link href="/services" className="text-sm text-muted-foreground hover:text-primary">Services</Link></li>
                <li><Link href="/doctors" className="text-sm text-muted-foreground hover:text-primary">Doctors</Link></li>
                 <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-headline text-lg font-semibold">Connect</h3>
               <div className="flex justify-center md:justify-start space-x-4 mt-2">
                 {/* Social icons here */}
               </div>
            </div>
          </div>
          <div className="mt-8 border-t border-primary/20 pt-4 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Zizo_HealthVerse | Designed with #zizoaestheticsandvybz
          </div>
        </div>
      </footer>
    </div>
  );
}
