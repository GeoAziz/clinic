
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Users, FilePlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

type AssignedPatient = {
  id: string;
  name: string;
  room: string;
  lastVitalsTime: string;
  avatar: string;
};

export default function AssignedPatientsPage() {
    const [patients, setPatients] = useState<AssignedPatient[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        const fetchPatients = async () => {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                setLoading(false);
                toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
                return;
            }

            try {
                setLoading(true);
                const token = await currentUser.getIdToken();
                const response = await fetch('/api/nurse/patients', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Failed to fetch assigned patients');
                const data = await response.json();
                setPatients(data);
            } catch (error) {
                 toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch your assigned patients.' });
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, [toast]);

    return (
        <Card className="glass-pane w-full">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Assigned Patients</CardTitle>
                <CardDescription>Patients currently under your care for this shift.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-16 w-16 animate-spin text-primary" />
                        <p className="ml-4 text-lg">Loading Patients...</p>
                    </div>
                ) : patients.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground">
                        <Users className="mx-auto h-12 w-12 mb-4" />
                        <h3 className="text-xl font-semibold">No Patients Assigned</h3>
                        <p>You have no patients assigned for your current shift.</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Patient</TableHead>
                                <TableHead>Room</TableHead>
                                <TableHead>Last Vitals Taken</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {patients.map(p => (
                                <TableRow key={p.id}>
                                    <TableCell className="flex items-center gap-4">
                                        <Avatar className="w-10 h-10 border-2 border-primary/50">
                                            <AvatarImage src={p.avatar} />
                                            <AvatarFallback>{p.name.substring(0,2)}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{p.name}</span>
                                    </TableCell>
                                    <TableCell>{p.room}</TableCell>
                                    <TableCell>{p.lastVitalsTime}</TableCell>
                                    <TableCell className="text-right">
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => router.push(`/nurse/vitals?patientId=${p.id}&patientName=${p.name}`)}
                                        >
                                            <FilePlus className="mr-2 h-4 w-4" />
                                            Log Vitals
                                        </Button>
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
