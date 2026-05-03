"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { AlbumLoading, AlbumNotFound } from "@/components/album/empty-state";
import { StickerQuantityControls } from "@/components/album/sticker-quantity-controls";
import { useAlbumData } from "@/components/album/use-album-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale } from "@/lib/i18n";
import { stickerMatchesSearch } from "@/lib/utils/sticker-search";
import { getDuplicateQuantity, hasSticker } from "@/lib/utils/progress";

export function StickerList({ userAlbumId }: { userAlbumId: string }) {
  const { ready, album, sections, stickers, userStickerMap, increment, decrement } =
    useAlbumData(userAlbumId);
  const { t } = useLocale();
  const [query, setQuery] = useState("");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredStickers = useMemo(() => {
    const normalizedQuery = query.trim();

    return stickers.filter((sticker) => {
      const section = sections.find((item) => item.id === sticker.sectionId);
      const userSticker = userStickerMap.get(sticker.id);
      const quantity = userSticker?.quantity ?? 0;
      const matchesQuery =
        !normalizedQuery ||
        stickerMatchesSearch(normalizedQuery, [
          sticker.officialNumber,
          sticker.displayCode,
          sticker.name,
          sticker.teamName,
          section?.name,
        ]);
      const matchesSection =
        sectionFilter === "all" || sticker.sectionId === sectionFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "owned" && quantity >= 1) ||
        (statusFilter === "missing" && quantity === 0) ||
        (statusFilter === "duplicates" && quantity > 1);
      const matchesType = typeFilter === "all" || sticker.stickerType === typeFilter;

      return matchesQuery && matchesSection && matchesStatus && matchesType;
    });
  }, [query, sectionFilter, sections, statusFilter, stickers, typeFilter, userStickerMap]);

  if (!ready) return <AlbumLoading />;
  if (!album) return <AlbumNotFound />;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-5 px-5 py-8 sm:px-6">
      <PageHeader title={t.stickerList} userAlbumId={userAlbumId} />
      <Card className="cup-panel rounded-2xl">
        <CardContent className="grid gap-3 py-4 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            className="h-10"
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.searchPlaceholder}
            value={query}
          />
          <FilterSelect label={t.section} onChange={setSectionFilter} value={sectionFilter}>
            <SelectItem value="all">{t.allSections}</SelectItem>
            {sections.map((section) => (
              <SelectItem key={section.id} value={section.id}>
                {section.name}
              </SelectItem>
            ))}
          </FilterSelect>
          <FilterSelect label={t.status} onChange={setStatusFilter} value={statusFilter}>
            <SelectItem value="all">{t.all}</SelectItem>
            <SelectItem value="owned">{t.owned}</SelectItem>
            <SelectItem value="missing">{t.missingShort}</SelectItem>
            <SelectItem value="duplicates">{t.duplicates}</SelectItem>
          </FilterSelect>
          <FilterSelect label={t.type} onChange={setTypeFilter} value={typeFilter}>
            <SelectItem value="all">{t.allTypes}</SelectItem>
            <SelectItem value="normal">{t.normal}</SelectItem>
            <SelectItem value="special">{t.special}</SelectItem>
            <SelectItem value="golden-baller">{t.goldenBaller}</SelectItem>
          </FilterSelect>
        </CardContent>
      </Card>

      <section className="grid gap-2">
        {filteredStickers.map((sticker) => {
          const userSticker = userStickerMap.get(sticker.id);
          const quantity = userSticker?.quantity ?? 0;
          return (
            <Card
              className="sticker-card rounded-2xl"
              data-collected={hasSticker(userSticker)}
              key={sticker.id}
            >
              <CardContent className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>{sticker.displayCode}</Badge>
                    <Badge variant={hasSticker(userSticker) ? "secondary" : "outline"}>
                      {hasSticker(userSticker) ? t.ownedBadge : t.missingBadge}
                    </Badge>
                    {getDuplicateQuantity(userSticker) > 0 ? (
                      <Badge variant="secondary">
                        {getDuplicateQuantity(userSticker)} {t.duplicateBadge}
                      </Badge>
                    ) : null}
                  </div>
                  <p className="mt-2 font-medium">{sticker.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {t.officialNumberShort} {sticker.officialNumber} ·{" "}
                    {sticker.teamName ?? sticker.stickerType}
                  </p>
                </div>
                <StickerQuantityControls
                  quantity={quantity}
                  onDecrement={() => decrement(sticker.id)}
                  onIncrement={() => increment(sticker.id)}
                />
              </CardContent>
            </Card>
          );
        })}
      </section>
    </main>
  );
}

function FilterSelect({
  children,
  label,
  onChange,
  value,
}: {
  children: React.ReactNode;
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger aria-label={label} className="h-10 w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </Select>
  );
}

function PageHeader({ title, userAlbumId }: { title: string; userAlbumId: string }) {
  const { t } = useLocale();

  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-3xl font-semibold tracking-normal">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.searchAndAdjust}</p>
      </div>
      <Button asChild variant="outline">
        <Link href={`/albums/${userAlbumId}`}>{t.dashboard}</Link>
      </Button>
    </div>
  );
}
