
import MainLayout from '@/components/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Rocket, ShieldCheck, Eye } from 'lucide-react';

const MissionCard = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <Card className="glass-pane">
        <CardHeader className="flex flex-row items-center gap-4">
            {icon}
            <CardTitle className="font-headline text-2xl text-accent">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">{children}</p>
        </CardContent>
    </Card>
);

const doctors = [
    { name: 'Dr. Evelyn Reed', specialty: 'Cybernetics', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    { name: 'Dr. Kenji Tanaka', specialty: 'Genetics', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e' },
    { name: 'Dr. Anya Sharma', specialty: 'Neurology', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f' },
     { name: 'Dr. Jax Oran', specialty: 'Robotics', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a' },
];

export default function AboutPage() {
    return (
        <MainLayout>
            <div className="container mx-auto py-16 px-4">
                <section id="hero" className="relative text-center rounded-xl overflow-hidden mb-16">
                     <Image src="https://picsum.photos/1200/400" fill style={{ objectFit: 'cover' }} alt="Holographic Hospital Skyline" className="opacity-20" data-ai-hint="holographic skyline" />
                     <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
                    <div className="relative p-12 md:p-24">
                        <h1 className="text-4xl md:text-6xl font-bold font-headline neon-glow">Where Technology Meets Care</h1>
                        <p className="text-2xl text-primary mt-2">Zizo_ClinicVerse</p>
                    </div>
                </section>

                <section id="mission" className="grid md:grid-cols-3 gap-8 mb-16">
                    <MissionCard icon={<Eye className="w-10 h-10 text-accent" />} title="Our Vision">
                        To create a future where healthcare is not just a service, but a personalized, predictive, and participatory experience for everyone.
                    </MissionCard>
                    <MissionCard icon={<Rocket className="w-10 h-10 text-accent" />} title="Our Mission">
                        To pioneer the integration of artificial intelligence and robotics in clinical practice, delivering unparalleled precision, efficiency, and compassionate care.
                    </MissionCard>
                    <MissionCard icon={<ShieldCheck className="w-10 h-10 text-accent" />} title="Our Values">
                        We are committed to innovation, integrity, and patient empowerment. Your health and data security are our utmost priorities.
                    </MissionCard>
                </section>
                
                <section id="team" className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline mb-8">Team Highlight</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {doctors.map(doctor => (
                            <div key={doctor.name} className="group flex flex-col items-center">
                                <Avatar className="w-24 h-24 border-2 border-primary/50 group-hover:neon-border transition-all duration-300">
                                    <AvatarImage src={doctor.avatar} />
                                    <AvatarFallback>{doctor.name.substring(0,2)}</AvatarFallback>
                                </Avatar>
                                <div className="mt-4 text-center">
                                    <h3 className="font-bold text-lg font-headline opacity-0 group-hover:opacity-100 transition-opacity duration-300 neon-glow-primary">{doctor.name}</h3>
                                    <p className="text-muted-foreground">{doctor.specialty}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section id="cta" className="text-center">
                    <Button size="lg" className="btn-gradient animate-pulse-glow" asChild>
                        <Link href="/doctors">Meet Our Doctors</Link>
                    </Button>
                </section>
            </div>
        </MainLayout>
    );
}
