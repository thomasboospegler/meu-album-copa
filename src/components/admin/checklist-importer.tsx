"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Download, FileCheck2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { checklistImportService, type ChecklistImportPreview } from "@/lib/services/checklistImportService";
import { supabaseAdminCatalogService } from "@/lib/services/supabaseAdminCatalogService";
import { checklistVariants } from "@/data/panini-world-cup-2026/editions";

const exampleCsv = `officialNumber,displayCode,sectionName,sectionCode,name,countryCode,teamName,stickerType,rarityType,role,pageNumber,sortOrder
1,1,Golden Ballers,GB,Messi,ARG,Argentina,special,golden_baller,Forward,1,1
2,2,Golden Ballers,GB,Vinicius Junior,BRA,Brazil,special,golden_baller,Forward,1,2
72,72,Brazil,BRA,Vinicius Junior,BRA,Brazil,normal,,Forward,10,72`;

export function ChecklistImporter() {
  const checklistVariantId = checklistVariants[0].id;
  const [rawInput, setRawInput] = useState(exampleCsv);
  const [preview, setPreview] = useState<ChecklistImportPreview>();
  const [parseError, setParseError] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [savedAt, setSavedAt] = useState("");

  const exportJson = useMemo(() => {
    if (!preview) {
      return "";
    }

    return JSON.stringify(
      {
        checklistVariantId: preview.checklistVariantId,
        sections: preview.sections,
        stickers: preview.stickers,
      },
      null,
      2,
    );
  }, [preview]);

  function handlePreview() {
    setSavedAt("");
    setParseError("");

    try {
      setPreview(checklistImportService.preview(rawInput, checklistVariantId));
    } catch (error) {
      setPreview(undefined);
      setParseError(error instanceof Error ? error.message : "Entrada inválida.");
    }
  }

  async function handleSave() {
    if (!preview || !confirmed) {
      return;
    }

    const importedChecklist = checklistImportService.saveImportedChecklist(preview);
    try {
      await supabaseAdminCatalogService.upsertChecklist(preview);
    } catch {
      // RLS will reject non-admin users; local import remains available for development.
    }
    setSavedAt(importedChecklist.importedAt);
  }

  function handleExport() {
    if (!exportJson) {
      return;
    }

    const blob = new Blob([exportJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "fifa-world-cup-2026-checklist.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-6 px-5 py-8 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-emerald-500">Admin</p>
          <h1 className="text-3xl font-semibold tracking-normal">
            Importar checklist oficial
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Cole CSV ou JSON para estruturar o checklist da coleção Panini FIFA
            World Cup 2026. O salvamento inicial é localStorage, com fronteira
            preparada para Supabase no serviço de importação.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/">Voltar</Link>
        </Button>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Entrada CSV ou JSON</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Textarea
            className="min-h-72 font-mono text-sm"
            onChange={(event) => setRawInput(event.target.value)}
            value={rawInput}
          />
          <div className="flex flex-wrap gap-2">
            <Button onClick={handlePreview} type="button">
              <FileCheck2 />
              Validar e resumir
            </Button>
            <Button
              disabled={!preview}
              onClick={handleExport}
              type="button"
              variant="outline"
            >
              <Download />
              Exportar JSON
            </Button>
          </div>
          {parseError ? (
            <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
              {parseError}
            </p>
          ) : null}
        </CardContent>
      </Card>

      {preview ? (
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Resumo antes de importar</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5">
            <div className="grid gap-3 sm:grid-cols-4">
              <Summary label="Figurinhas" value={preview.totalStickers} />
              <Summary label="Seções" value={preview.totalSections} />
              <Summary label="Duplicadas ignoradas" value={preview.duplicateIgnored} />
              <Summary label="Linhas com erro" value={preview.errors.length} />
            </div>

            <div className="flex flex-wrap gap-2">
              {preview.sections.map((section) => (
                <Badge key={section.id} variant="secondary">
                  {section.code} · {section.name}
                </Badge>
              ))}
            </div>

            {preview.errors.length > 0 ? (
              <div className="rounded-xl border border-destructive/30 p-3">
                <p className="font-medium text-destructive">Erros encontrados</p>
                <ul className="mt-2 grid gap-1 text-sm text-muted-foreground">
                  {preview.errors.slice(0, 10).map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {preview.duplicateOfficialNumbers.length > 0 ? (
              <p className="text-sm text-muted-foreground">
                Duplicadas ignoradas: {preview.duplicateOfficialNumbers.join(", ")}
              </p>
            ) : null}

            <label className="flex items-start gap-3 rounded-xl bg-muted p-3 text-sm">
              <input
                checked={confirmed}
                className="mt-1"
                onChange={(event) => setConfirmed(event.target.checked)}
                type="checkbox"
              />
              <span>
                Confirmo que quero substituir o checklist local desta variante.
                Isso pode afetar a visualização de álbuns existentes; o progresso
                salvo dos usuários não será apagado.
              </span>
            </label>

            <Button
              className="w-fit"
              disabled={!confirmed || preview.totalStickers === 0}
              onClick={handleSave}
              type="button"
            >
              <Upload />
              Importar para localStorage
            </Button>

            {savedAt ? (
              <p className="text-sm text-emerald-500">
                Checklist importado em {new Date(savedAt).toLocaleString("pt-BR")}.
              </p>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </main>
  );
}

function Summary({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-muted p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
