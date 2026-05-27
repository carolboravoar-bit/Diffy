import type { Metadata } from "next";
import { Playfair_Display, Caveat, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Diffy — Sua Copilota Estratégica",
  description:
    "Sua copilota estratégica com IA. Fica do seu lado no WhatsApp e num painel web, cuidando do negócio todos os dias.",
  openGraph: {
    title: "Diffy — Sua Copilota Estratégica",
    description:
      "Sua copilota estratégica com IA. Fica do seu lado no WhatsApp e num painel web, cuidando do negócio todos os dias.",
    siteName: "Diffy",
    images: [
      {
        url: "https://diffy-nine.vercel.app/diffy-personagem.jpg",
        width: 400,
        height: 400,
        alt: "Diffy",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${playfair.variable} ${caveat.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
