"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Album, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { collectionService } from "@/lib/services/collectionService";
import { userAlbumService } from "@/lib/services/userAlbumService";

export function OnboardingFlow() {
  const router = useRouter();
  const collections = collectionService.getCollections();
  const [collectionId, setCollectionId] = useState(collections[0]?.id ?? "");
  const countries = collectionService.getCountries(collectionId);
  const [country, setCountry] = useState(countries[0] ?? "Chile");
  const editions = useMemo(
    () => collectionService.getEditions(collectionId, country),
    [collectionId, country],
  );
  const [albumEditionId, setAlbumEditionId] = useState(editions[0]?.id ?? "");
  const [nickname, setNickname] = useState("");

  const canStart = Boolean(collectionId && country && albumEditionId);

  function startAlbum() {
    if (!canStart) {
      return;
    }

    const album = userAlbumService.createAlbum(albumEditionId, nickname);
    router.push(`/albums/${album.id}`);
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-4xl flex-col gap-6 px-5 py-8 sm:px-6">
      <div className="space-y-3">
        <p className="text-sm font-semibold text-emerald-500">Meu Álbum Copa</p>
        <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">
          Configure seu álbum físico
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Escolha a coleção, região e versão física para carregar o checklist
          correspondente. Esta versão usa um checklist mockado de desenvolvimento.
        </p>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Album className="size-5 text-emerald-500" />
            Primeira configuração
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-medium">Coleção</span>
            <Select value={collectionId} onValueChange={setCollectionId}>
              <SelectTrigger className="h-11 w-full">
                <SelectValue placeholder="Selecione a coleção" />
              </SelectTrigger>
              <SelectContent>
                {collections.map((collection) => (
                  <SelectItem key={collection.id} value={collection.id}>
                    {collection.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium">País/região</span>
            <Select
              value={country}
              onValueChange={(nextCountry) => {
                setCountry(nextCountry);
                const firstEdition = collectionService.getEditions(
                  collectionId,
                  nextCountry,
                )[0];
                setAlbumEditionId(firstEdition?.id ?? "");
              }}
            >
              <SelectTrigger className="h-11 w-full">
                <SelectValue placeholder="Selecione o país" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((availableCountry) => (
                  <SelectItem key={availableCountry} value={availableCountry}>
                    {availableCountry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <div className="grid gap-3">
            <span className="text-sm font-medium">Versão física do álbum</span>
            <div className="grid gap-2 sm:grid-cols-2">
              {editions.map((edition) => (
                <button
                  className="rounded-xl border border-border bg-card p-4 text-left transition hover:border-emerald-500/70 data-[selected=true]:border-emerald-500 data-[selected=true]:bg-emerald-500/10"
                  data-selected={albumEditionId === edition.id}
                  key={edition.id}
                  onClick={() => setAlbumEditionId(edition.id)}
                  type="button"
                >
                  <span className="flex items-start justify-between gap-3">
                    <span className="font-medium">{edition.editionName}</span>
                    {albumEditionId === edition.id ? (
                      <CheckCircle2 className="size-5 text-emerald-500" />
                    ) : null}
                  </span>
                  <span className="mt-2 block text-sm text-muted-foreground">
                    {edition.coverType} · {edition.coverVariant}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-medium">Apelido do álbum</span>
            <Input
              className="h-11"
              onChange={(event) => setNickname(event.target.value)}
              placeholder="Ex.: Copa 2026 capa dura"
              value={nickname}
            />
          </label>

          <Button className="h-11 w-full sm:w-fit" disabled={!canStart} onClick={startAlbum}>
            Começar meu controle
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
