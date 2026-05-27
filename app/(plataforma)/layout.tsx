import { Sidebar } from "@/app/components/plataforma/Sidebar";
import { MobileNav } from "@/app/components/plataforma/MobileNav";
import { CapturaRapida } from "@/app/components/plataforma/CapturaRapida";
import { BannerEmailTemporario } from "@/app/components/plataforma/BannerEmailTemporario";

export default function PlataformaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen" style={{ background: "#F7F7F5" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden pb-14 md:pb-0">
        <BannerEmailTemporario />
        {children}
      </div>
      <CapturaRapida />
      <MobileNav />
    </div>
  );
}
