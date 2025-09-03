
'use client';
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { AddConsultationNotesDialog } from "@/components/doctor/add-consultation-notes-dialog";
import { useToast } from "@/hooks/use-toast";

export type Appointment = { 
    id: string; 
    patientName: string; 
    patientId: string; 
    service: string; 
    date: string; 
    time: string; 
    status: 'Confirmed' | 'Completed' | 'Pending' | 'Cancelled';
};

export default function DoctorAppointmentsPage() {
    const router = useRouter();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/doctor/appointments');
                if (!response.ok) {
                    throw new Error('Failed to fetch appointments');
                }
                const data = await response.json();
                setAppointments(data);
            } catch (error) {
                 toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Could not fetch appointment data.'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [toast]);

    const handleOpenNotesDialog = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setIsNotesDialogOpen(true);
    }

    return (
        <>
        <Card className="glass-pane w-full">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="font-headline text-3xl">My Appointments</CardTitle>
                        <CardDescription>View and manage your scheduled appointments.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-16 w-16 animate-spin text-primary" />
                        <p className="ml-4 text-lg">Loading Appointments...</p>
                    </div>
                ) : appointments.length === 0 ? (
                     <div className="text-center py-8 text-muted-foreground">
                        You have no appointments scheduled.
                    </div>
                ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Patient</TableHead>
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
                                <TableCell>{apt.service}</TableCell>
                                <TableCell>{apt.date} at {apt.time}</TableCell>
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
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onSelect={() => router.push(`/doctor/patients/${apt.patientId}`)}>
                                                View Patient Chart
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => handleOpenNotesDialog(apt)}>
                                                Add Consultation Notes
                                            </DropdownMenuItem>
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

        {selectedAppointment && (
            <AddConsultationNotesDialog
                appointment={selectedAppointment}
                isOpen={isNotesDialogOpen}
                onOpenChange={setIsNotesDialogOpen}
            />
        )}
        </>
    );
}
