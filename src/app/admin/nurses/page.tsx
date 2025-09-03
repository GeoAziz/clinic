"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Nurse {
  uid: string;
  displayName: string;
  email: string;
  department: string;
  status: string;
  assignedPatients: string[];
  schedule?: { date: string; shift: string }[];
}

export default function NursesPage() {
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [assignPatientId, setAssignPatientId] = useState('');
  const [newSchedule, setNewSchedule] = useState<{ date: string; shift: string }[]>([]);
  const [actionLoading, setActionLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNurses = async () => {
      setLoading(true);
      const res = await fetch("/api/admin/nurses");
      if (res.ok) {
        const data = await res.json();
        setNurses(data);
      }
      setLoading(false);
    };
    fetchNurses();
  }, []);

  const handleAssignPatient = async () => {
    if (!selectedNurse || !assignPatientId) return;
    setActionLoading(true);
    await fetch('/api/admin/nurses/assign-patient', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nurseId: selectedNurse.uid, patientId: assignPatientId })
    });
    toast({ title: 'Patient Assigned!', description: `Patient ${assignPatientId} assigned to ${selectedNurse.displayName}`});
    setActionLoading(false);
    setShowAssignModal(false);
    setAssignPatientId('');
    setSelectedNurse(null);
    const res = await fetch("/api/admin/nurses");
    if (res.ok) setNurses(await res.json());
  };

  const handleUpdateSchedule = async () => {
    if (!selectedNurse) return;
    setActionLoading(true);
    await fetch('/api/admin/nurses/update-schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nurseId: selectedNurse.uid, schedule: newSchedule })
    });
    toast({ title: 'Schedule Updated!', description: `Schedule for ${selectedNurse.displayName} has been updated.`});
    setActionLoading(false);
    setShowScheduleModal(false);
    setNewSchedule([]);
    setSelectedNurse(null);
    const res = await fetch("/api/admin/nurses");
    if (res.ok) setNurses(await res.json());
  };
  
  return (
    <Card className="glass-pane w-full">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Nurse Management</CardTitle>
        <CardDescription>View and manage nurses in the system.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-64"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>
        ) : nurses.length === 0 ? (
          <div className="text-center py-8">No nurses found.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Patients</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nurses.map((nurse) => (
                <TableRow key={nurse.uid}>
                  <TableCell>{nurse.displayName}</TableCell>
                  <TableCell>{nurse.email}</TableCell>
                  <TableCell>{nurse.department || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={nurse.status === "Active" ? "default" : "secondary"} className={nurse.status === "Active" ? 'bg-green-500/20 text-green-300 border-green-500/50' : ''}>{nurse.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {nurse.assignedPatients.length > 0 ? (
                      <ul className="list-disc ml-4">
                        {nurse.assignedPatients.map((pid) => (
                          <li key={pid}>{pid}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-muted-foreground">None</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {nurse.schedule && nurse.schedule.length > 0 ? (
                      <ul className="list-disc ml-4">
                        {nurse.schedule.map((s, idx) => (
                          <li key={idx}>{new Date(s.date).toLocaleDateString()} ({s.shift})</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-muted-foreground">No schedule</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => { setSelectedNurse(nurse); setShowAssignModal(true); }}>Assign Patient</Button>
                    <Button size="sm" className="ml-2" variant="outline" onClick={() => { setSelectedNurse(nurse); setNewSchedule(nurse.schedule?.map(s => ({...s, date: s.date.split('T')[0]})) || []); setShowScheduleModal(true); }}>Edit Schedule</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        
        {/* Assign Patient Dialog */}
        <Dialog open={showAssignModal} onOpenChange={setShowAssignModal}>
            <DialogContent className="glass-pane">
                <DialogHeader>
                    <DialogTitle>Assign Patient to {selectedNurse?.displayName}</DialogTitle>
                    <DialogDescription>Enter the ID of the patient to assign to this nurse.</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-2">
                    <Label htmlFor="patientId">Patient ID</Label>
                    <Input
                        id="patientId"
                        type="text"
                        placeholder="Patient ID"
                        value={assignPatientId}
                        onChange={e => setAssignPatientId(e.target.value)}
                        className="w-full"
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAssignModal(false)}>Cancel</Button>
                    <Button onClick={handleAssignPatient} disabled={!assignPatientId || actionLoading}>
                        {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Assign
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Edit Schedule Dialog */}
        <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
            <DialogContent className="glass-pane sm:max-w-xl">
                 <DialogHeader>
                   <DialogTitle className="font-headline text-2xl">Edit Schedule for {selectedNurse?.displayName}</DialogTitle>
                   <DialogDescription>Add, remove, or modify shifts below.</DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-96 w-full pr-6">
                    <div className="space-y-4 py-4">
                        {newSchedule.map((s, idx) => (
                        <div key={idx} className="flex items-end gap-2 p-2 rounded-md border border-primary/20 bg-background/50">
                            <div className="grid flex-grow gap-1.5">
                                <Label htmlFor={`date-${idx}`}>Date</Label>
                                <Input id={`date-${idx}`} type="date" value={s.date} onChange={e => { const u = [...newSchedule]; u[idx].date = e.target.value; setNewSchedule(u); }}/>
                            </div>
                            <div className="grid flex-grow gap-1.5">
                                <Label htmlFor={`shift-${idx}`}>Shift</Label>
                                <Select value={s.shift} onValueChange={val => { const u = [...newSchedule]; u[idx].shift = val; setNewSchedule(u); }}>
                                  <SelectTrigger id={`shift-${idx}`}>
                                    <SelectValue placeholder="Select shift" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Morning">Morning</SelectItem>
                                    <SelectItem value="Afternoon">Afternoon</SelectItem>
                                    <SelectItem value="Night">Night</SelectItem>
                                  </SelectContent>
                                </Select>
                            </div>
                            <Button size="icon" variant="destructive" onClick={() => setNewSchedule(newSchedule.filter((_, i) => i !== idx))}>
                                <Trash2 className="h-4 w-4"/>
                                <span className="sr-only">Remove shift</span>
                            </Button>
                        </div>
                        ))}
                    </div>
                </ScrollArea>
                <Button size="sm" variant="outline" onClick={() => setNewSchedule([...newSchedule, { date: '', shift: '' }])}>
                    <PlusCircle className="mr-2"/> Add Shift
                </Button>
                <DialogFooter>
                    <Button variant="outline" onClick={() => { setShowScheduleModal(false); setNewSchedule([]); }}>Cancel</Button>
                    <Button onClick={handleUpdateSchedule} disabled={actionLoading}>
                        {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Schedule
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
