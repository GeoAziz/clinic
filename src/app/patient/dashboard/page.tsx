
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PatientDashboardPage() {
  return (
    <div className="grid gap-6">
        <Card className="glass-pane">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Welcome, Patient</CardTitle>
                <CardDescription>This is your personal health dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Here you can view your upcoming appointments, medical records, and more.</p>
            </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
             <Card className="glass-pane">
                <CardHeader>
                    <CardTitle>Upcoming Appointment</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>You have a consultation with Dr. Evelyn Reed on Oct 30, 2024.</p>
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
                   <p>Lab results for your recent check-up are available.</p>
                    <Button asChild className="mt-4">
                        <Link href="/patient/history">View Medical History</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
