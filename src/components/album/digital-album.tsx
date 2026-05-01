"use client";

import Link from "next/link";

import { AlbumNotFound } from "@/components/album/empty-state";
import { StickerQuantityControls } from "@/components/album/sticker-quantity-controls";
import { useAlbumData } from "@/components/album/use-album-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getDuplicateQuantity, hasSticker } from "@/lib/utils/progress";

export function DigitalAlbum({ userAlbumId }: { userAlbumId: string }) {
  const { ready, album, sections, stickers, userStickerMap, increment, decrement } =
    useAlbumData(userAlbumId);

  if (!ready) return null;
  if (!album) return <AlbumNotFound />;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-6 px-5 py-8 sm:px-6">
      <Header title="Álbum digital" userAlbumId={userAlbumId} />
      {sections.map((section) => (
        <section className="grid gap-3" key={section.id}>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">{section.name}</h2>
            <Badge variant="secondary">Pág. {section.pageStart}-{section.pageEnd}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {stickers
              .filter((sticker) => sticker.sectionId === section.id)
              .map((sticker) => {
                const userSticker = userStickerMap.get(sticker.id);
                const quantity = userSticker?.quantity ?? 0;
                const collected = hasSticker(userSticker);
                const duplicates = getDuplicateQuantity(userSticker);

                return (
                  <Card
                    className="min-h-40 cursor-pointer rounded-2xl p-3 transition data-[collected=false]:opacity-55"
                    data-collected={collected}
                    key={sticker.id}
                    onClick={() => increment(sticker.id)}
                  >
                    <div className="flex h-full flex-col justify-between gap-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <Badge>{sticker.displayCode}</Badge>
                          {duplicates > 0 ? <Badge variant="secondary">x{quantity}</Badge> : null}
                        </div>
                        <p className="font-medium leading-snug">{sticker.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Nº {sticker.officialNumber} · {sticker.stickerType}
                        </p>
                      </div>
                      <StickerQuantityControls
                        quantity={quantity}
                        onDecrement={() => decrement(sticker.id)}
                        onIncrement={() => increment(sticker.id)}
                      />
                    </div>
                  </Card>
                );
              })}
          </div>
        </section>
      ))}
    </main>
  );
}

function Header({ title, userAlbumId }: { title: string; userAlbumId: string }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-3xl font-semibold tracking-normal">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Clique em uma figurinha para somar +1.
        </p>
      </div>
      <Button asChild variant="outline">
        <Link href={`/albums/${userAlbumId}`}>Dashboard</Link>
      </Button>
    </div>
  );
}
