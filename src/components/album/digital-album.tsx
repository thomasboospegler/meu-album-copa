"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";

import { AlbumLoading, AlbumNotFound } from "@/components/album/empty-state";
import { StickerQuantityControls } from "@/components/album/sticker-quantity-controls";
import { useAlbumData } from "@/components/album/use-album-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocale } from "@/lib/i18n";
import { getDuplicateQuantity, hasSticker } from "@/lib/utils/progress";

export function DigitalAlbum({ userAlbumId }: { userAlbumId: string }) {
  const { ready, album, sections, stickers, userStickerMap, increment, decrement } =
    useAlbumData(userAlbumId);
  const { t } = useLocale();
  const pages = useMemo(
    () =>
      Array.from(new Set(stickers.map((sticker) => sticker.pageNumber))).sort(
        (a, b) => a - b,
      ),
    [stickers],
  );
  const [pageIndex, setPageIndex] = useState(0);
  const pageSpread = pages.slice(pageIndex, pageIndex + 2);

  if (!ready) return <AlbumLoading />;
  if (!album) return <AlbumNotFound />;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col gap-6 px-5 py-8 sm:px-6">
      <Header title={t.digitalAlbum} userAlbumId={userAlbumId} />

      <section className="cup-panel overflow-hidden rounded-2xl">
        <div className="stadium-stripe h-1.5" />
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5">
          <Button
            aria-label={t.previousPages}
            disabled={pageIndex === 0}
            onClick={() => setPageIndex((current) => Math.max(0, current - 2))}
            type="button"
            variant="outline"
          >
            <ChevronLeft />
            {t.previousPages}
          </Button>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase text-emerald-200">
              {t.digitalAlbum}
            </p>
            <p className="text-sm text-muted-foreground">
              {pageSpread.map((page) => `${t.pageShort} ${page}`).join(" · ")}
            </p>
          </div>
          <Button
            aria-label={t.nextPages}
            disabled={pageIndex + 2 >= pages.length}
            onClick={() =>
              setPageIndex((current) => Math.min(Math.max(pages.length - 1, 0), current + 2))
            }
            type="button"
            variant="outline"
          >
            {t.nextPages}
            <ChevronRight />
          </Button>
        </div>

        <div className="grid gap-4 p-4 pt-0 lg:grid-cols-2 lg:p-5 lg:pt-0">
          {pageSpread.map((pageNumber) => (
            <AlbumPage
              decrement={decrement}
              increment={increment}
              key={pageNumber}
              pageNumber={pageNumber}
              sections={sections}
              stickers={stickers.filter((sticker) => sticker.pageNumber === pageNumber)}
              userStickerMap={userStickerMap}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

function Header({ title, userAlbumId }: { title: string; userAlbumId: string }) {
  const { t } = useLocale();

  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-3xl font-semibold tracking-normal">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.albumPageHint}</p>
      </div>
      <Button asChild variant="outline">
        <Link href={`/albums/${userAlbumId}`}>{t.dashboard}</Link>
      </Button>
    </div>
  );
}

function AlbumPage({
  decrement,
  increment,
  pageNumber,
  sections,
  stickers,
  userStickerMap,
}: {
  decrement: (officialStickerId: string) => void;
  increment: (officialStickerId: string) => void;
  pageNumber: number;
  sections: ReturnType<typeof useAlbumData>["sections"];
  stickers: ReturnType<typeof useAlbumData>["stickers"];
  userStickerMap: ReturnType<typeof useAlbumData>["userStickerMap"];
}) {
  const { t } = useLocale();
  const section = sections.find(
    (item) => pageNumber >= item.pageStart && pageNumber <= item.pageEnd,
  );

  return (
    <div className="relative min-h-[34rem] rounded-xl border border-white/15 bg-[linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[length:44px_44px] p-4 shadow-inner shadow-black/30">
      <div className="mb-4 flex items-start justify-between gap-3 border-b border-white/10 pb-3">
        <div>
          <p className="text-xs uppercase text-emerald-200">{section?.name ?? t.digitalAlbum}</p>
          <h2 className="text-2xl font-semibold">
            {t.pageShort} {pageNumber}
          </h2>
        </div>
        <Badge variant="secondary">{stickers.length} {t.stickers.toLowerCase()}</Badge>
      </div>

      {stickers.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t.emptyPage}</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
          {stickers.map((sticker) => {
            const userSticker = userStickerMap.get(sticker.id);
            const quantity = userSticker?.quantity ?? 0;
            const collected = hasSticker(userSticker);
            const duplicates = getDuplicateQuantity(userSticker);

            return (
              <Card
                aria-label={`${t.stickerSlot} ${sticker.displayCode}`}
                className="sticker-card min-h-48 cursor-pointer rounded-xl p-2 transition hover:-translate-y-0.5 hover:border-yellow-300/80"
                data-collected={collected}
                key={sticker.id}
                onClick={() => increment(sticker.id)}
              >
                <div className="flex h-full flex-col justify-between gap-3">
                  <div className="rounded-lg border border-dashed border-white/18 bg-black/18 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <Badge>{sticker.displayCode}</Badge>
                      {collected ? <CheckCircle2 className="size-4 text-yellow-300" /> : null}
                    </div>
                    <div className="mt-5 grid place-items-center">
                      <div className="grid size-16 place-items-center rounded-full border-2 border-white/20 text-xs font-semibold text-muted-foreground">
                        {collected ? quantity : "0"}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="line-clamp-2 text-sm font-semibold leading-snug">
                      {sticker.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.officialNumberShort} {sticker.officialNumber} · {sticker.role ?? sticker.stickerType}
                    </p>
                    {duplicates > 0 ? <Badge variant="secondary">x{quantity}</Badge> : null}
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
      )}
    </div>
  );
}
