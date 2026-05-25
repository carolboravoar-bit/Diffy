export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "#F7F7F5" }}>
      {children}
    </div>
  );
}
