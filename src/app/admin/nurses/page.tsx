"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
          <div>Loading nurses...</div>
        ) : nurses.length === 0 ? (
          <div>No nurses found.</div>
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
                    <Badge variant={nurse.status === "Active" ? "default" : "secondary"}>{nurse.status}</Badge>
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
                          <li key={idx}>{s.date} ({s.shift})</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-muted-foreground">No schedule</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => { setSelectedNurse(nurse); setShowAssignModal(true); }}>Assign Patient</Button>
                    <Button size="sm" className="ml-2" variant="outline" onClick={() => { setSelectedNurse(nurse); setNewSchedule(nurse.schedule || []); setShowScheduleModal(true); }}>Edit Schedule</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {showAssignModal && selectedNurse && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Assign Patient to {selectedNurse.displayName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <input
                        type="text"
                        placeholder="Patient ID"
                        value={assignPatientId}
                        onChange={e => setAssignPatientId(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                    <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={() => setShowAssignModal(false)}>Cancel</Button>
                        <Button onClick={handleAssignPatient} disabled={!assignPatientId || actionLoading}>
                            {actionLoading ? 'Assigning...' : 'Assign'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
          </div>
        )}

        {showScheduleModal && selectedNurse && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
             <Card className="w-full max-w-lg">
                <CardHeader>
                   <CardTitle>Edit Schedule for {selectedNurse.displayName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4 max-h-64 overflow-y-auto p-1">
                    {newSchedule.map((s, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input type="date" value={s.date} onChange={e => { const u = [...newSchedule]; u[idx].date = e.target.value; setNewSchedule(u); }} className="p-2 border rounded"/>
                        <input type="text" placeholder="Shift (e.g. Morning)" value={s.shift} onChange={e => { const u = [...newSchedule]; u[idx].shift = e.target.value; setNewSchedule(u); }} className="flex-grow p-2 border rounded"/>
                        <Button size="sm" variant="destructive" onClick={() => setNewSchedule(newSchedule.filter((_, i) => i !== idx))}>Remove</Button>
                      </div>
                    ))}
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setNewSchedule([...newSchedule, { date: '', shift: '' }])}>Add Shift</Button>
                  <div className="flex gap-2 justify-end mt-4">
                    <Button variant="outline" onClick={() => { setShowScheduleModal(false); setNewSchedule([]); }}>Cancel</Button>
                    <Button onClick={handleUpdateSchedule} disabled={actionLoading}>
                        {actionLoading ? 'Saving...' : 'Save Schedule'}
                    </Button>
                  </div>
                </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
