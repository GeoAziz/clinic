
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DoctorMessagesPage() {
    return (
        <Card className="glass-pane w-full">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Messages</CardTitle>
                <CardDescription>Communicate with patients and other staff.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Messaging functionality coming soon.</p>
            </CardContent>
        </Card>
    );
}
