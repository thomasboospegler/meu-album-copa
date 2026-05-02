"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n";

export function AlbumNotFound() {
  const { t } = useLocale();

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col justify-center gap-4 px-5 py-10">
      <p className="text-sm font-medium text-muted-foreground">{t.albumNotFound}</p>
      <h1 className="text-3xl font-semibold tracking-normal">{t.createOrChooseAlbum}</h1>
      <p className="text-muted-foreground">{t.albumNotFoundSubtitle}</p>
      <div className="flex gap-2">
        <Button asChild>
          <Link href="/onboarding">{t.newAlbum}</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/albums">{t.myAlbums}</Link>
        </Button>
      </div>
    </main>
  );
}

export function AlbumLoading() {
  const { t } = useLocale();

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col justify-center gap-4 px-5 py-10">
      <div className="cup-panel grid gap-3 rounded-2xl p-6">
        <p className="cup-kicker">{t.appName}</p>
        <h1 className="text-3xl font-semibold tracking-normal">{t.loadingAlbum}</h1>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div className="stadium-stripe h-full w-1/2 animate-pulse rounded-full" />
        </div>
      </div>
    </main>
  );
}
