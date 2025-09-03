
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, FileText, MessageSquare, Loader2 } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { AddConsultationNotesDialog } from '@/components/doctor/add-consultation-notes-dialog';
import type { Appointment } from '@/app/doctor/appointments/page';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const PatientChartSkeleton = () => (
    <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Card className="glass-pane">
            <CardHeader className="flex flex-row items-center gap-6 space-y-0">
                <Skeleton className="w-24 h-24 rounded-full" />
                <div className="flex-grow space-y-2">
                    <Skeleton className="h-10 w-1/2" />
                    <Skeleton className="h-6 w-3/4" />
                    <div className="mt-2 flex gap-2">
                        <Skeleton className="h-9 w-28" />
                        <Skeleton className="h-9 w-40" />
                        <Skeleton className="h-9 w-36" />
                    </div>
                </div>
            </CardHeader>
        </Card>
         <div className="grid md:grid-cols-3 gap-6">
            <Skeleton className="h-40 col-span-1" />
            <Skeleton className="h-40 col-span-2" />
        </div>
        <Skeleton className="h-64 w-full" />
    </div>
);


export default function PatientChartPage({ params }: { params: { patientId: string } }) {
    const { patientId } = params;
    const [patient, setPatient] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (!patientId) return;

        const fetchPatientData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/doctor/patients/${patientId}`);
                if (res.status === 404) {
                    notFound();
                }
                if (!res.ok) {
                    throw new Error('Failed to fetch patient data');
                }
                const data = await res.json();
                setPatient(data);
            } catch (error) {
                toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch patient data.' });
            } finally {
                setLoading(false);
            }
        };

        fetchPatientData();
    }, [patientId, toast]);


    if (loading) {
        return <PatientChartSkeleton />;
    }
    
    if (!patient) {
        return null; // Or some other placeholder
    }
    
    const placeholderAppointment: Appointment = {
        id: 'note_new',
        patientName: patient.name,
        patientId: patient.id,
        service: 'General Note',
        date: new Date().toISOString().split('T')[0],
        time: '',
        status: 'Completed'
    };

    return (
        <>
        <div className="space-y-6">
             <Button asChild variant="outline">
                <Link href="/doctor/patients" className="inline-flex items-center gap-2">
                    <ArrowLeft />
                    Back to Patient List
                </Link>
            </Button>
            
            <Card className="glass-pane">
                <CardHeader className="flex flex-row items-center gap-6 space-y-0">
                     <Avatar className="w-24 h-24 border-4 border-primary/50">
                        <AvatarImage src={patient.avatar} />
                        <AvatarFallback>{patient.name?.substring(0,2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                        <CardTitle className="font-headline text-4xl">{patient.name}</CardTitle>
                        <CardDescription className="text-lg">
                            {patient.age} years old &bull; Blood Type: {patient.details.bloodType} &bull; Last Visit: {patient.lastVisit}
                        </CardDescription>
                         <div className="mt-2 flex gap-2">
                           <Button size="sm" onClick={() => setIsNotesDialogOpen(true)}><FileText className="mr-2"/>New Note</Button>
                           <Button size="sm" variant="secondary" asChild>
                               <Link href="/book"><Calendar className="mr-2"/>New Appointment</Link>
                           </Button>
                           <Button size="sm" variant="secondary" asChild>
                               <Link href="/doctor/messages"><MessageSquare className="mr-2"/>Send Message</Link>
                           </Button>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="glass-pane col-span-1">
                    <CardHeader>
                        <CardTitle>Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                       <p><strong>Allergies:</strong> {patient.details.allergies}</p>
                       <p><strong>Conditions:</strong> {patient.details.conditions}</p>
                    </CardContent>
                </Card>
                <Card className="glass-pane col-span-2">
                    <CardHeader>
                        <CardTitle>Upcoming Appointments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {patient.upcomingAppointments?.length > 0 ? (
                             <ul className="space-y-2">
                                {patient.upcomingAppointments.map((apt: any, i: number) => (
                                    <li key={i} className="flex justify-between items-center bg-background/50 p-2 rounded-md">
                                        <span>{new Date(apt.date).toLocaleDateString()} at {apt.time} - {apt.service}</span>
                                        <Button size="sm" variant="ghost" asChild>
                                          <Link href="/doctor/appointments">Details</Link>
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted-foreground">No upcoming appointments.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
             <Card className="glass-pane">
                <CardHeader>
                    <CardTitle>Recent Lab Results</CardTitle>
                </CardHeader>
                <CardContent>
                     {patient.labResults?.length > 0 ? (
                             <ul className="space-y-2">
                                {patient.labResults.map((lab: any) => (
                                    <li key={lab.id} className="flex justify-between items-center bg-background/50 p-2 rounded-md">
                                        <div>
                                            <p className="font-semibold">{lab.testName} ({new Date(lab.date).toLocaleDateString()})</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Badge variant={lab.status === 'Requires Review' ? 'destructive' : 'default'}
                                                className={lab.status === 'Completed' ? 'bg-green-500/20 text-green-300 border-green-500/50' : ''}>
                                                {lab.status}
                                            </Badge>
                                            <Button size="sm" variant="outline" asChild>
                                                <Link href="/doctor/labs">View Report</Link>
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                        <p className="text-muted-foreground">No recent lab results.</p>
                     )}
                </CardContent>
            </Card>

        </div>
        <AddConsultationNotesDialog
            appointment={placeholderAppointment}
            isOpen={isNotesDialogOpen}
            onOpenChange={setIsNotesDialogOpen}
        />
        </>
    );
}
