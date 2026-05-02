"use client";

import Link from "next/link";
import { useState } from "react";

import { AlbumLoading, AlbumNotFound } from "@/components/album/empty-state";
import { useAlbumData } from "@/components/album/use-album-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocale } from "@/lib/i18n";
import { getDuplicateQuantity } from "@/lib/utils/progress";

type GroupedStickerListProps = {
  userAlbumId: string;
  mode: "missing" | "duplicates";
};

export function GroupedStickerList({ mode, userAlbumId }: GroupedStickerListProps) {
  const { ready, album, sections, stickers, userStickerMap } = useAlbumData(userAlbumId);
  const { t } = useLocale();
  const [copyStatus, setCopyStatus] = useState("");

  if (!ready) return <AlbumLoading />;
  if (!album) return <AlbumNotFound />;

  const isMissing = mode === "missing";
  const visibleStickers = stickers.filter((sticker) => {
    const quantity = userStickerMap.get(sticker.id)?.quantity ?? 0;
    return isMissing ? quantity === 0 : quantity > 1;
  });
  const copyText = sections
    .map((section) => {
      const sectionStickers = visibleStickers.filter(
        (sticker) => sticker.sectionId === section.id,
      );
      if (sectionStickers.length === 0) return "";
      return [
        section.name,
        ...sectionStickers.map((sticker) => {
          const duplicates = getDuplicateQuantity(userStickerMap.get(sticker.id));
          return isMissing
            ? `${sticker.displayCode} - ${sticker.name}`
            : `${sticker.displayCode} - ${sticker.name} (${duplicates} ${t.duplicateBadge})`;
        }),
      ].join("\n");
    })
    .filter(Boolean)
    .join("\n\n");

  async function copyList() {
    try {
      await navigator.clipboard.writeText(copyText);
      setCopyStatus(isMissing ? t.copiedMissing : t.copiedTrade);
    } catch {
      setCopyStatus(t.copyFailed);
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col gap-5 px-5 py-8 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-normal">
            {isMissing ? t.missing : t.duplicates}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isMissing ? t.missingDescription : t.duplicatesDescription}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            disabled={!copyText}
            onClick={copyList}
            type="button"
            variant="outline"
          >
            {isMissing ? t.copyMissing : t.copyTrade}
          </Button>
          <Button asChild variant="outline">
            <Link href={`/albums/${userAlbumId}`}>{t.dashboard}</Link>
          </Button>
        </div>
        {copyStatus ? (
          <p className="basis-full text-sm text-muted-foreground">{copyStatus}</p>
        ) : null}
      </div>

      {visibleStickers.length === 0 ? (
        <Card className="cup-card rounded-2xl">
          <CardContent className="py-6 text-muted-foreground">
            {isMissing ? t.noMissing : t.noDuplicates}
          </CardContent>
        </Card>
      ) : (
        sections.map((section) => {
          const sectionStickers = visibleStickers.filter(
            (sticker) => sticker.sectionId === section.id,
          );
          if (sectionStickers.length === 0) return null;

          return (
            <section className="grid gap-2" key={section.id}>
              <h2 className="text-xl font-semibold">{section.name}</h2>
              {sectionStickers.map((sticker) => (
                <Card className="sticker-card rounded-2xl" key={sticker.id}>
                  <CardContent className="flex items-center justify-between gap-3 py-3">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <Badge>{sticker.displayCode}</Badge>
                        {!isMissing ? (
                          <Badge variant="secondary">
                            {getDuplicateQuantity(userStickerMap.get(sticker.id))} {t.forTrade}
                          </Badge>
                        ) : null}
                      </div>
                      <p className="mt-2 font-medium">{sticker.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {t.officialNumberShort} {sticker.officialNumber}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </section>
          );
        })
      )}
    </main>
  );
}
