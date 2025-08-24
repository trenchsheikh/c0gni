import DocLayout from '@/components/docs/DocLayout';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DocLayout>{children}</DocLayout>;
}