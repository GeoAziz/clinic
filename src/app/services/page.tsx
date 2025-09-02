
import MainLayout from '@/components/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Stethoscope, HeartPulse, Shield, Bone, BrainCircuit, Activity } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const services: { name: string; description: string; icon: LucideIcon }[] = [
  { name: 'General Checkup', description: 'Comprehensive health assessments using AI-driven diagnostics.', icon: Stethoscope },
  { name: 'Emergency Care', description: '24/7 rapid response unit for critical situations.', icon: HeartPulse },
  { name: 'Pediatrics', description: 'Specialized care for our youngest patients in a futuristic environment.', icon: Shield },
  { name: 'Surgery', description: 'Advanced robotic-assisted surgical procedures for maximum precision.', icon: Bone },
  { name: 'AI Scan', description: 'Full-body scans with deep learning analysis for early detection.', icon: BrainCircuit },
  { name: 'Diagnostics', description: 'High-throughput lab testing and genetic sequencing.', icon: Activity },
];

export default function ServicesPage() {
    return (
        <MainLayout>
            <div className="container mx-auto py-16 px-4">
                <section id="services">
                    <h2 className="mb-4 text-center font-headline text-4xl md:text-5xl font-bold">Our <span className="text-accent">Services</span></h2>
                    <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">Explore our suite of futuristic healthcare services, designed for precision, prevention, and personalization.</p>
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => (
                        <Card key={service.name} className="glass-pane text-center group hover:neon-border transition-all duration-300 transform hover:-translate-y-2">
                            <CardHeader className="items-center">
                                <div className="p-4 rounded-full bg-accent/10 mb-4 border-2 border-accent/0 group-hover:border-accent/50 transition-all duration-300">
                                    <service.icon className="h-10 w-10 text-accent group-hover:neon-glow-accent" />
                                </div>
                                <CardTitle className="font-headline text-2xl">{service.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-muted-foreground h-12">{service.description}</p>
                                <Button variant="outline" className="w-full opacity-0 group-hover:opacity-100 transition-opacity neon-border" asChild>
                                    <Link href="/book">Book Now</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
