
'use client';
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import * as admin from 'firebase-admin';

type Appointment = {
    id: string;
    patientName: string;
    doctorName: string;
    service: string;
    date: string;
    time: string;
    status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled' | 'Checked-in';
};

export default function ReceptionistAppointmentPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/appointments');
            if (!res.ok) throw new Error('Failed to fetch appointments');
            const data = await res.json();
            setAppointments(data);
        } catch (err: any) {
            toast({
                variant: 'destructive',
                title: 'Error fetching appointments',
                description: err.message,
            });
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchAppointments();
    }, [toast]);

    const handleCheckIn = async (appointmentId: string) => {
        try {
            const res = await fetch(`/api/receptionist/check-in`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ appointmentId })
            });

            if(!res.ok) throw new Error("Failed to check-in");

            toast({
                title: "Checked-in!",
                description: "Patient has been checked in."
            });
            fetchAppointments(); // Refresh the list
        } catch (err: any)
 {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: err.message
            });
        }
    }

    return (
        <Card className="glass-pane w-full">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="font-headline text-3xl">Appointment Management</CardTitle>
                        <CardDescription>Global view of all scheduled appointments.</CardDescription>
                    </div>
                     <Button className="btn-gradient animate-pulse-glow" asChild>
                        <Link href="/book">New Appointment</Link>
                     </Button>
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-16 w-16 animate-spin text-primary" />
                    </div>
                ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Patient</TableHead>
                            <TableHead>Doctor</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {appointments.map(apt => (
                            <TableRow key={apt.id}>
                                <TableCell className="font-medium">{apt.patientName}</TableCell>
                                <TableCell>{apt.doctorName}</TableCell>
                                <TableCell>{apt.service}</TableCell>
                                <TableCell>{new Date(apt.date).toLocaleDateString()} at {apt.time}</TableCell>
                                <TableCell>
                                    <Badge variant={
                                        apt.status === 'Confirmed' ? 'default' :
                                        apt.status === 'Pending' ? 'secondary' :
                                        apt.status === 'Cancelled' ? 'destructive' :
                                        'outline'
                                    } className={
                                        apt.status === 'Confirmed' ? 'bg-green-500/20 text-green-300 border-green-500/50' : 
                                        apt.status === 'Checked-in' ? 'bg-blue-500/20 text-blue-300 border-blue-500/50' : ''
                                    }>
                                        {apt.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => handleCheckIn(apt.id)} disabled={apt.status !== 'Confirmed'}>
                                                Check-in Patient
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>Reschedule</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">Cancel</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                )}
            </CardContent>
        </Card>
    );
}
