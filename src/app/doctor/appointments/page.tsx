
'use client';
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AddConsultationNotesDialog } from "@/components/doctor/add-consultation-notes-dialog";


const appointments = [
    { id: 'apt_1', patient: 'John Doe', patientId: 'p_1', service: 'Consultation', date: '2024-10-28', time: '10:00 AM', status: 'Confirmed' },
    { id: 'apt_2', patient: 'Jane Smith', patientId: 'p_2', service: 'Follow-up', date: '2024-10-28', time: '11:30 AM', status: 'Confirmed' },
    { id: 'apt_3', patient: 'Sam Wilson', patientId: 'p_3', service: 'Consultation', date: '2024-10-29', time: '02:00 PM', status: 'Completed' },
];

export type Appointment = typeof appointments[0];

export default function DoctorAppointmentsPage() {
    const router = useRouter();
    const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

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
                                <TableCell className="font-medium">{apt.patient}</TableCell>
                                <TableCell>{apt.service}</TableCell>
                                <TableCell>{apt.date} at {apt.time}</TableCell>
                                <TableCell>
                                    <Badge variant={
                                        apt.status === 'Confirmed' ? 'default' :
                                        apt.status === 'Completed' ? 'secondary' :
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
