
'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  LineChart,
  Settings,
  Users,
  Calendar,
  LayoutDashboard,
  Shield,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/users', label: 'User Management', icon: Users },
    { href: '/admin/appointments', label: 'Appointments', icon: Calendar },
    { href: '/admin/analytics', label: 'Analytics', icon: LineChart },
    { href: '/admin/security', label: 'Security & Logs', icon: Shield },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex h-12 items-center px-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary"
            >
              <path
                d="M12 2L2 7V17L12 22L22 17V7L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 7L12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 7L12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 22V12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17 4.5L7 9.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.5"
              />
            </svg>
            <span className="ml-2 font-headline text-lg font-bold text-foreground">
              Zizo Control
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref>
                    <SidebarMenuButton isActive={pathname === item.href}>
                        <item.icon />
                        {item.label}
                    </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center justify-between border-b px-4 lg:justify-end">
          <SidebarTrigger className="lg:hidden" />
          <p>Admin Controls</p>
        </header>
        <div className="p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
