'use client';

import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#0A0A0A] min-h-screen">
      <DashboardSidebar />
      <main className="ml-80 min-h-screen">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}