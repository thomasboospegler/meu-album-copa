import type { Metadata } from "next";
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
      <body className="min-h-full bg-background text-foreground">
        <div className="min-h-dvh bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_34rem)]">
          {children}
          <footer className="mx-auto w-full max-w-6xl px-5 pb-8 text-xs text-muted-foreground sm:px-6">
            App independente, não afiliado à Panini ou FIFA.
          </footer>
        </div>
      </body>
    </html>
  );
}
