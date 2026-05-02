"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { collectionService } from "@/lib/services/collectionService";
import { useLocale } from "@/lib/i18n";
import { stickerProgressService } from "@/lib/services/stickerProgressService";
import { userAlbumService } from "@/lib/services/userAlbumService";
import type { UserAlbum } from "@/types/album";

export function AlbumsList() {
  const { t } = useLocale();
  const [albums, setAlbums] = useState<UserAlbum[]>([]);

  useEffect(() => {
    queueMicrotask(() => {
      userAlbumService.getAlbumsAsync().then(setAlbums);
    });
  }, []);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col gap-6 px-5 py-8 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="cup-kicker">{t.localControl}</p>
          <h1 className="text-3xl font-semibold tracking-normal">{t.myAlbums}</h1>
          <p className="mt-2 text-muted-foreground">
            {t.albumsSubtitle}
          </p>
        </div>
        <Button asChild>
          <Link href="/onboarding">
            <Plus />
            {t.newAlbum}
          </Link>
        </Button>
      </div>

      {albums.length === 0 ? (
        <Card className="cup-panel rounded-2xl">
          <CardContent className="grid gap-4 py-8">
            <p className="text-muted-foreground">
              {t.noAlbumsYet}
            </p>
            <Button asChild className="w-fit">
              <Link href="/onboarding">{t.addPhysicalAlbum}</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <section className="grid gap-3">
          {albums.map((album) => {
            const collection = collectionService.getCollection(album.collectionId);
            const edition = collectionService.getEdition(album.albumEditionId);
            const stickers = collectionService.getStickers(album.checklistVariantId);
            const progress = stickerProgressService.getAlbumProgress(
              stickers,
              userAlbumService.getUserStickers(album.id),
            );

            return (
              <Card className="cup-card rounded-2xl" key={album.id}>
                <CardHeader>
                  <CardTitle>{album.nickname}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center justify-between gap-4">
                  <div className="grid gap-2 text-sm text-muted-foreground">
                    <span>{collection?.name}</span>
                    <span>{edition?.editionName}</span>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        {progress.completionPercentage}% {t.complete}
                      </Badge>
                      <Badge variant="outline">
                        {progress.duplicates} {t.duplicates.toLowerCase()}
                      </Badge>
                    </div>
                  </div>
                  <Button asChild variant="outline">
                    <Link href={`/albums/${album.id}`}>{t.open}</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </section>
      )}
    </main>
  );
}
