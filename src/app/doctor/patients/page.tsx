
'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Patient = {
  id: string;
  name: string;
  age: number;
  lastVisit: string;
  avatar: string;
};

export default function DoctorPatientsPage() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/doctor/patients');
                if (!response.ok) {
                    throw new Error('Failed to fetch patients');
                }
                const data = await response.json();
                setPatients(data);
            } catch (error) {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Could not fetch patient data.'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, [toast]);

    return (
        <Card className="glass-pane w-full">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">My Patients</CardTitle>
                <CardDescription>A list of patients under your care.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                     <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-16 w-16 animate-spin text-primary" />
                        <p className="ml-4 text-lg">Loading Patients...</p>
                    </div>
                ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Patient</TableHead>
                            <TableHead>Age</TableHead>
                            <TableHead>Last Visit</TableHead>
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
                                <TableCell>{p.age}</TableCell>
                                <TableCell>{p.lastVisit}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/doctor/patients/${p.id}`}>View Chart</Link>
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
