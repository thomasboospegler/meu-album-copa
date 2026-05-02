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
  ARG: makeTeamNames("Argentina"),
  BRA: makeTeamNames("Brazil"),
  FRA: makeTeamNames("France"),
  GER: makeTeamNames("Germany"),
  JPN: makeTeamNames("Japan"),
  MEX: makeTeamNames("Mexico"),
};

function makeTeamNames(teamName: string) {
  return [
    `Escudo ${teamName}`,
    `Foto de equipe ${teamName}`,
    `Goleiro ${teamName}`,
    `Defensor 1 ${teamName}`,
    `Defensor 2 ${teamName}`,
    `Lateral direito ${teamName}`,
    `Lateral esquerdo ${teamName}`,
    `Volante 1 ${teamName}`,
    `Volante 2 ${teamName}`,
    `Meio-campista 1 ${teamName}`,
    `Meio-campista 2 ${teamName}`,
    `Meio-campista 3 ${teamName}`,
    `Ponta direita ${teamName}`,
    `Ponta esquerda ${teamName}`,
    `Atacante 1 ${teamName}`,
    `Atacante 2 ${teamName}`,
    `Craque ${teamName}`,
    `Lenda ${teamName}`,
    `Torcida ${teamName}`,
    `Estádio ${teamName}`,
  ];
}

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
      const officialNumber =
        section.code === "GB"
          ? stickerIndex + 1
          : 11 + (sectionIndex - 1) * 20 + stickerIndex;
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
        role: getRole(stickerIndex),
        pageNumber:
          section.pageStart + Math.floor(stickerIndex / (section.code === "GB" ? 3 : 5)),
        sortOrder: officialNumber,
      };
    });
  },
);

function getRole(stickerIndex: number) {
  if (stickerIndex === 0) return "Escudo";
  if (stickerIndex === 1) return "Equipe";
  if (stickerIndex === 18) return "Torcida";
  if (stickerIndex === 19) return "Estádio";
  return "Jogador";
}
