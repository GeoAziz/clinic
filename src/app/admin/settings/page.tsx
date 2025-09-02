
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
    return (
        <Card className="glass-pane w-full">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Settings</CardTitle>
                <CardDescription>Manage system configuration and security.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="general">
                    <TabsList>
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="security">Security</TabsTrigger>
                        <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    </TabsList>
                    <TabsContent value="general" className="mt-6">
                        <div className="space-y-4 max-w-md">
                            <div className="space-y-2">
                                <Label htmlFor="clinicName">Clinic Name</Label>
                                <Input id="clinicName" defaultValue="Zizo_HealthVerse" className="glass-pane focus:neon-border" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="clinicLogo">Clinic Logo URL</Label>
                                <Input id="clinicLogo" defaultValue="/logo.png" className="glass-pane focus:neon-border" />
                            </div>
                            <Button>Save Changes</Button>
                        </div>
                    </TabsContent>
                    <TabsContent value="security" className="mt-6">
                        <div className="space-y-4 max-w-md">
                            <h3 className="font-semibold">Role Permissions</h3>
                            <p className="text-muted-foreground">Role management coming soon.</p>
                             <h3 className="font-semibold">Access Logs</h3>
                            <p className="text-muted-foreground">Detailed audit trails coming soon.</p>
                        </div>
                    </TabsContent>
                    <TabsContent value="notifications" className="mt-6">
                         <div className="space-y-4 max-w-md">
                            <h3 className="font-semibold">Email Alerts</h3>
                            <p className="text-muted-foreground">Notification settings coming soon.</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
