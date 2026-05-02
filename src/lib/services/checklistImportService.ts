import type { ChecklistSection } from "@/types/collection";
import type { OfficialSticker, RarityType, StickerType } from "@/types/sticker";
import { readFromLocalStorage, writeToLocalStorage } from "@/lib/storage/local-storage";

const importedChecklistKey = "admin:imported-checklists";

type ImportedChecklist = {
  checklistVariantId: string;
  sections: ChecklistSection[];
  stickers: OfficialSticker[];
  importedAt: string;
};

type ChecklistImportRow = {
  officialNumber?: string;
  displayCode?: string;
  sectionName?: string;
  sectionCode?: string;
  name?: string;
  countryCode?: string;
  teamName?: string;
  stickerType?: string;
  rarityType?: string;
  role?: string;
  pageNumber?: string;
  sortOrder?: string;
};

export type ChecklistImportPreview = {
  checklistVariantId: string;
  sections: ChecklistSection[];
  stickers: OfficialSticker[];
  totalStickers: number;
  totalSections: number;
  duplicateOfficialNumbers: number[];
  duplicateIgnored: number;
  errors: string[];
};

const requiredColumns = ["officialNumber", "displayCode", "sectionName", "name"];

export const checklistImportService = {
  preview(rawInput: string, checklistVariantId: string): ChecklistImportPreview {
    const rows = parseInput(rawInput);
    const errors: string[] = [];
    const sectionByName = new Map<string, ChecklistSection>();
    const seenOfficialNumbers = new Set<number>();
    const duplicateOfficialNumbers: number[] = [];
    const stickers: OfficialSticker[] = [];

    rows.forEach((row, rowIndex) => {
      const rowNumber = rowIndex + 2;
      const missingColumns = requiredColumns.filter(
        (column) => !String(row[column as keyof ChecklistImportRow] ?? "").trim(),
      );

      if (missingColumns.length > 0) {
        errors.push(`Linha ${rowNumber}: faltando ${missingColumns.join(", ")}.`);
        return;
      }

      const officialNumber = toNumber(row.officialNumber);
      if (!officialNumber) {
        errors.push(`Linha ${rowNumber}: officialNumber inválido.`);
        return;
      }

      if (seenOfficialNumbers.has(officialNumber)) {
        duplicateOfficialNumbers.push(officialNumber);
        return;
      }

      seenOfficialNumbers.add(officialNumber);

      const sectionName = String(row.sectionName).trim();
      const sectionCode = String(row.sectionCode || sectionName.slice(0, 3)).trim();
      const sectionKey = sectionName.toLowerCase();
      const pageNumber = toNumber(row.pageNumber) || 1;
      const sortOrder = toNumber(row.sortOrder) || officialNumber;
      let section = sectionByName.get(sectionKey);

      if (!section) {
        section = {
          id: `${checklistVariantId}-${slugify(sectionCode || sectionName)}`,
          checklistVariantId,
          name: sectionName,
          code: sectionCode || slugify(sectionName).toUpperCase(),
          sectionType: inferSectionType(sectionName, row.stickerType),
          sortOrder: sectionByName.size + 1,
          pageStart: pageNumber,
          pageEnd: pageNumber,
        };
        sectionByName.set(sectionKey, section);
      } else {
        section.pageStart = Math.min(section.pageStart, pageNumber);
        section.pageEnd = Math.max(section.pageEnd, pageNumber);
      }

      stickers.push({
        id: `${checklistVariantId}-${officialNumber}`,
        checklistVariantId,
        sectionId: section.id,
        officialNumber,
        displayCode: String(row.displayCode).trim(),
        name: String(row.name).trim(),
        countryCode: emptyToUndefined(row.countryCode),
        teamName: emptyToUndefined(row.teamName),
        stickerType: normalizeStickerType(row.stickerType, row.rarityType),
        rarityType: normalizeRarityType(row.rarityType),
        role: emptyToUndefined(row.role),
        pageNumber,
        sortOrder,
      });
    });

    const sections = Array.from(sectionByName.values()).sort(
      (a, b) => a.sortOrder - b.sortOrder,
    );

    return {
      checklistVariantId,
      sections,
      stickers: stickers.sort((a, b) => a.sortOrder - b.sortOrder),
      totalStickers: stickers.length,
      totalSections: sections.length,
      duplicateOfficialNumbers,
      duplicateIgnored: duplicateOfficialNumbers.length,
      errors,
    };
  },

  saveImportedChecklist(preview: ChecklistImportPreview) {
    const nextChecklist: ImportedChecklist = {
      checklistVariantId: preview.checklistVariantId,
      sections: preview.sections,
      stickers: preview.stickers,
      importedAt: new Date().toISOString(),
    };
    const checklists = readFromLocalStorage<Record<string, ImportedChecklist>>(
      importedChecklistKey,
      {},
    );

    writeToLocalStorage(importedChecklistKey, {
      ...checklists,
      [preview.checklistVariantId]: nextChecklist,
    });

    // Supabase-ready boundary: replace this storage write with an upsert into
    // checklist_sections and official_stickers for the same checklistVariantId.
    return nextChecklist;
  },

  getImportedChecklist(checklistVariantId: string) {
    const checklists = readFromLocalStorage<Record<string, ImportedChecklist>>(
      importedChecklistKey,
      {},
    );

    return checklists[checklistVariantId];
  },
};

function parseInput(rawInput: string): ChecklistImportRow[] {
  const trimmedInput = rawInput.trim();

  if (!trimmedInput) {
    return [];
  }

  if (trimmedInput.startsWith("{") || trimmedInput.startsWith("[")) {
    const parsed = JSON.parse(trimmedInput) as
      | ChecklistImportRow[]
      | { stickers?: ChecklistImportRow[] };
    return Array.isArray(parsed) ? parsed : (parsed.stickers ?? []);
  }

  return parseCsv(trimmedInput);
}

function parseCsv(input: string): ChecklistImportRow[] {
  const lines = input.split(/\r?\n/).filter(Boolean);
  const headers = splitCsvLine(lines[0]).map((header) => header.trim());

  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    return headers.reduce<ChecklistImportRow>((row, header, index) => {
      return { ...row, [header]: values[index]?.trim() ?? "" };
    }, {});
  });
}

function splitCsvLine(line: string) {
  const values: string[] = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"' && quoted && nextChar === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (char === "," && !quoted) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
}

function toNumber(value?: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function emptyToUndefined(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function inferSectionType(
  sectionName: string,
  stickerType?: string,
): ChecklistSection["sectionType"] {
  const normalizedName = sectionName.toLowerCase();
  const normalizedType = stickerType?.toLowerCase() ?? "";

  if (normalizedName.includes("golden") || normalizedType.includes("golden")) {
    return "special";
  }

  return "team";
}

function normalizeStickerType(stickerType?: string, rarityType?: string): StickerType {
  const normalized = `${stickerType ?? ""} ${rarityType ?? ""}`
    .toLowerCase()
    .replaceAll("_", "-");

  if (normalized.includes("golden-baller")) {
    return "golden-baller";
  }

  if (normalized.includes("special")) {
    return "special";
  }

  return "normal";
}

function normalizeRarityType(rarityType?: string): RarityType {
  const normalized = rarityType?.toLowerCase().replaceAll("_", "-") ?? "";

  if (normalized.includes("golden") || normalized.includes("rare")) {
    return "rare";
  }

  if (normalized.includes("foil") || normalized.includes("special")) {
    return "foil";
  }

  return "base";
}
