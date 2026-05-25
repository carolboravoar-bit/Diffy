"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { RocketIcon } from "@/app/components/RocketIcon";
import {
  MessageCircle,
  LayoutDashboard,
  Users,
  Megaphone,
  DollarSign,
  Calendar,
  FileText,
  Zap,
  Settings,
  LogOut,
} from "lucide-react";

const navGroups = [
  {
    label: null,
    items: [
      {
        href: "/decolagem",
        label: "Decolagem",
        icon: RocketIcon,
        destaque: true,
      },
      {
        href: "/conversar",
        label: "Conversar com a Diffy",
        icon: MessageCircle,
      },
      {
        href: "/painel",
        label: "Painel",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Negócio",
    items: [
      { href: "/clientes", label: "Clientes", icon: Users },
      { href: "/marketing", label: "Marketing", icon: Megaphone },
      { href: "/financeiro", label: "Financeiro", icon: DollarSign },
      { href: "/agenda", label: "Agenda", icon: Calendar },
      { href: "/contratos", label: "Contratos", icon: FileText },
    ],
  },
  {
    label: "Estratégia",
    items: [
      { href: "/raiox", label: "RaioX", icon: Zap },
      { href: "/configuracoes", label: "Configurações", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  function isActive(href: string) {
    if (href === "/painel") return pathname === "/painel";
    return pathname.startsWith(href);
  }

  return (
    <aside
      className="hidden md:flex flex-col w-58 flex-shrink-0 h-screen sticky top-0"
      style={{
        width: "224px",
        background: "#ffffff",
        borderRight: "1px solid #EFEFEF",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2.5 px-5 py-4 flex-shrink-0"
        style={{ borderBottom: "1px solid #EFEFEF" }}
      >
        <RocketIcon size={18} />
        <span
          className="text-lg font-bold"
          style={{ fontFamily: "var(--font-playfair)", color: "#2C2C2C" }}
        >
          Diffy<span style={{ color: "#D81B60" }}>.</span>
        </span>
      </div>

      {/* Avatar da Diffy */}
      <div
        className="flex items-center gap-3 px-5 py-3.5 flex-shrink-0"
        style={{ borderBottom: "1px solid #F5F5F5", background: "#FAFAFA" }}
      >
        <div className="relative w-8 h-8 flex-shrink-0">
          <Image
            src="/diffy-personagem.jpg"
            alt="Diffy"
            fill
            className="rounded-full object-cover object-top"
          />
          <span
            className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white"
            style={{ background: "#25D366" }}
          />
        </div>
        <div className="min-w-0">
          <p
            className="text-xs font-semibold truncate"
            style={{ fontFamily: "var(--font-inter)", color: "#2C2C2C" }}
          >
            Diffy
          </p>
          <p
            className="text-xs"
            style={{ fontFamily: "var(--font-inter)", color: "#25D366" }}
          >
            online agora
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {navGroups.map((group, gi) => (
          <div key={gi} className={gi > 0 ? "mt-4" : ""}>
            {group.label && (
              <p
                className="px-3 mb-1.5 text-xs font-semibold uppercase tracking-widest"
                style={{ fontFamily: "var(--font-inter)", color: "#BDBDBD" }}
              >
                {group.label}
              </p>
            )}
            {group.items.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              const destaque = "destaque" in item && item.destaque;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl mb-0.5 transition-all group"
                  style={{
                    background: active
                      ? destaque
                        ? "#D81B60"
                        : "#FCE4EC"
                      : destaque && !active
                      ? "#FFF0F4"
                      : "transparent",
                    color: active
                      ? destaque
                        ? "#ffffff"
                        : "#D81B60"
                      : destaque
                      ? "#D81B60"
                      : "#6B6B6B",
                  }}
                >
                  <Icon
                    size={16}
                    className="flex-shrink-0"
                    style={{
                      color: active
                        ? destaque
                          ? "#ffffff"
                          : "#D81B60"
                        : destaque
                        ? "#D81B60"
                        : "#9E9E9E",
                    }}
                  />
                  <span
                    className="text-sm font-medium flex-1 truncate"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {item.label}
                  </span>
                  {"badge" in item && item.badge && (
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0"
                      style={{
                        background: active ? "rgba(255,255,255,0.25)" : "#FCE4EC",
                        color: active ? "#ffffff" : "#D81B60",
                        fontFamily: "var(--font-inter)",
                        fontSize: "10px",
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Sair */}
      <div className="px-3 py-3 flex-shrink-0" style={{ borderTop: "1px solid #EFEFEF" }}>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl w-full text-left transition-all hover:bg-gray-50"
        >
          <LogOut size={16} style={{ color: "#BDBDBD" }} />
          <span
            className="text-sm font-medium"
            style={{ fontFamily: "var(--font-inter)", color: "#9E9E9E" }}
          >
            Sair
          </span>
        </button>
      </div>
    </aside>
  );
}
