"use client";

import Link from "next/link";
import { BookOpen, Gauge, List, Repeat2, Search, Zap } from "lucide-react";

import { AlbumNavigation } from "@/components/album/album-navigation";
import { AlbumNotFound } from "@/components/album/empty-state";
import { useAlbumData } from "@/components/album/use-album-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type AlbumDashboardProps = {
  userAlbumId: string;
};

const actions = [
  { href: "digital", label: "Álbum digital", icon: BookOpen },
  { href: "stickers", label: "Lista geral", icon: List },
  { href: "missing", label: "Faltantes", icon: Search },
  { href: "duplicates", label: "Repetidas", icon: Repeat2 },
  { href: "quick-add", label: "Marcação rápida", icon: Zap },
];

export function AlbumDashboard({ userAlbumId }: AlbumDashboardProps) {
  const { ready, album, collection, edition, progress, sectionProgress } =
    useAlbumData(userAlbumId);

  if (!ready) {
    return null;
  }

  if (!album || !collection || !edition) {
    return <AlbumNotFound />;
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-6 px-5 py-8 sm:px-6">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-emerald-500 text-white">Físico Panini</Badge>
          <Badge variant="outline">{edition.country}</Badge>
        </div>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">
              {collection.name}
            </h1>
            <p className="mt-2 text-muted-foreground">{edition.editionName}</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/albums">Meus álbuns</Link>
          </Button>
        </div>
      </div>

      <Card className="rounded-2xl">
        <CardContent className="grid gap-5 py-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Progresso único</p>
              <p className="text-4xl font-semibold">{progress.completionPercentage}%</p>
            </div>
            <Gauge className="size-10 text-emerald-500" />
          </div>
          <Progress className="h-3" value={progress.completionPercentage} />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <Metric label="Total" value={collection.totalStickers} />
            <Metric label="No mock" value={progress.totalStickers} />
            <Metric label="Tenho" value={progress.collectedUnique} />
            <Metric label="Faltam" value={progress.missing} />
            <Metric label="Repetidas" value={progress.duplicates} />
          </div>
          <p className="text-sm text-muted-foreground">
            Especiais coletadas: {progress.specialCollected}
          </p>
        </CardContent>
      </Card>

      <section className="grid gap-3 sm:grid-cols-5">
        {actions.map((action) => (
          <Button asChild className="h-11 justify-start" key={action.href} variant="outline">
            <Link href={`/albums/${userAlbumId}/${action.href}`}>
              <action.icon />
              {action.label}
            </Link>
          </Button>
        ))}
      </section>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Progresso por seção</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {sectionProgress.map((section) => (
            <div className="grid gap-2" key={section.sectionId}>
              <div className="flex justify-between gap-3 text-sm">
                <span className="font-medium">{section.sectionName}</span>
                <span className="text-muted-foreground">
                  {section.collected}/{section.total}
                </span>
              </div>
              <Progress className="h-2" value={section.percentage} />
            </div>
          ))}
        </CardContent>
      </Card>

      <AlbumNavigation userAlbumId={userAlbumId} />
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-muted p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}
