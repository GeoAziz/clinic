
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DoctorLabsPage() {
    return (
        <Card className="glass-pane w-full">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Lab Results</CardTitle>
                <CardDescription>Review and manage patient lab results.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Lab results functionality coming soon.</p>
            </CardContent>
        </Card>
    );
}
