
'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, FileText, MessageSquare } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Mock data - in a real app, this would be fetched from a database
const patientsData: { [key: string]: any } = {
  p_1: { id: 'p_1', name: 'John Doe', age: 34, lastVisit: '2024-10-28', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', details: { bloodType: 'O+', allergies: 'Peanuts', conditions: 'Hypertension' }, upcomingAppointments: [{ date: '2024-11-15', time: '10:00 AM', service: 'Follow-up' }], labResults: [{ id: 'lab_1', testName: 'Complete Blood Count', date: '2024-10-28', status: 'Requires Review' }] },
  p_2: { id: 'p_2', name: 'Jane Smith', age: 45, lastVisit: '2024-10-20', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e', details: { bloodType: 'A-', allergies: 'None', conditions: 'None' }, upcomingAppointments: [], labResults: [{ id: 'lab_2', testName: 'Lipid Panel', date: '2024-10-28', status: 'Completed' }] },
  p_3: { id: 'p_3', name: 'Sam Wilson', age: 28, lastVisit: '2024-09-15', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f', details: { bloodType: 'B+', allergies: 'Pollen', conditions: 'Asthma' }, upcomingAppointments: [{ date: '2024-11-20', time: '02:00 PM', service: 'Annual Checkup' }], labResults: [] },
};

export default function PatientChartPage({ params }: { params: { patientId: string } }) {
    const patient = patientsData[params.patientId];

    if (!patient) {
        notFound();
    }

    return (
        <div className="space-y-6">
             <Button asChild variant="outline">
                <Link href="/doctor/patients" className="inline-flex items-center gap-2">
                    <ArrowLeft />
                    Back to Patient List
                </Link>
            </Button>
            
            <Card className="glass-pane">
                <CardHeader className="flex flex-row items-center gap-6 space-y-0">
                     <Avatar className="w-24 h-24 border-4 border-primary/50">
                        <AvatarImage src={patient.avatar} />
                        <AvatarFallback>{patient.name.substring(0,2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                        <CardTitle className="font-headline text-4xl">{patient.name}</CardTitle>
                        <CardDescription className="text-lg">
                            {patient.age} years old &bull; Blood Type: {patient.details.bloodType} &bull; Last Visit: {patient.lastVisit}
                        </CardDescription>
                         <div className="mt-2 flex gap-2">
                           <Button size="sm"><FileText className="mr-2"/>New Note</Button>
                           <Button size="sm" variant="secondary"><Calendar className="mr-2"/>New Appointment</Button>
                           <Button size="sm" variant="secondary"><MessageSquare className="mr-2"/>Send Message</Button>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="glass-pane col-span-1">
                    <CardHeader>
                        <CardTitle>Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                       <p><strong>Allergies:</strong> {patient.details.allergies}</p>
                       <p><strong>Conditions:</strong> {patient.details.conditions}</p>
                    </CardContent>
                </Card>
                <Card className="glass-pane col-span-2">
                    <CardHeader>
                        <CardTitle>Upcoming Appointments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {patient.upcomingAppointments.length > 0 ? (
                             <ul className="space-y-2">
                                {patient.upcomingAppointments.map((apt: any, i: number) => (
                                    <li key={i} className="flex justify-between items-center bg-background/50 p-2 rounded-md">
                                        <span>{apt.date} at {apt.time} - {apt.service}</span>
                                        <Button size="sm" variant="ghost">Details</Button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted-foreground">No upcoming appointments.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
             <Card className="glass-pane">
                <CardHeader>
                    <CardTitle>Recent Lab Results</CardTitle>
                </CardHeader>
                <CardContent>
                     {patient.labResults.length > 0 ? (
                             <ul className="space-y-2">
                                {patient.labResults.map((lab: any, i: number) => (
                                    <li key={i} className="flex justify-between items-center bg-background/50 p-2 rounded-md">
                                        <div>
                                            <p className="font-semibold">{lab.testName} ({lab.date})</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Badge variant={lab.status === 'Requires Review' ? 'destructive' : 'default'}
                                                className={lab.status === 'Completed' ? 'bg-green-500/20 text-green-300 border-green-500/50' : ''}>
                                                {lab.status}
                                            </Badge>
                                            <Button size="sm" variant="outline" asChild>
                                                <Link href="/doctor/labs">View Report</Link>
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                        <p className="text-muted-foreground">No recent lab results.</p>
                     )}
                </CardContent>
            </Card>

        </div>
    );
}
