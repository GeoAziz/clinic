'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

type LabResult = {
  id: string;
  testName: string;
  date: string;
  doctorName: string;
  report: string;
};

export default function MedicalHistoryPage() {
    const [history, setHistory] = useState<LabResult[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const [selectedReport, setSelectedReport] = useState<LabResult | null>(null);
    const [isReportOpen, setIsReportOpen] = useState(false);

    useEffect(() => {
        const fetchHistory = async () => {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                setLoading(false);
                toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
                return;
            }

            try {
                setLoading(true);
                const token = await currentUser.getIdToken();
                const response = await fetch('/api/patient/history', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Failed to fetch medical history');
                const data = await response.json();
                setHistory(data);
            } catch (error) {
                 toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch medical history.' });
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [toast]);
    
    const handleViewReport = (result: LabResult) => {
        setSelectedReport(result);
        setIsReportOpen(true);
    };

    return (
        <>
            <Card className="glass-pane w-full">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Medical History</CardTitle>
                    <CardDescription>View your past diagnoses, lab results, and treatments.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader2 className="h-16 w-16 animate-spin text-primary" />
                            <p className="ml-4 text-lg">Loading History...</p>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-16 text-muted-foreground">
                            <FileText className="mx-auto h-12 w-12 mb-4" />
                            <h3 className="text-xl font-semibold">No Medical History Found</h3>
                            <p>Your medical records will appear here after your visits.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Test/Procedure</TableHead>
                                    <TableHead>Doctor</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {history.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                                        <TableCell className="font-medium">{item.testName}</TableCell>
                                        <TableCell>{item.doctorName}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" onClick={() => handleViewReport(item)}>View Report</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
            
            {selectedReport && (
                 <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
                  <DialogContent className="sm:max-w-lg glass-pane">
                    <DialogHeader>
                      <DialogTitle className="font-headline text-2xl">Lab Report: {selectedReport.testName}</DialogTitle>
                      <DialogDescription>
                        Report from {selectedReport.doctorName} on {new Date(selectedReport.date).toLocaleDateString()}.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="text-sm text-muted-foreground bg-background/50 p-4 rounded-md border">
                          {selectedReport.report || 'No report summary available.'}
                        </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={() => setIsReportOpen(false)}>Close</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
            )}
        </>
    );
}
