
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DoctorDashboardPage() {
  return (
    <div className="grid gap-6">
        <Card className="glass-pane">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Welcome, Doctor</CardTitle>
                <CardDescription>Your clinical dashboard is ready.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Review patient charts, manage appointments, and coordinate care.</p>
            </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
             <Card className="glass-pane">
                <CardHeader>
                    <CardTitle>Today's Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>You have 8 appointments scheduled for today.</p>
                    <Button asChild className="mt-4">
                        <Link href="/doctor/appointments">View Schedule</Link>
                    </Button>
                </CardContent>
            </Card>
             <Card className="glass-pane">
                <CardHeader>
                    <CardTitle>Pending Lab Results</CardTitle>
                </CardHeader>
                <CardContent>
                   <p>There are 3 new lab results that require your review.</p>
                    <Button asChild className="mt-4">
                        <Link href="/doctor/labs">Review Results</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
