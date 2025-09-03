'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export type PatientAppointment = { 
    id: string; 
    doctorName: string; 
    service: string; 
    date: string; 
    time: string; 
    status: 'Confirmed' | 'Completed' | 'Pending' | 'Cancelled';
};

const AppointmentsTable = ({ appointments }: { appointments: PatientAppointment[] }) => {
    if (appointments.length === 0) {
        return <p className="text-muted-foreground text-center py-8">No appointments in this category.</p>
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {appointments.map(apt => (
                    <TableRow key={apt.id}>
                        <TableCell className="font-medium">{apt.doctorName}</TableCell>
                        <TableCell>{apt.service}</TableCell>
                        <TableCell>{new Date(apt.date).toLocaleDateString()} at {apt.time}</TableCell>
                        <TableCell>
                            <Badge variant={
                                apt.status === 'Confirmed' ? 'default' :
                                apt.status === 'Completed' ? 'secondary' :
                                apt.status === 'Cancelled' ? 'destructive' :
                                'outline'
                            } className={apt.status === 'Confirmed' ? 'bg-green-500/20 text-green-300 border-green-500/50' : ''}>
                                {apt.status}
                            </Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default function PatientAppointmentsPage() {
    const [appointments, setAppointments] = useState<PatientAppointment[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchAppointments = async () => {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                setLoading(false);
                toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to view appointments.' });
                return;
            }

            try {
                setLoading(true);
                const token = await currentUser.getIdToken();
                const response = await fetch('/api/patient/appointments', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Failed to fetch appointments');
                const data = await response.json();
                setAppointments(data);
            } catch (error) {
                 toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch appointment data.' });
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [toast]);

    const upcomingAppointments = appointments.filter(apt => new Date(apt.date) >= new Date() && apt.status !== 'Completed' && apt.status !== 'Cancelled');
    const pastAppointments = appointments.filter(apt => new Date(apt.date) < new Date() || apt.status === 'Completed' || apt.status === 'Cancelled');

    return (
        <Card className="glass-pane w-full">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">My Appointments</CardTitle>
                <CardDescription>View your upcoming and past appointments.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-16 w-16 animate-spin text-primary" />
                        <p className="ml-4 text-lg">Loading Appointments...</p>
                    </div>
                ) : (
                    <Tabs defaultValue="upcoming" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                            <TabsTrigger value="past">Past</TabsTrigger>
                        </TabsList>
                        <TabsContent value="upcoming">
                           <AppointmentsTable appointments={upcomingAppointments} />
                        </TabsContent>
                        <TabsContent value="past">
                            <AppointmentsTable appointments={pastAppointments} />
                        </TabsContent>
                    </Tabs>
                )}
            </CardContent>
        </Card>
    );
}