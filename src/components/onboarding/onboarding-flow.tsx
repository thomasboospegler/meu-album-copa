"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Lock, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { collectionService } from "@/lib/services/collectionService";
import { userAlbumService } from "@/lib/services/userAlbumService";
import { authService } from "@/lib/services/authService";
import { useLocale } from "@/lib/i18n";
import type { AlbumEdition } from "@/types/collection";

export function OnboardingFlow() {
  const router = useRouter();
  const { t } = useLocale();
  const collections = collectionService.getCollections();
  const collectionId = collections[0]?.id ?? "";
  const featuredCountries = useMemo(
    () => collectionService.getCountries(collectionId),
    [collectionId],
  );
  const [country, setCountry] = useState("Bolívia");
  const [albumEditionId, setAlbumEditionId] = useState("");
  const [nickname, setNickname] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [checkedAuth, setCheckedAuth] = useState(false);

  useEffect(() => {
    authService.getSession().then((session) => {
      setAuthenticated(Boolean(session));
      setCheckedAuth(true);
    });
  }, []);

  const editions = useMemo(
    () =>
      collectionService.getEditions(collectionId, {
        country: country === "all" ? undefined : country,
      }),
    [collectionId, country],
  );
  const selectedEdition =
    editions.find((edition) => edition.id === albumEditionId) ?? editions[0];
  const selectedCollection = collectionService.getCollection(collectionId);
  const selectedChecklist = selectedEdition
    ? collectionService.getChecklistVariant(selectedEdition.checklistVariantId)
    : undefined;

  useEffect(() => {
    if (!albumEditionId && selectedEdition) {
      queueMicrotask(() => setAlbumEditionId(selectedEdition.id));
    }
  }, [albumEditionId, selectedEdition]);

  async function startAlbum() {
    if (!selectedEdition || !authenticated) {
      return;
    }

    const album = await userAlbumService.createAlbumAsync(selectedEdition.id, nickname);
    router.push(`/albums/${album.id}`);
  }

  if (checkedAuth && !authenticated) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-4xl flex-col justify-center gap-5 px-5 py-8 sm:px-6">
        <Badge className="cup-kicker border-0">
          {t.appName}
        </Badge>
        <Card className="cup-panel rounded-2xl">
          <CardContent className="grid gap-4 py-8">
            <Lock className="size-9 text-emerald-400" />
            <h1 className="text-3xl font-semibold tracking-normal">
              {t.accountRequired}
            </h1>
            <p className="text-muted-foreground">
              {t.loginSubtitle}
            </p>
            <Button asChild className="w-fit">
              <Link href="/">{t.signIn}</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col gap-8 px-5 py-8 sm:px-6">
      <section className="grid gap-6 py-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
        <div className="space-y-4">
          <Badge className="cup-kicker border-0">
            {t.appName}
          </Badge>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-normal sm:text-6xl">
            {t.albumSetup}
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
            {t.albumSetupSubtitle}
          </p>
        </div>
        {selectedEdition ? (
          <div className="justify-self-center lg:justify-self-end">
            <StickerPack edition={selectedEdition} size="large" />
          </div>
        ) : null}
      </section>

      <section className="flex flex-wrap gap-2">
        {featuredCountries.map((availableCountry) => (
          <button
            className="cup-card rounded-full px-4 py-2 text-sm transition hover:border-yellow-300 data-[active=true]:border-yellow-300 data-[active=true]:bg-yellow-300/15"
            data-active={country === availableCountry}
            key={availableCountry}
            onClick={() => {
              setCountry(availableCountry);
              setAlbumEditionId("");
            }}
            type="button"
          >
            {availableCountry}
          </button>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {editions.map((edition) => {
          const selected = selectedEdition?.id === edition.id;
          const checklist = collectionService.getChecklistVariant(edition.checklistVariantId);

          return (
            <button
              className="cup-card group rounded-2xl p-4 text-left transition hover:-translate-y-1 hover:border-yellow-300"
              data-selected={selected}
              key={edition.id}
              onClick={() => setAlbumEditionId(edition.id)}
              type="button"
            >
              <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
                <StickerPack edition={edition} />
                <div className="min-w-0 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold">{edition.editionName}</p>
                      <p className="text-sm text-muted-foreground">
                        {edition.productName}
                      </p>
                    </div>
                    {selected ? <CheckCircle2 className="size-5 text-yellow-300" /> : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{edition.country}</Badge>
                    <Badge variant="outline">{edition.language}</Badge>
                    <Badge variant="outline">{edition.coverType}</Badge>
                    <Badge variant="outline">{edition.coverVariant}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {checklist?.name ?? edition.checklistVariantId}
                  </p>
                  {edition.availabilityNote ? (
                    <p className="text-sm text-emerald-300">{edition.availabilityNote}</p>
                  ) : null}
                </div>
              </div>
            </button>
          );
        })}
      </section>

      <Card className="cup-panel rounded-2xl">
        <CardContent className="grid gap-4 py-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <EditionDetail label={t.product} value={selectedEdition?.productName ?? "-"} />
            <EditionDetail label={t.checklist} value={selectedChecklist?.name ?? "-"} />
            <EditionDetail
              label={t.stickers}
              value={String(selectedChecklist?.totalStickers ?? selectedCollection?.totalStickers ?? "-")}
            />
            <EditionDetail
              label={t.pages}
              value={String(selectedCollection?.totalPages ?? "-")}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <Input
              className="h-11 min-w-64"
              onChange={(event) => setNickname(event.target.value)}
              placeholder={t.nickname}
              value={nickname}
            />
            <Button className="h-11" disabled={!selectedEdition} onClick={startAlbum}>
              <Sparkles />
              {t.startTracking}
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

function StickerPack({
  edition,
  size = "default",
}: {
  edition: AlbumEdition;
  size?: "default" | "large";
}) {
  const theme = edition.packTheme ?? "international";
  const themeClass = {
    bolivia: "from-emerald-400 via-yellow-300 to-red-500",
    brazil: "from-yellow-300 via-emerald-400 to-blue-600",
    chile: "from-blue-600 via-white to-red-500",
    international: "from-sky-400 via-emerald-300 to-violet-500",
  }[theme];
  const countryCode = edition.country.slice(0, 3).toUpperCase();

  return (
    <div
      className={`relative mx-auto aspect-[3/4] overflow-hidden rounded-2xl bg-gradient-to-br ${themeClass} p-3 shadow-2xl shadow-black/30 ${size === "large" ? "w-56 sm:w-72" : "w-28"}`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.65)_0_18%,transparent_18%_42%,rgba(0,0,0,0.2)_42%_100%),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] bg-[length:100%_100%,34px_34px]" />
      <div className="relative flex h-full flex-col justify-between rounded-xl border border-white/55 bg-black/20 p-3 text-white">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em]">World Cup</p>
          <p className={`${size === "large" ? "text-3xl" : "text-lg"} font-black leading-none`}>
            2026
          </p>
        </div>
        <div className="grid place-items-center">
          <div className={`${size === "large" ? "size-24" : "size-12"} grid place-items-center rounded-full border-4 border-white/80 bg-white/20`}>
            <div className={`${size === "large" ? "size-10" : "size-5"} rounded-full bg-white/30`} />
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em]">{countryCode}</p>
          <p className="text-xs font-semibold">{edition.coverType}</p>
        </div>
      </div>
    </div>
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
