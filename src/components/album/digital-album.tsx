"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  MapPin,
  Shield,
  Trophy,
  UsersRound,
} from "lucide-react";

import { AlbumLoading, AlbumNotFound } from "@/components/album/empty-state";
import { StickerQuantityControls } from "@/components/album/sticker-quantity-controls";
import { useAlbumData } from "@/components/album/use-album-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocale } from "@/lib/i18n";
import { getDuplicateQuantity, hasSticker } from "@/lib/utils/progress";

export function DigitalAlbum({ userAlbumId }: { userAlbumId: string }) {
  const { ready, album, collection, edition, sections, stickers, userStickerMap, increment, decrement } =
    useAlbumData(userAlbumId);
  const { t } = useLocale();
  const spreads = useMemo(
    () =>
      buildAlbumSpreads(
        sections,
        collection?.totalPages ?? 112,
        t.albumCover,
        t.pageShort,
      ),
    [collection?.totalPages, sections, t.albumCover, t.pageShort],
  );
  const [spreadIndex, setSpreadIndex] = useState(0);
  const lastSpreadIndex = Math.max(spreads.length - 1, 0);
  const visibleSpreadIndex = Math.min(spreadIndex, lastSpreadIndex);
  const activeSpread = spreads[visibleSpreadIndex];

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
            disabled={visibleSpreadIndex === 0}
            onClick={() => setSpreadIndex(Math.max(0, visibleSpreadIndex - 1))}
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
              {activeSpread?.label ?? t.albumCover}
            </p>
          </div>
          <Button
            aria-label={t.nextPages}
            disabled={visibleSpreadIndex >= lastSpreadIndex}
            onClick={() => setSpreadIndex(Math.min(lastSpreadIndex, visibleSpreadIndex + 1))}
            type="button"
            variant="outline"
          >
            {t.nextPages}
            <ChevronRight />
          </Button>
        </div>

        <div className="grid gap-4 p-4 pt-0 lg:grid-cols-2 lg:p-5 lg:pt-0">
          {activeSpread?.kind === "cover" ? (
            <AlbumCoverPage
              editionName={edition?.productName ?? album.nickname}
              totalPages={collection?.totalPages ?? 112}
              totalStickers={collection?.totalStickers ?? stickers.length}
            />
          ) : (
            activeSpread?.pages.map((pageNumber) => (
              <AlbumPage
                decrement={decrement}
                increment={increment}
                key={pageNumber}
                pageNumber={pageNumber}
                sections={sections}
                stickers={stickers.filter((sticker) => sticker.pageNumber === pageNumber)}
                userStickerMap={userStickerMap}
              />
            ))
          )}
        </div>
      </section>
    </main>
  );
}

type AlbumSpread = {
  id: string;
  kind: "cover" | "pages";
  label: string;
  pages: number[];
};

function buildAlbumSpreads(
  sections: ReturnType<typeof useAlbumData>["sections"],
  totalPages: number,
  coverLabel: string,
  pageLabel: string,
): AlbumSpread[] {
  const sortedSections = [...sections].sort((a, b) => a.pageStart - b.pageStart);
  const spreads: AlbumSpread[] = [
    { id: "cover", kind: "cover", label: coverLabel, pages: [] },
  ];
  let page = 1;

  while (page <= totalPages) {
    const section = sortedSections.find((item) => item.pageStart === page);

    if (section) {
      const sectionPages = makePageRange(section.pageStart, section.pageEnd);

      if (section.sectionType === "team") {
        spreads.push({
          id: section.id,
          kind: "pages",
          label: sectionPages.map((item) => `${pageLabel} ${item}`).join(" · "),
          pages: sectionPages,
        });
      } else {
        for (let index = 0; index < sectionPages.length; index += 2) {
          const pages = sectionPages.slice(index, index + 2);
          spreads.push({
            id: `${section.id}-${pages.join("-")}`,
            kind: "pages",
            label: pages.map((item) => `${pageLabel} ${item}`).join(" · "),
            pages,
          });
        }
      }

      page = section.pageEnd + 1;
      continue;
    }

    const nextSection = sortedSections.find((item) => item.pageStart > page);
    const endPage = Math.min(nextSection?.pageStart ? nextSection.pageStart - 1 : totalPages, totalPages);
    const emptyPages = makePageRange(page, endPage);

    for (let index = 0; index < emptyPages.length; index += 2) {
      const pages = emptyPages.slice(index, index + 2);
      spreads.push({
        id: `editorial-${pages.join("-")}`,
        kind: "pages",
        label: pages.map((item) => `${pageLabel} ${item}`).join(" · "),
        pages,
      });
    }

    page = endPage + 1;
  }

  return spreads;
}

function makePageRange(start: number, end: number) {
  return Array.from({ length: Math.max(end - start + 1, 0) }, (_, index) => start + index);
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

function AlbumCoverPage({
  editionName,
  totalPages,
  totalStickers,
}: {
  editionName: string;
  totalPages: number;
  totalStickers: number;
}) {
  const { t } = useLocale();

  return (
    <div className="relative min-h-[42rem] overflow-hidden rounded-xl border border-white/15 bg-black shadow-2xl shadow-black/40 lg:col-span-2">
      <Image
        alt={t.albumCover}
        className="absolute inset-0 size-full object-cover"
        fill
        priority
        sizes="(min-width: 1024px) 72rem, 100vw"
        src="/album-covers/bolivia-2026-cover.jpg"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      <div className="relative flex h-full min-h-[42rem] flex-col justify-end gap-4 p-6 sm:p-8">
        <Badge className="w-fit bg-yellow-300 text-black">{t.albumCover}</Badge>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-100">
            FIFA World Cup 2026
          </p>
          <h2 className="mt-2 max-w-2xl text-4xl font-semibold tracking-normal text-white sm:text-5xl">
            {editionName}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2 text-sm text-white/80">
          <span className="rounded-full bg-white/12 px-3 py-1">{totalStickers} {t.stickers.toLowerCase()}</span>
          <span className="rounded-full bg-white/12 px-3 py-1">{totalPages} {t.pages.toLowerCase()}</span>
        </div>
      </div>
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
        <div className="grid min-h-[25rem] place-items-center rounded-xl border border-dashed border-white/10 bg-black/15 p-6 text-center">
          <div>
            <p className="text-sm font-semibold text-foreground">{t.editorialPage}</p>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">{t.emptyPage}</p>
          </div>
        </div>
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
                className="sticker-card min-h-52 cursor-pointer rounded-xl p-2 transition hover:-translate-y-0.5 hover:border-yellow-300/80"
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
                    <StickerSlotArt collected={collected} sticker={sticker} />
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

function StickerSlotArt({
  collected,
  sticker,
}: {
  collected: boolean;
  sticker: ReturnType<typeof useAlbumData>["stickers"][number];
}) {
  const Icon =
    sticker.role === "Escudo"
      ? Shield
      : sticker.role === "Equipo"
        ? UsersRound
        : sticker.role === "Especial"
          ? Trophy
          : sticker.name.toLowerCase().includes("host")
            ? MapPin
            : CircleUserRound;

  return (
    <div
      className="mt-4 grid aspect-[4/5] place-items-center overflow-hidden rounded-lg border border-white/10 bg-[radial-gradient(circle_at_30%_20%,rgba(255,220,90,0.28),transparent_34%),linear-gradient(135deg,rgba(74,222,128,0.18),rgba(59,130,246,0.12),rgba(239,68,68,0.10))]"
      data-collected={collected}
    >
      <div className="grid size-14 place-items-center rounded-full border border-white/25 bg-black/20 text-white/80 shadow-inner shadow-black/40">
        <Icon className={collected ? "size-7 text-yellow-200" : "size-7 text-white/45"} />
      </div>
    </div>
  );
}
