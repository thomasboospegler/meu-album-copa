import type { ChecklistSection } from "@/types/collection";
import type { OfficialSticker, RarityType, StickerType } from "@/types/sticker";
import { chileChecklistVariantId } from "@/data/panini-world-cup-2026/editions";

// TODO: Checklist mockado temporário para desenvolvimento.
// Substituir por importação do checklist oficial da edição Panini escolhida.
const sectionsSeed = [
  { name: "Golden Ballers", code: "GB", sectionType: "special", pageStart: 4 },
  { name: "Argentina", code: "ARG", sectionType: "team", pageStart: 12 },
  { name: "Brazil", code: "BRA", sectionType: "team", pageStart: 20 },
  { name: "France", code: "FRA", sectionType: "team", pageStart: 28 },
  { name: "Germany", code: "GER", sectionType: "team", pageStart: 36 },
  { name: "Japan", code: "JPN", sectionType: "team", pageStart: 44 },
  { name: "Mexico", code: "MEX", sectionType: "team", pageStart: 52 },
] as const;

const teamNames: Record<string, string[]> = {
  GB: [
    "Golden Baller 01",
    "Golden Baller 02",
    "Golden Baller 03",
    "Golden Baller 04",
    "Golden Baller 05",
    "Golden Baller 06",
    "Golden Baller 07",
    "Golden Baller 08",
    "Golden Baller 09",
    "Golden Baller 10",
  ],
  ARG: [
    "Escudo Argentina",
    "Foto de equipe Argentina",
    "Goleiro Argentina",
    "Defensor Argentina",
    "Lateral Argentina",
    "Volante Argentina",
    "Meio-campista Argentina",
    "Atacante Argentina",
    "Craque Argentina",
    "Torcida Argentina",
  ],
  BRA: [
    "Escudo Brazil",
    "Foto de equipe Brazil",
    "Goleiro Brazil",
    "Defensor Brazil",
    "Lateral Brazil",
    "Volante Brazil",
    "Meio-campista Brazil",
    "Atacante Brazil",
    "Craque Brazil",
    "Torcida Brazil",
  ],
  FRA: [
    "Escudo France",
    "Foto de equipe France",
    "Goleiro France",
    "Defensor France",
    "Lateral France",
    "Volante France",
    "Meio-campista France",
    "Atacante France",
    "Craque France",
    "Torcida France",
  ],
  GER: [
    "Escudo Germany",
    "Foto de equipe Germany",
    "Goleiro Germany",
    "Defensor Germany",
    "Lateral Germany",
    "Volante Germany",
    "Meio-campista Germany",
    "Atacante Germany",
    "Craque Germany",
    "Torcida Germany",
  ],
  JPN: [
    "Escudo Japan",
    "Foto de equipe Japan",
    "Goleiro Japan",
    "Defensor Japan",
    "Lateral Japan",
    "Volante Japan",
    "Meio-campista Japan",
    "Atacante Japan",
    "Craque Japan",
    "Torcida Japan",
  ],
  MEX: [
    "Escudo Mexico",
    "Foto de equipe Mexico",
    "Goleiro Mexico",
    "Defensor Mexico",
    "Lateral Mexico",
    "Volante Mexico",
    "Meio-campista Mexico",
    "Atacante Mexico",
    "Craque Mexico",
    "Torcida Mexico",
  ],
};

export const checklistSections: ChecklistSection[] = sectionsSeed.map(
  (section, index) => ({
    id: `${chileChecklistVariantId}-${section.code.toLowerCase()}`,
    checklistVariantId: chileChecklistVariantId,
    name: section.name,
    code: section.code,
    sectionType: section.sectionType,
    sortOrder: index + 1,
    pageStart: section.pageStart,
    pageEnd: section.pageStart + 3,
  }),
);

export const officialStickers: OfficialSticker[] = checklistSections.flatMap(
  (section, sectionIndex) => {
    const names = teamNames[section.code];
    return names.map((name, stickerIndex) => {
      const officialNumber = sectionIndex * 10 + stickerIndex + 1;
      const isGolden = section.code === "GB";
      const isSpecial = isGolden || stickerIndex < 2;
      const stickerType: StickerType = isGolden
        ? "golden-baller"
        : isSpecial
          ? "special"
          : "normal";
      const rarityType: RarityType = isGolden
        ? "rare"
        : isSpecial
          ? "foil"
          : "base";

      return {
        id: `${chileChecklistVariantId}-${section.code}-${String(stickerIndex + 1).padStart(2, "0")}`,
        checklistVariantId: chileChecklistVariantId,
        sectionId: section.id,
        officialNumber,
        displayCode: `${section.code}${String(stickerIndex + 1).padStart(2, "0")}`,
        name,
        countryCode: section.sectionType === "team" ? section.code : undefined,
        teamName: section.sectionType === "team" ? section.name : undefined,
        stickerType,
        rarityType,
        role: stickerIndex === 0 ? "Escudo" : stickerIndex === 1 ? "Equipe" : "Jogador",
        pageNumber: section.pageStart + Math.floor(stickerIndex / 3),
        sortOrder: officialNumber,
      };
    });
  },
);
