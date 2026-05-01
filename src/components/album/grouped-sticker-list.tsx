"use client";

import Link from "next/link";

import { AlbumNotFound } from "@/components/album/empty-state";
import { useAlbumData } from "@/components/album/use-album-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getDuplicateQuantity } from "@/lib/utils/progress";

type GroupedStickerListProps = {
  userAlbumId: string;
  mode: "missing" | "duplicates";
};

export function GroupedStickerList({ mode, userAlbumId }: GroupedStickerListProps) {
  const { ready, album, sections, stickers, userStickerMap } = useAlbumData(userAlbumId);

  if (!ready) return null;
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
            : `${sticker.displayCode} - ${sticker.name} (${duplicates} repetida(s))`;
        }),
      ].join("\n");
    })
    .filter(Boolean)
    .join("\n\n");

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col gap-5 px-5 py-8 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-normal">
            {isMissing ? "Faltantes" : "Repetidas"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isMissing
              ? "Figurinhas com quantity = 0, agrupadas por seção."
              : "Figurinhas com quantity > 1 para troca."}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => navigator.clipboard.writeText(copyText)}
            type="button"
            variant="outline"
          >
            {isMissing ? "Copiar faltantes" : "Copiar troca"}
          </Button>
          <Button asChild variant="outline">
            <Link href={`/albums/${userAlbumId}`}>Dashboard</Link>
          </Button>
        </div>
      </div>

      {visibleStickers.length === 0 ? (
        <Card className="rounded-2xl">
          <CardContent className="py-6 text-muted-foreground">
            {isMissing
              ? "Nenhuma faltante no checklist mockado."
              : "Nenhuma repetida cadastrada ainda."}
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
                <Card className="rounded-2xl" key={sticker.id}>
                  <CardContent className="flex items-center justify-between gap-3 py-3">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <Badge>{sticker.displayCode}</Badge>
                        {!isMissing ? (
                          <Badge variant="secondary">
                            {getDuplicateQuantity(userStickerMap.get(sticker.id))} para troca
                          </Badge>
                        ) : null}
                      </div>
                      <p className="mt-2 font-medium">{sticker.name}</p>
                      <p className="text-sm text-muted-foreground">Nº {sticker.officialNumber}</p>
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
