// app/(app)/layout.tsx — new file
export default function AppLayout({ children }: { children: React.ReactNode }) {
    return <div className="min-h-screen">{children}</div>;
  }