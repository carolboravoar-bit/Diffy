"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { RocketIcon } from "@/app/components/RocketIcon";
import {
  MessageCircle, LayoutDashboard, Users, Megaphone,
  DollarSign, Calendar, FileText, Zap, Settings, LogOut, X, Grid3X3,
} from "lucide-react";

const navPrimary = [
  { href: "/decolagem", label: "Decolagem", icon: RocketIcon },
  { href: "/conversar", label: "Conversar", icon: MessageCircle },
  { href: "/painel", label: "Painel", icon: LayoutDashboard },
  { href: "/clientes", label: "Clientes", icon: Users },
];

const navSecondary = [
  { href: "/marketing", label: "Marketing", icon: Megaphone },
  { href: "/financeiro", label: "Financeiro", icon: DollarSign },
  { href: "/agenda", label: "Agenda", icon: Calendar },
  { href: "/contratos", label: "Contratos", icon: FileText },
  { href: "/raiox", label: "RaioX", icon: Zap },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [maisAberto, setMaisAberto] = useState(false);

  function isActive(href: string) {
    if (href === "/painel") return pathname === "/painel";
    return pathname.startsWith(href);
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const maisAtivo = navSecondary.some((n) => isActive(n.href));

  return (
    <>
      {maisAberto && (
        <>
          <div
            className="fixed inset-0 z-40 md:hidden"
            style={{ background: "rgba(0,0,0,0.4)" }}
            onClick={() => setMaisAberto(false)}
          />
          <div
            className="fixed left-0 right-0 z-50 md:hidden rounded-t-2xl p-4"
            style={{ background: "#fff", borderTop: "1px solid #EFEFEF", bottom: "56px" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="relative w-7 h-7 flex-shrink-0 rounded-full overflow-hidden">
                  <Image src="/diffy-personagem.jpg" alt="Diffy" fill className="object-cover object-top" />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white" style={{ background: "#25D366" }} />
                </div>
                <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}>
                  Diffy<span style={{ color: "#D81B60" }}>.</span>
                </p>
              </div>
              <button onClick={() => setMaisAberto(false)}>
                <X size={18} style={{ color: "#BDBDBD" }} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              {navSecondary.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMaisAberto(false)}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all"
                    style={{ background: active ? "#FCE4EC" : "#F7F7F5" }}
                  >
                    <Icon size={20} style={{ color: active ? "#D81B60" : "#6B6B6B" }} />
                    <span
                      className="text-xs font-medium text-center"
                      style={{ fontFamily: "var(--font-inter)", color: active ? "#D81B60" : "#6B6B6B" }}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl"
              style={{ background: "#F7F7F5" }}
            >
              <LogOut size={16} style={{ color: "#9E9E9E" }} />
              <span className="text-sm font-medium" style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}>
                Sair
              </span>
            </button>
          </div>
        </>
      )}

      <nav
        className="fixed bottom-0 left-0 right-0 z-30 flex md:hidden"
        style={{
          background: "#fff",
          borderTop: "1px solid #EFEFEF",
          paddingBottom: "env(safe-area-inset-bottom)",
          height: "56px",
        }}
      >
        {navPrimary.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-all"
            >
              <Icon size={20} style={{ color: active ? "#D81B60" : "#9E9E9E" }} />
              <span
                className="text-[10px] font-medium"
                style={{ fontFamily: "var(--font-inter)", color: active ? "#D81B60" : "#9E9E9E" }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
        <button
          className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-all"
          onClick={() => setMaisAberto(!maisAberto)}
        >
          <Grid3X3 size={20} style={{ color: maisAtivo || maisAberto ? "#D81B60" : "#9E9E9E" }} />
          <span
            className="text-[10px] font-medium"
            style={{ fontFamily: "var(--font-inter)", color: maisAtivo || maisAberto ? "#D81B60" : "#9E9E9E" }}
          >
            Mais
          </span>
        </button>
      </nav>
    </>
  );
}
