'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowDown, CheckCircle, ShieldCheck, Cpu, Stethoscope, HeartPulse, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import MainLayout from '@/components/main-layout';


const HeroSection = () => (
  <section className="relative py-32 md:py-48 text-center overflow-hidden">
     <div className="absolute inset-0 z-0 opacity-20">
        <Image src="https://picsum.photos/1200/800" alt="Holographic Globe" layout="fill" objectFit="cover" data-ai-hint="holographic globe" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background"></div>
      </div>
    <div className="container mx-auto px-4 relative z-10">
      <h1 className="text-4xl md:text-7xl font-bold tracking-tighter text-foreground">
        Reimagining Healthcare in the <span className="neon-glow">Sci-Fi Era</span> 🚀
      </h1>
      <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground">
        Zizo_HealthVerse brings AI-powered care, secure access, and seamless booking — from patients to doctors to the future of clinics.
      </p>
      <div className="mt-10 flex justify-center gap-4">
        <Button size="lg" className="btn-gradient animate-pulse-glow" asChild>
          <Link href="/book">Book Appointment</Link>
        </Button>
        <Button size="lg" variant="outline" className="neon-border" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
          Explore Services <ArrowDown className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  </section>
);

const AboutSection = () => (
  <section id="about" className="py-24">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">About The <span className="text-primary">Clinic</span></h2>
          <p className="text-muted-foreground">
            At Zizo_HealthVerse, we are pioneering the future of medical services. Our mission is to integrate cutting-edge technology with compassionate care, creating a seamless and secure health journey for every individual. We believe in empowering our patients and doctors with the most advanced tools available.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-card/50 border border-primary/20">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <span className="font-semibold">Secure Records</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-card/50 border border-primary/20">
              <Cpu className="h-6 w-6 text-primary" />
              <span className="font-semibold">AI Diagnostics</span>
            </div>
             <div className="flex items-center gap-2 p-3 rounded-lg bg-card/50 border border-primary/20">
              <HeartPulse className="h-6 w-6 text-primary" />
              <span className="font-semibold">24/7 Care</span>
            </div>
          </div>
        </div>
        <div>
          <Card className="glass-pane p-4">
            <Image src="https://picsum.photos/600/400" width={600} height={400} alt="Holographic Hospital" className="rounded-lg" data-ai-hint="holographic hospital" />
          </Card>
        </div>
      </div>
    </div>
  </section>
);

const ServicesSection = () => {
    const services = [
      { name: 'General Consultation', icon: Stethoscope },
      { name: 'Pediatrics', icon: User },
      { name: 'Surgery', icon: Cpu },
      { name: 'Lab Tests', icon: ShieldCheck },
    ];

    return (
        <section className="py-24 bg-card/30">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold">Our <span className="text-accent">Services</span></h2>
                <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">Explore our range of specialized medical services powered by next-generation technology.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                    {services.map(service => (
                        <Card key={service.name} className="glass-pane text-center p-6 group hover:-translate-y-2 transition-transform duration-300 hover:neon-border">
                            <div className="flex justify-center mb-4">
                                <service.icon className="h-12 w-12 text-accent group-hover:neon-glow-accent transition-all"/>
                            </div>
                            <h3 className="text-xl font-bold font-headline">{service.name}</h3>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

const DoctorsSection = () => {
  const doctors = [
    { name: 'Dr. Evelyn Reed', specialty: 'Cybernetics', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    { name: 'Dr. Kenji Tanaka', specialty: 'Genetics', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e' },
    { name: 'Dr. Anya Sharma', specialty: 'Neurology', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f' },
     { name: 'Dr. Jax Oran', specialty: 'Robotics', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a' },
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Our <span className="text-primary">Specialists</span></h2>
         <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">Meet our team of world-class doctors and specialists.</p>
        <Carousel className="w-full max-w-4xl mx-auto mt-12" opts={{loop: true}}>
          <CarouselContent>
            {doctors.map((doctor, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="glass-pane group overflow-hidden">
                    <CardContent className="flex flex-col items-center text-center p-6 space-y-4">
                      <Avatar className="w-24 h-24 border-2 border-accent/50 group-hover:border-accent transition-all">
                        <AvatarImage src={doctor.avatar} alt={doctor.name} />
                        <AvatarFallback>{doctor.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-bold font-headline">{doctor.name}</h3>
                        <p className="text-accent">{doctor.specialty}</p>
                      </div>
                       <Button variant="outline" className="w-full opacity-0 group-hover:opacity-100 transition-opacity neon-border">Book with me</Button>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};


const HowItWorksSection = () => {
    const steps = [
        { title: 'Sign Up / Login' },
        { title: 'Book Appointment' },
        { title: 'Visit Clinic' },
        { title: 'Access Reports Online' },
    ];

    return (
        <section className="py-24 bg-card/30">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold">How It <span className="text-accent">Works</span></h2>
                <div className="relative mt-16">
                     <div className="absolute top-1/2 left-0 w-full h-0.5 bg-primary/20 -translate-y-1/2"></div>
                     <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent animate-pulse"></div>

                    <div className="relative flex justify-between">
                        {steps.map((step, index) => (
                            <div key={index} className="flex flex-col items-center gap-4 z-10 w-1/4">
                                <div className="h-10 w-10 rounded-full bg-background border-2 border-primary flex items-center justify-center neon-border">
                                    <CheckCircle className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="font-headline text-center">{step.title}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};


const CtaBanner = () => (
    <section className="py-24">
        <div className="container mx-auto px-4">
            <Card className="glass-pane neon-border text-center p-8 md:p-16">
                <h2 className="text-3xl md:text-5xl font-bold">Your Health, <br/>Secured by the <span className="neon-glow">Future.</span></h2>
                <div className="mt-8">
                    <Button size="lg" className="btn-gradient animate-pulse-glow" asChild>
                        <Link href="/book">Book Now</Link>
                    </Button>
                </div>
            </Card>
        </div>
    </section>
)

export default function HomePage() {
  return (
    <MainLayout>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <DoctorsSection />
      <HowItWorksSection />
      <CtaBanner />
    </MainLayout>
  );
}
