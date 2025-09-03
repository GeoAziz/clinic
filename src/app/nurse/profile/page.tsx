
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase/client';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface NurseProfile {
    displayName: string;
    email: string;
    phone: string;
    department: string;
}

const ProfileSkeleton = () => (
    <CardContent className="space-y-6">
        <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div>
        <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div>
        <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div>
        <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div>
    </CardContent>
);

export default function NurseProfilePage() {
    const [profile, setProfile] = useState<NurseProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const fetchProfile = async () => {
            const currentUser = auth.currentUser;
            if (!currentUser) { setLoading(false); return; }
            try {
                const token = await currentUser.getIdToken();
                const response = await fetch('/api/nurse/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Failed to fetch profile');
                const data = await response.json();
                setProfile(data);
            } catch (error) {
                toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch profile data.' });
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [toast]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!profile) return;
        setProfile({ ...profile, [e.target.id]: e.target.value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const currentUser = auth.currentUser;
        if (!currentUser || !profile) return;
        
        setSaving(true);
        try {
            const token = await currentUser.getIdToken();
            const response = await fetch('/api/nurse/profile', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profile)
            });
            if (!response.ok) throw new Error('Failed to save profile');
            toast({ title: 'Success!', description: 'Your profile has been updated.' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not save profile data.' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card className="glass-pane w-full">
            <form onSubmit={handleSave}>
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">My Profile</CardTitle>
                    <CardDescription>Manage your personal information and account settings.</CardDescription>
                </CardHeader>
                {loading ? <ProfileSkeleton /> : profile && (
                    <CardContent className="space-y-6 max-w-md">
                        <div className="space-y-2">
                            <Label htmlFor="displayName">Full Name</Label>
                            <Input id="displayName" value={profile.displayName} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={profile.email} disabled className="text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" type="tel" value={profile.phone} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="department">Department</Label>
                            <Input id="department" value={profile.department} onChange={handleChange} />
                        </div>
                    </CardContent>
                )}
                <CardFooter>
                     <Button type="submit" disabled={saving || loading}>
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
