import DocLayout from '@/components/docs/doc-layout';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DocLayout>{children}</DocLayout>;
}