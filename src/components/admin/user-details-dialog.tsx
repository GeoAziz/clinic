'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  createdAt: string;
}

interface UserDetailsDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailsDialog({ user, open, onOpenChange }: UserDetailsDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] glass-pane">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium">Name</h4>
            <p className="text-sm">{user.name}</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Email</h4>
            <p className="text-sm">{user.email}</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Role</h4>
            <p className="text-sm capitalize">{user.role}</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Status</h4>
            <Badge
              variant={user.status === 'Active' || user.status === 'Online' ? 'default' : 'secondary'}
              className={user.status === 'Active' || user.status === 'Online' ? 'bg-green-500/20 text-green-300 border-green-500/50' : ''}
            >
              {user.status}
            </Badge>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Last Login</h4>
            <p className="text-sm">{user.lastLogin}</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Created At</h4>
            <p className="text-sm">{new Date(user.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
