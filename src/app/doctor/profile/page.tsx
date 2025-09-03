
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DoctorProfilePage() {
    return (
        <Card className="glass-pane w-full">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">My Profile</CardTitle>
                <CardDescription>Manage your public profile and account settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-md">
                <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" defaultValue="Dr. Evelyn Reed" className="glass-pane focus:neon-border" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="specialty">Specialty</Label>
                    <Input id="specialty" defaultValue="Cybernetics" className="glass-pane focus:neon-border" />
                </div>
                <Button>Save Changes</Button>
            </CardContent>
        </Card>
    );
}
