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
        <div className="cup-shell min-h-dvh">
          <LanguageSwitcher />
          {children}
          <AppFooter />
        </div>
      </body>
    </html>
  );
}
