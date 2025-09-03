
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NurseDashboardPage() {
  return (
    <div className="grid gap-6">
        <Card className="glass-pane">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Welcome, Nurse</CardTitle>
                <CardDescription>Your care coordination hub.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>View your shift schedule, manage patient assignments, and log patient vitals.</p>
            </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
             <Card className="glass-pane">
                <CardHeader>
                    <CardTitle>Current Shift</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>You are assigned to the Pediatrics wing. 5 patients under your care.</p>
                    <Button asChild className="mt-4">
                        <Link href="/nurse/patients">View Assigned Patients</Link>
                    </Button>
                </CardContent>
            </Card>
             <Card className="glass-pane">
                <CardHeader>
                    <CardTitle>Upcoming Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                   <p>Administer medication for Patient ID: P45B2 at 14:00.</p>
                    <Button asChild className="mt-4">
                        <Link href="/nurse/schedule">View Full Schedule</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
