
'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase/client';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

function VitalsFormSkeleton() {
    return (
        <Card className="glass-pane w-full max-w-4xl mx-auto">
            <CardHeader>
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-20 w-full" />
                </div>
            </CardContent>
            <CardFooter>
                <Skeleton className="h-10 w-32" />
            </CardFooter>
        </Card>
    )
}

function LogVitalsClient() {
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [patientId, setPatientId] = useState('');
    const [patientName, setPatientName] = useState('');
    const [vitals, setVitals] = useState({
        heartRate: '',
        bloodPressure: '',
        temperature: '',
        respiratoryRate: '',
    });
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setPatientId(searchParams.get('patientId') || '');
        setPatientName(searchParams.get('patientName') || 'the selected patient');
    }, [searchParams]);

    const handleVitalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVitals({ ...vitals, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const currentUser = auth.currentUser;
        if (!currentUser) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
            return;
        }

        setIsSubmitting(true);
        try {
            const token = await currentUser.getIdToken();
            const response = await fetch('/api/nurse/vitals', {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ patientId, vitals, notes })
            });

            if (!response.ok) throw new Error('Failed to submit vitals');
            
            toast({ title: 'Vitals Logged!', description: `Vitals for ${patientName} have been successfully recorded.`});
            // Reset form
            setVitals({ heartRate: '', bloodPressure: '', temperature: '', respiratoryRate: '' });
            setNotes('');
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not submit vitals.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="glass-pane w-full max-w-4xl mx-auto">
            <form onSubmit={handleSubmit}>
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Log Patient Vitals</CardTitle>
                    <CardDescription>Enter the latest vital signs for <span className="font-semibold text-primary">{patientName}</span>.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                            <Input id="heartRate" type="number" placeholder="e.g., 72" value={vitals.heartRate} onChange={handleVitalChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bloodPressure">Blood Pressure (mmHg)</Label>
                            <Input id="bloodPressure" type="text" placeholder="e.g., 120/80" value={vitals.bloodPressure} onChange={handleVitalChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="temperature">Temperature (°F)</Label>
                            <Input id="temperature" type="number" step="0.1" placeholder="e.g., 98.6" value={vitals.temperature} onChange={handleVitalChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="respiratoryRate">Respiratory Rate (breaths/min)</Label>
                            <Input id="respiratoryRate" type="number" placeholder="e.g., 16" value={vitals.respiratoryRate} onChange={handleVitalChange} required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea id="notes" placeholder="Add any relevant observations..." value={notes} onChange={e => setNotes(e.target.value)} />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isSubmitting || !patientId}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Submit Vitals
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}

export default function LogVitalsPage() {
    return (
        <Suspense fallback={<VitalsFormSkeleton />}>
            <LogVitalsClient />
        </Suspense>
    )
}
