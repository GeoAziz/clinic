
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase/client';
import { Badge } from '@/components/ui/badge';

type ScheduleItem = {
  id: string;
  date: string;
  shift: 'Morning' | 'Afternoon' | 'Night';
  department: string;
};

export default function NurseSchedulePage() {
    const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchSchedule = async () => {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                setLoading(false);
                toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
                return;
            }

            try {
                setLoading(true);
                const token = await currentUser.getIdToken();
                const response = await fetch('/api/nurse/schedule', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Failed to fetch schedule');
                const data = await response.json();
                setSchedule(data);
            } catch (error) {
                 toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch your schedule.' });
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();
    }, [toast]);

    return (
        <Card className="glass-pane w-full">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">My Schedule</CardTitle>
                <CardDescription>View your upcoming shifts and assignments.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-16 w-16 animate-spin text-primary" />
                        <p className="ml-4 text-lg">Loading Schedule...</p>
                    </div>
                ) : schedule.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground">
                        <Calendar className="mx-auto h-12 w-12 mb-4" />
                        <h3 className="text-xl font-semibold">No Shifts Scheduled</h3>
                        <p>Your schedule is currently empty. Please check back later.</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Shift</TableHead>
                                <TableHead>Department</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {schedule.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            item.shift === 'Morning' ? 'default' :
                                            item.shift === 'Afternoon' ? 'secondary' :
                                            'outline'
                                        } className={item.shift === 'Night' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50' : ''}>
                                            {item.shift}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{item.department}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
