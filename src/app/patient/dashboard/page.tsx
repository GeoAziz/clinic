
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Appointment {
    doctorName: string;
    date: string;
    service: string;
}

interface DashboardData {
    upcomingAppointment: Appointment | null;
    recentActivity: string | null;
}


const DashboardSkeleton = () => (
    <div className="grid md:grid-cols-2 gap-6">
        <Card className="glass-pane">
            <CardHeader>
                <CardTitle><Skeleton className="h-6 w-48" /></CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-10 w-40 mt-4" />
            </CardContent>
        </Card>
        <Card className="glass-pane">
            <CardHeader>
                <CardTitle><Skeleton className="h-6 w-40" /></CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-10 w-40 mt-4" />
            </CardContent>
        </Card>
    </div>
);


export default function PatientDashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('Patient');
    const { toast } = useToast();

    useEffect(() => {
        const fetchDashboardData = async () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                setUserName(currentUser.displayName || 'Patient');
                try {
                    setLoading(true);
                    const token = await currentUser.getIdToken();
                    const response = await fetch('/api/patient/dashboard', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (!response.ok) {
                        throw new Error('Failed to fetch dashboard data');
                    }
                    const result = await response.json();
                    setData(result);
                } catch (error) {
                    toast({
                        variant: 'destructive',
                        title: 'Error',
                        description: 'Could not fetch your dashboard data.'
                    });
                } finally {
                    setLoading(false);
                }
            } else {
                // Handle case where user is not logged in, though route protection should prevent this.
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [toast]);

  return (
    <div className="grid gap-6">
        <Card className="glass-pane">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Welcome, {userName}</CardTitle>
                <CardDescription>This is your personal health dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Here you can view your upcoming appointments, medical records, and more.</p>
            </CardContent>
        </Card>

        {loading ? (
           <DashboardSkeleton />
        ) : (
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="glass-pane">
                    <CardHeader>
                        <CardTitle>Upcoming Appointment</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {data?.upcomingAppointment ? (
                            <p>You have a {data.upcomingAppointment.service.toLowerCase()} with {data.upcomingAppointment.doctorName} on {new Date(data.upcomingAppointment.date).toLocaleDateString()}.</p>
                        ) : (
                            <p className="text-muted-foreground">You have no upcoming appointments.</p>
                        )}
                        <Button asChild className="mt-4">
                            <Link href="/patient/appointments">View All Appointments</Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card className="glass-pane">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                       {data?.recentActivity ? (
                           <p>{data.recentActivity}</p>
                       ) : (
                           <p className="text-muted-foreground">No new notifications or results.</p>
                       )}
                        <Button asChild className="mt-4">
                            <Link href="/patient/history">View Medical History</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )}
    </div>
  );
}
