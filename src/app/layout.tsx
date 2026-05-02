import type { Metadata } from "next";
import { AppFooter } from "@/components/layout/app-footer";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meu Álbum Copa",
  description: "Controle seus álbuns físicos oficiais da Panini.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className="dark h-full antialiased"
    >
      <body
        className="min-h-full bg-background text-foreground"
        suppressHydrationWarning
      >
        <div className="min-h-dvh bg-[radial-gradient(circle_at_15%_15%,rgba(16,185,129,0.22),transparent_28rem),radial-gradient(circle_at_80%_10%,rgba(234,179,8,0.12),transparent_24rem),radial-gradient(circle_at_75%_85%,rgba(59,130,246,0.16),transparent_28rem)]">
          <LanguageSwitcher />
          {children}
          <AppFooter />
        </div>
      </body>
    </html>
  );
}
