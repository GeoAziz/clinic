import type {Metadata} from 'next';
import { Exo_2, Orbitron } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' });
const exo2 = Exo_2({ subsets: ['latin'], variable: '--font-exo-2' });

export const metadata: Metadata = {
  title: 'Zizo HealthVerse',
  description: 'Reimagining Healthcare in the Sci-Fi Era',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${exo2.variable} ${orbitron.variable} font-body antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
