"use client";

import { useLocale } from "@/lib/i18n";

export function AppFooter() {
  const { t } = useLocale();

  return (
    <footer className="mx-auto w-full max-w-6xl px-5 pb-8 text-xs text-muted-foreground sm:px-6">
      {t.independent}
    </footer>
  );
}
