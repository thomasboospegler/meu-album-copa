"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { collectionService } from "@/lib/services/collectionService";
import { stickerProgressService } from "@/lib/services/stickerProgressService";
import { userAlbumService } from "@/lib/services/userAlbumService";
import type { UserAlbum } from "@/types/album";

export function AlbumsList() {
  const [albums, setAlbums] = useState<UserAlbum[]>([]);

  useEffect(() => {
    queueMicrotask(() => setAlbums(userAlbumService.getAlbums()));
  }, []);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col gap-6 px-5 py-8 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-emerald-500">Controle local</p>
          <h1 className="text-3xl font-semibold tracking-normal">Meus álbuns</h1>
          <p className="mt-2 text-muted-foreground">
            Álbuns físicos cadastrados neste navegador.
          </p>
        </div>
        <Button asChild>
          <Link href="/onboarding">
            <Plus />
            Novo álbum
          </Link>
        </Button>
      </div>

      {albums.length === 0 ? (
        <Card className="rounded-2xl">
          <CardContent className="grid gap-4 py-8">
            <p className="text-muted-foreground">
              Nenhum álbum criado ainda. Comece escolhendo uma edição física Panini.
            </p>
            <Button asChild className="w-fit">
              <Link href="/onboarding">Adicionar álbum físico</Link>
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
              <Card className="rounded-2xl" key={album.id}>
                <CardHeader>
                  <CardTitle>{album.nickname}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center justify-between gap-4">
                  <div className="grid gap-2 text-sm text-muted-foreground">
                    <span>{collection?.name}</span>
                    <span>{edition?.editionName}</span>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{progress.completionPercentage}% completo</Badge>
                      <Badge variant="outline">{progress.duplicates} repetidas</Badge>
                    </div>
                  </div>
                  <Button asChild variant="outline">
                    <Link href={`/albums/${album.id}`}>Abrir</Link>
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
