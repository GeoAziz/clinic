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
                    <Button size="sm" className="ml-2" variant="outline" onClick={() => { setSelectedNurse(nurse); setShowScheduleModal(true); }}>Edit Schedule</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Assign Patient Modal */}
        {showAssignModal && selectedNurse && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold mb-2">Assign Patient to {selectedNurse.displayName}</h3>
              <input
                type="text"
                placeholder="Patient ID"
                value={assignPatientId}
                onChange={e => setAssignPatientId(e.target.value)}
                className="border rounded px-2 py-1 w-full mb-4"
              />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowAssignModal(false)}>Cancel</Button>
                <Button
                  onClick={async () => {
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
                    // Refresh nurses
                    const res = await fetch("/api/admin/nurses");
                    if (res.ok) {
                      const data = await res.json();
                      setNurses(data);
                    }
                  }}
                  disabled={!assignPatientId || actionLoading}
                >Assign</Button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Schedule Modal */}
        {showScheduleModal && selectedNurse && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold mb-2">Edit Schedule for {selectedNurse.displayName}</h3>
              <div className="space-y-2 mb-4">
                {newSchedule.map((s, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="date"
                      value={s.date}
                      onChange={e => {
                        const updated = [...newSchedule];
                        updated[idx].date = e.target.value;
                        setNewSchedule(updated);
                      }}
                      className="border rounded px-2 py-1"
                    />
                    <input
                      type="text"
                      placeholder="Shift (e.g. Morning)"
                      value={s.shift}
                      onChange={e => {
                        const updated = [...newSchedule];
                        updated[idx].shift = e.target.value;
                        setNewSchedule(updated);
                      }}
                      className="border rounded px-2 py-1"
                    />
                    <Button size="sm" variant="destructive" onClick={() => {
                      setNewSchedule(newSchedule.filter((_, i) => i !== idx));
                    }}>Remove</Button>
                  </div>
                ))}
                <Button size="sm" variant="outline" onClick={() => setNewSchedule([...newSchedule, { date: '', shift: '' }])}>Add Shift</Button>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => { setShowScheduleModal(false); setNewSchedule([]); }}>Cancel</Button>
                <Button
                  onClick={async () => {
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
                    // Refresh nurses
                    const res = await fetch("/api/admin/nurses");
                    if (res.ok) {
                      const data = await res.json();
                      setNurses(data);
                    }
                  }}
                  disabled={actionLoading}
                >Save</Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
