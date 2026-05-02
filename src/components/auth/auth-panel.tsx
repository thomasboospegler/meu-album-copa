"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authService } from "@/lib/services/authService";
import { localStorageMigrationService } from "@/lib/services/localStorageMigrationService";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export function AuthPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const snapshot = localStorageMigrationService.getLocalSnapshot();

  useEffect(() => {
    authService.getSession().then((session) => setAuthenticated(Boolean(session)));
  }, []);

  async function submit(mode: "sign-in" | "sign-up") {
    setStatus("");

    try {
      const result =
        mode === "sign-in"
          ? await authService.signIn(email, password)
          : await authService.signUp(email, password);

      if (result.error) {
        setStatus(result.error.message);
        return;
      }

      setAuthenticated(true);
      setStatus(mode === "sign-in" ? "Login realizado." : "Conta criada. Verifique seu email se necessário.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Erro de autenticação.");
    }
  }

  async function migrate() {
    setStatus("Migrando dados locais...");

    try {
      const result = await localStorageMigrationService.migrateToSupabase();
      setStatus(
        `Migração concluída: ${result.migratedAlbums}/${result.sourceAlbums} álbuns e ${result.migratedStickers}/${result.sourceStickers} figurinhas.`,
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Erro ao migrar.");
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col gap-6 px-5 py-8 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-emerald-500">Supabase</p>
          <h1 className="text-3xl font-semibold tracking-normal">Entrar ou criar conta</h1>
          <p className="mt-2 text-muted-foreground">
            Use email e senha para salvar seus álbuns no Supabase. Sem Supabase configurado,
            o app continua usando localStorage.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/">Voltar</Link>
        </Button>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Autenticação</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {!isSupabaseConfigured() ? (
            <p className="rounded-xl bg-muted p-3 text-sm text-muted-foreground">
              Configure `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
            </p>
          ) : null}
          <Input
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="email@exemplo.com"
            type="email"
            value={email}
          />
          <Input
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Senha"
            type="password"
            value={password}
          />
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => submit("sign-in")} type="button">
              Entrar
            </Button>
            <Button onClick={() => submit("sign-up")} type="button" variant="outline">
              Criar conta
            </Button>
            <Button
              onClick={() => authService.signOut().then(() => setAuthenticated(false))}
              type="button"
              variant="outline"
            >
              Sair
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Migrar localStorage</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-sm text-muted-foreground">
            Encontrado localmente: {snapshot.albumCount} álbum(ns) e {snapshot.stickerCount} marcação(ões).
            A migração cria novos álbuns no Supabase e não apaga o localStorage.
          </p>
          <Button
            className="w-fit"
            disabled={!authenticated || snapshot.albumCount === 0}
            onClick={migrate}
            type="button"
          >
            Migrar para Supabase
          </Button>
        </CardContent>
      </Card>

      {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
    </main>
  );
}
