
import MainLayout from '@/components/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { Phone, Mail, MessageCircle, Bot } from 'lucide-react';

const ContactCard = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <Card className="glass-pane text-center items-center hover:neon-border transition-all">
        <CardHeader>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-2">
                {icon}
            </div>
            <CardTitle className="font-headline text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">{children}</p>
        </CardContent>
    </Card>
);


export default function ContactPage() {
    return (
        <MainLayout>
            <div className="container mx-auto py-16 px-4">
                <section id="hero" className="relative text-center rounded-xl overflow-hidden mb-16 h-64">
                    <Image src="https://picsum.photos/1200/300" fill style={{ objectFit: 'cover' }} alt="Holographic Map" className="opacity-20" data-ai-hint="holographic map" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
                    <div className="relative flex flex-col justify-center items-center h-full">
                        <h1 className="text-4xl md:text-6xl font-bold font-headline neon-glow">Get In Touch</h1>
                        <p className="text-lg text-muted-foreground mt-2">We are here to assist you 24/7.</p>
                    </div>
                </section>

                <section id="contact-options" className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    <ContactCard icon={<Phone className="h-8 w-8 text-primary" />} title="Phone">
                        +1 (555) 123-4567
                    </ContactCard>
                    <ContactCard icon={<Mail className="h-8 w-8 text-primary" />} title="Email">
                        contact@zizo.health
                    </ContactCard>
                    <ContactCard icon={<MessageCircle className="h-8 w-8 text-primary" />} title="Live Chat">
                        Chat with a human
                    </ContactCard>
                    <ContactCard icon={<Bot className="h-8 w-8 text-primary" />} title="AI Assistant">
                        Get instant answers
                    </ContactCard>
                </section>

                <section id="contact-form">
                    <Card className="glass-pane p-4 md:p-8">
                        <CardHeader>
                            <CardTitle className="font-headline text-3xl text-center">Send Us a Message</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <Input type="text" placeholder="Your Name" className="h-12 text-base glass-pane focus:neon-border" />
                                    <Input type="email" placeholder="Your Email" className="h-12 text-base glass-pane focus:neon-border" />
                                </div>
                                <Textarea placeholder="Your Message..." rows={6} className="text-base glass-pane focus:neon-border" />
                                <div className="text-center">
                                    <Button type="submit" size="lg" className="btn-gradient animate-pulse-glow">
                                        Send Message
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </section>
                
                <section id="emergency" className="mt-16 text-center">
                    <Card className="glass-pane p-8 border-destructive/50">
                        <h3 className="text-2xl font-headline text-destructive neon-glow">Emergency? Call Now – 24/7 Response.</h3>
                        <p className="text-4xl font-bold mt-2">+1 (555) 765-4321</p>
                    </Card>
                </section>

            </div>
        </MainLayout>
    );
}
