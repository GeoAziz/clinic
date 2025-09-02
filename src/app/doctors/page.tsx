
import MainLayout from '@/components/main-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, Search } from 'lucide-react';
import Link from 'next/link';

const doctors = [
    { name: 'Dr. Evelyn Reed', specialty: 'Cybernetics', experience: 15, rating: 5, avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    { name: 'Dr. Kenji Tanaka', specialty: 'Genetics', experience: 12, rating: 4, avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e' },
    { name: 'Dr. Anya Sharma', specialty: 'Neurology', experience: 8, rating: 5, avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f' },
    { name: 'Dr. Jax Oran', specialty: 'Robotics', experience: 20, rating: 5, avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a' },
];

const NeonStar = ({ filled }: { filled: boolean }) => (
    <Star className={`w-4 h-4 ${filled ? 'text-primary neon-glow-primary' : 'text-muted-foreground/50'}`} fill={filled ? 'currentColor' : 'none'} />
);

export default function DoctorsPage() {
    return (
        <MainLayout>
            <div className="container mx-auto py-16 px-4">
                <section id="doctors-directory">
                    <h2 className="mb-4 text-center font-headline text-4xl md:text-5xl font-bold">Meet Our <span className="text-primary">Specialists</span></h2>
                    <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">Our team of world-renowned specialists is at the forefront of medical innovation.</p>

                    <div className="mb-12 flex justify-center">
                        <div className="relative w-full max-w-md">
                            <Input placeholder="Search for a doctor or specialty..." className="w-full glass-pane pl-10 h-12 text-lg" />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {doctors.map(doctor => (
                            <Card key={doctor.name} className="glass-pane group overflow-hidden hover:neon-border transition-all duration-300 transform hover:-translate-y-1">
                                <CardContent className="p-6 flex flex-col items-center text-center">
                                    <div className="relative mb-4">
                                        <Avatar className="w-32 h-32 border-4 border-primary/30 group-hover:border-accent transition-all duration-300">
                                            <AvatarImage src={doctor.avatar} alt={doctor.name} />
                                            <AvatarFallback>{doctor.name.substring(0, 2)}</AvatarFallback>
                                        </Avatar>
                                        <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-primary group-hover:animate-pulse-glow"></div>
                                    </div>
                                    <h3 className="text-2xl font-bold font-headline text-foreground">{doctor.name}</h3>
                                    <p className="text-accent text-md font-semibold">{doctor.specialty}</p>
                                    <p className="text-muted-foreground text-sm">{doctor.experience} years of experience</p>
                                    <div className="flex items-center gap-1 my-4">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <NeonStar key={i} filled={i < doctor.rating} />
                                        ))}
                                    </div>
                                    <Button className="w-full btn-gradient mt-2 opacity-0 group-hover:opacity-100 transition-opacity" asChild>
                                        <Link href="/book">Book Appointment</Link>
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
