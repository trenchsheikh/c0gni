import { Metadata } from 'next';
import DashboardLayoutWrapper from '@/components/dashboard/DashboardLayoutWrapper';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Monitor and manage your AI projects, team performance, and analytics with Cogni Labs dashboard. Get real-time insights into your AI implementations.',
  openGraph: {
    title: 'Cogni Labs Dashboard - AI Project Management',
    description: 'Monitor and manage your AI projects, team performance, and analytics with Cogni Labs dashboard.',
    url: 'https://cognilabs.com/dashboard',
  },
  alternates: {
    canonical: 'https://cognilabs.com/dashboard',
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>;
}