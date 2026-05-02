"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Album, CheckCircle2, Info } from "lucide-react";

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
  const [country, setCountry] = useState("Chile");
  const [language, setLanguage] = useState("all");
  const [coverType, setCoverType] = useState("all");
  const [coverVariant, setCoverVariant] = useState("all");
  const filters = useMemo(
    () => ({
      country: country === "all" ? undefined : country,
      language: language === "all" ? undefined : language,
      coverType: coverType === "all" ? undefined : coverType,
      coverVariant: coverVariant === "all" ? undefined : coverVariant,
    }),
    [country, coverType, coverVariant, language],
  );
  const filterOptions = collectionService.getEditionFilterOptions(
    collectionId,
    filters,
  );
  const editions = useMemo(
    () => collectionService.getEditions(collectionId, filters),
    [collectionId, filters],
  );
  const [albumEditionId, setAlbumEditionId] = useState(editions[0]?.id ?? "");
  const [nickname, setNickname] = useState("");
  const selectedEdition = editions.find((edition) => edition.id === albumEditionId);
  const selectedCollection = collectionService.getCollection(collectionId);
  const selectedChecklist = selectedEdition
    ? collectionService.getChecklistVariant(selectedEdition.checklistVariantId)
    : undefined;
  const plannedMarkets = collectionService.getPlannedMarkets();

  const canStart = Boolean(collectionId && selectedEdition);

  async function startAlbum() {
    if (!canStart) {
      return;
    }

    const album = await userAlbumService.createAlbumAsync(albumEditionId, nickname);
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

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <FilterSelect
              label="País/região"
              onChange={(value) => {
                setCountry(value);
                setAlbumEditionId("");
              }}
              options={filterOptions.countries}
              value={country}
            />
            <FilterSelect
              label="Idioma"
              onChange={(value) => {
                setLanguage(value);
                setAlbumEditionId("");
              }}
              options={filterOptions.languages}
              value={language}
            />
            <FilterSelect
              label="Tipo de capa"
              onChange={(value) => {
                setCoverType(value);
                setAlbumEditionId("");
              }}
              options={filterOptions.coverTypes}
              value={coverType}
            />
            <FilterSelect
              label="Variante da capa"
              onChange={(value) => {
                setCoverVariant(value);
                setAlbumEditionId("");
              }}
              options={filterOptions.coverVariants}
              value={coverVariant}
            />
          </div>

          <div className="grid gap-3">
            <span className="text-sm font-medium">Versão física do álbum</span>
            {editions.length === 0 ? (
              <p className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">
                Nenhuma edição cadastrada para estes filtros ainda.
              </p>
            ) : (
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
                  <span className="mt-1 block text-xs text-muted-foreground">
                    Checklist: {edition.checklistVariantId}
                  </span>
                </button>
                ))}
              </div>
            )}
          </div>

          {selectedEdition ? (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <div className="mb-3 flex items-center gap-2 font-medium">
                <Info className="size-4 text-emerald-500" />
                Detalhes da edição selecionada
              </div>
              <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
                <EditionDetail label="Produto" value={selectedEdition.productName} />
                <EditionDetail label="País" value={selectedEdition.country} />
                <EditionDetail label="Idioma" value={selectedEdition.language} />
                <EditionDetail label="Tipo de capa" value={selectedEdition.coverType} />
                <EditionDetail label="Variante" value={selectedEdition.coverVariant} />
                <EditionDetail
                  label="Total de figurinhas"
                  value={String(selectedChecklist?.totalStickers ?? selectedCollection?.totalStickers)}
                />
                <EditionDetail
                  label="Total de páginas"
                  value={String(selectedCollection?.totalPages ?? "-")}
                />
                <EditionDetail
                  label="Checklist"
                  value={selectedChecklist?.name ?? selectedEdition.checklistVariantId}
                />
              </div>
            </div>
          ) : null}

          <div className="rounded-2xl bg-muted p-4">
            <p className="text-sm font-medium">Países preparados para cadastro</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {plannedMarkets.map((market) => (
                <span
                  className="rounded-full bg-background px-3 py-1 text-xs text-muted-foreground"
                  key={market.country}
                >
                  {market.country} · {market.languages.join(", ")}
                  {market.enabled ? "" : " · em breve"}
                </span>
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

function FilterSelect({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: string[];
  value: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium">{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-11 w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}

function EditionDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
