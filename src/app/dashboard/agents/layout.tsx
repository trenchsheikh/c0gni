export default function AgentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Return children directly without the dashboard layout wrapper
  // This allows the agents page to be full-page
  return <>{children}</>;
}

