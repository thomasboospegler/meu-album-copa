import Link from "next/link";
import { BookOpen, ListChecks, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { featuredCollection } from "@/data/panini-world-cup-2026/collection";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-10 px-5 py-8 sm:px-6">
      <section className="flex flex-col gap-6 py-8 sm:py-14">
        <Badge className="w-fit bg-emerald-500 text-white">
          Tracker independente
        </Badge>
        <div className="max-w-3xl space-y-4">
          <h1 className="text-4xl font-semibold tracking-normal text-balance sm:text-5xl">
            Meu Álbum Copa
          </h1>
          <p className="text-lg leading-8 text-muted-foreground">
            Controle seu álbum físico oficial da Panini pela edição que você
            possui, começando por {featuredCollection.name}.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/onboarding">Começar álbum</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/albums">Ver meus álbuns</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="size-5 text-emerald-500" />
              Coleção inicial
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {featuredCollection.totalStickers} figurinhas,{" "}
            {featuredCollection.totalPages} páginas e checklist por edição.
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="size-5 text-emerald-500" />
              Controle real
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Faltantes, repetidas, busca, seções e progresso por figurinha única.
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="size-5 text-emerald-500" />
              Marcação rápida
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Digite número ou código, some +1 e siga marcando sem perder foco.
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
