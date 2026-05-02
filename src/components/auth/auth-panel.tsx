"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authService } from "@/lib/services/authService";
import { localStorageMigrationService } from "@/lib/services/localStorageMigrationService";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { useLocale } from "@/lib/i18n";

const localSnapshotEventName = "meu-album-copa:local-snapshot-change";

export function AuthPanel({ firstScreen = false }: { firstScreen?: boolean }) {
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [snapshotKey, setSnapshotKey] = useState("0:0");
  const [albumCount, stickerCount] = snapshotKey.split(":").map(Number);

  useEffect(() => {
    authService.getSession().then((session) => setAuthenticated(Boolean(session)));
  }, []);

  useEffect(() => {
    const updateSnapshot = () => setSnapshotKey(getLocalSnapshotKey());
    updateSnapshot();

    return subscribeToLocalSnapshot(updateSnapshot);
  }, []);

  async function submit(mode: "sign-in" | "sign-up") {
    setStatus("");

    try {
      const result =
        mode === "sign-in"
          ? await authService.signIn(email, password)
          : await authService.signUp(email, password);

      if (result.error) {
        setStatus(getAuthMessage(result.error.message, t));
        return;
      }

      if (mode === "sign-up" && !result.data.session) {
        setAuthenticated(false);
        setStatus(t.emailConfirmationRequired);
        return;
      }

      setAuthenticated(true);
      setStatus(mode === "sign-in" ? t.authSuccess : t.signUpSuccess);
    } catch (error) {
      setStatus(isNetworkError(error) ? t.authNetworkError : t.authGenericError);
    }
  }

  async function migrate() {
    setStatus(t.migrationRunning);

    try {
      const result = await localStorageMigrationService.migrateToSupabase();
      setStatus(
        formatMessage(t.migrationComplete, {
          migratedAlbums: result.migratedAlbums,
          migratedStickers: result.migratedStickers,
          sourceAlbums: result.sourceAlbums,
          sourceStickers: result.sourceStickers,
        }),
      );
      window.dispatchEvent(new Event(localSnapshotEventName));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : t.migrationError);
    }
  }

  return (
    <main className="mx-auto grid min-h-dvh w-full max-w-6xl gap-8 px-5 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
      <section className="space-y-6">
        <div>
          <p className="text-sm font-semibold text-emerald-400">{t.appName}</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-normal sm:text-6xl">
            {t.loginTitle}
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-muted-foreground">
            {t.loginSubtitle}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <HeroStat label="Bolivia" value="ES" />
          <HeroStat label="Brasil" value="PT" />
          <HeroStat label="English" value="EN" />
        </div>
      </section>

      <section className="grid gap-5">
      <Card className="rounded-3xl border-emerald-500/20 bg-card/85">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="size-5 text-yellow-300" />
            {firstScreen ? t.loginTitle : t.authentication}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {!isSupabaseConfigured() ? (
            <p className="rounded-xl bg-muted p-3 text-sm text-muted-foreground">
              {t.authConfig}
            </p>
          ) : null}
          <Input
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t.email}
            type="email"
            value={email}
          />
          <Input
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder={t.password}
            type="password"
            value={password}
          />
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => submit("sign-in")} type="button">
              {t.signIn}
            </Button>
            <Button onClick={() => submit("sign-up")} type="button" variant="outline">
              {t.signUp}
            </Button>
            <Button
              onClick={() => authService.signOut().then(() => setAuthenticated(false))}
              type="button"
              variant="outline"
            >
              {t.signOut}
            </Button>
          </div>
          {authenticated ? (
            <Button asChild className="w-fit" variant="secondary">
              <Link href="/onboarding">
                <ShieldCheck />
                {t.continue}
              </Link>
            </Button>
          ) : null}
        </CardContent>
      </Card>

      <Card className="rounded-3xl bg-card/70">
        <CardHeader>
          <CardTitle>{t.localMigrationTitle}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-sm text-muted-foreground">
            {formatMessage(t.localMigrationDescription, {
              albums: albumCount,
              stickers: stickerCount,
            })}
          </p>
          <Button
            className="w-fit"
            disabled={!authenticated || albumCount === 0}
            onClick={migrate}
            type="button"
          >
            {t.localMigrationButton}
          </Button>
        </CardContent>
      </Card>

      {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
      </section>
    </main>
  );
}

function isNetworkError(error: unknown) {
  return error instanceof TypeError && error.message.toLowerCase().includes("fetch");
}

function getAuthMessage(message: string, t: ReturnType<typeof useLocale>["t"]) {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("email not confirmed")) {
    return t.emailNotConfirmed;
  }

  if (normalizedMessage.includes("rate limit")) {
    return t.authRateLimit;
  }

  return message;
}

function subscribeToLocalSnapshot(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(localSnapshotEventName, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(localSnapshotEventName, callback);
  };
}

function getLocalSnapshotKey() {
  const snapshot = localStorageMigrationService.getLocalSnapshot();
  return `${snapshot.albumCount}:${snapshot.stickerCount}`;
}

function formatMessage(template: string, values: Record<string, number | string>) {
  return Object.entries(values).reduce(
    (message, [key, value]) => message.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
