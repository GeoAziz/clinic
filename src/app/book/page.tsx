
import MainLayout from '@/components/main-layout';
import AppointmentBooking from '@/components/appointment-booking';

export default function BookPage() {
    return (
        <MainLayout>
            <div className="container mx-auto py-16 px-4">
              <AppointmentBooking />
            </div>
        </MainLayout>
    );
}
