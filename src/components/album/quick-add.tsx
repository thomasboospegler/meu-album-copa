"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import { AlbumLoading, AlbumNotFound } from "@/components/album/empty-state";
import { StickerQuantityControls } from "@/components/album/sticker-quantity-controls";
import { useAlbumData } from "@/components/album/use-album-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLocale } from "@/lib/i18n";
import { stickerMatchesSearch } from "@/lib/utils/sticker-search";
import type { OfficialSticker } from "@/types/sticker";

export function QuickAdd({ userAlbumId }: { userAlbumId: string }) {
  const { ready, album, stickers, userStickerMap, increment, decrement } =
    useAlbumData(userAlbumId);
  const { t } = useLocale();
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<OfficialSticker[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const matches = useMemo(() => {
    const normalized = query.trim();
    if (!normalized) return [];

    return stickers
      .filter(
        (sticker) =>
          stickerMatchesSearch(normalized, [
            sticker.officialNumber,
            sticker.displayCode,
            sticker.name,
            sticker.teamName,
          ]),
      )
      .slice(0, 8);
  }, [query, stickers]);

  const selected = matches[0];

  function addSticker(sticker: OfficialSticker) {
    increment(sticker.id);
    setRecent((current) => [sticker, ...current.filter((item) => item.id !== sticker.id)].slice(0, 6));
    setQuery("");
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  if (!ready) return <AlbumLoading />;
  if (!album) return <AlbumNotFound />;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-4xl flex-col gap-5 px-5 py-8 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-normal">{t.quickAdd}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t.quickAddHint}</p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/albums/${userAlbumId}`}>{t.dashboard}</Link>
        </Button>
      </div>

      <Card className="cup-panel rounded-2xl">
        <CardContent className="grid gap-4 py-5">
          <Input
            className="h-14 text-lg"
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && selected) {
                addSticker(selected);
              }
            }}
            placeholder={t.quickAddPlaceholder}
            ref={inputRef}
            value={query}
          />

          {selected ? (
            <div className="rounded-xl border border-yellow-300/50 bg-yellow-300/10 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <Badge>{selected.displayCode}</Badge>
                  <p className="mt-2 text-lg font-semibold">{selected.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {t.officialNumberShort} {selected.officialNumber} ·{" "}
                    {selected.teamName ?? selected.stickerType}
                  </p>
                </div>
                <StickerQuantityControls
                  quantity={userStickerMap.get(selected.id)?.quantity ?? 0}
                  onDecrement={() => decrement(selected.id)}
                  onIncrement={() => addSticker(selected)}
                />
              </div>
            </div>
          ) : query ? (
            <p className="text-sm text-muted-foreground">{t.noStickerFound}</p>
          ) : null}

          {matches.length > 1 ? (
            <div className="grid gap-2">
              {matches.slice(1).map((sticker) => (
                <button
                  className="cup-card rounded-xl p-3 text-left hover:border-yellow-300"
                  key={sticker.id}
                  onClick={() => addSticker(sticker)}
                  type="button"
                >
                  <span className="font-medium">{sticker.displayCode}</span>
                  <span className="ml-2 text-muted-foreground">{sticker.name}</span>
                </button>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <section className="grid gap-2">
        <h2 className="text-xl font-semibold">{t.lastAdded}</h2>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t.nothingMarkedSession}</p>
        ) : (
          recent.map((sticker) => (
            <Card className="cup-card rounded-2xl" key={sticker.id}>
              <CardContent className="flex items-center justify-between gap-3 py-3">
                <div>
                  <Badge>{sticker.displayCode}</Badge>
                  <p className="mt-2 font-medium">{sticker.name}</p>
                </div>
                <span className="text-sm text-muted-foreground">
                  {t.quantityShort} {userStickerMap.get(sticker.id)?.quantity ?? 0}
                </span>
              </CardContent>
            </Card>
          ))
        )}
      </section>
    </main>
  );
}
