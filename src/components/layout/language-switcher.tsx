"use client";

import { Languages } from "lucide-react";

import { localeLabels, type Locale, useLocale } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="fixed right-4 top-4 z-50 flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-2 text-xs backdrop-blur">
      <Languages className="size-4 text-emerald-300" />
      <select
        aria-label="Language"
        className="bg-transparent text-foreground outline-none"
        onChange={(event) => setLocale(event.target.value as Locale)}
        value={locale}
      >
        {Object.entries(localeLabels).map(([value, label]) => (
          <option className="bg-zinc-950" key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
