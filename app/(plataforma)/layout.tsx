import { Sidebar } from "@/app/components/plataforma/Sidebar";
import { CapturaRapida } from "@/app/components/plataforma/CapturaRapida";

export default function PlataformaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen" style={{ background: "#F7F7F5" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </div>
      <CapturaRapida />
    </div>
  );
}
