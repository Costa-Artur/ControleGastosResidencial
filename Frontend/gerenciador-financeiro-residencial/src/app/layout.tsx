import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Gerenciador Financeiro Residencial",
  description: "Descrição do Gerenciador Financeiro Residencial",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({
  children,
}: Readonly<RootLayoutProps>) {
  return (
    <html
      lang="pt-BR"
      className={cn("font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
