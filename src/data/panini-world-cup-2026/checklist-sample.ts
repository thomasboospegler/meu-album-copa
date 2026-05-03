import type { ChecklistSection } from "@/types/collection";
import type { OfficialSticker, RarityType, StickerType } from "@/types/sticker";
import { chileChecklistVariantId } from "@/data/panini-world-cup-2026/editions";

// TODO: Checklist mockado temporário para desenvolvimento.
// Substituir por importação do checklist oficial da edição Panini escolhida.
// Ajustado em 2026-05-02 a partir de fotos do álbum físico boliviano:
// seleções usam 20 espaços em uma dupla de páginas, com códigos como MEX 1..20.
const sectionsSeed = [
  { name: "FIFA World Cup", code: "FWC", sectionType: "special", pageStart: 1 },
  { name: "Mexico", code: "MEX", sectionType: "team", pageStart: 4 },
  { name: "Tunisia", code: "TUN", sectionType: "team", pageStart: 6 },
  { name: "Belgium", code: "BEL", sectionType: "team", pageStart: 8 },
  { name: "Argentina", code: "ARG", sectionType: "team", pageStart: 10 },
  { name: "Brazil", code: "BRA", sectionType: "team", pageStart: 12 },
  { name: "France", code: "FRA", sectionType: "team", pageStart: 14 },
  { name: "Germany", code: "GER", sectionType: "team", pageStart: 16 },
  { name: "Japan", code: "JPN", sectionType: "team", pageStart: 18 },
] as const;

const teamNames: Record<string, string[]> = {
  FWC: makeWorldCupNames(),
  MEX: makeTeamNames("Mexico"),
  TUN: makeTeamNames("Tunisia"),
  BEL: makeTeamNames("Belgium"),
  ARG: makeTeamNames("Argentina"),
  BRA: makeTeamNames("Brazil"),
  FRA: makeTeamNames("France"),
  GER: makeTeamNames("Germany"),
  JPN: makeTeamNames("Japan"),
};

function makeWorldCupNames() {
  return [
    "Official Emblem",
    "Official Mascots",
    "Official Slogan",
    "Official Match Ball",
    "Host Country Emblem",
    "Host Country Emblem",
    "Toronto",
    "Vancouver",
    "Guadalajara",
    "Mexico City",
    "Monterrey",
    "Atlanta",
    "Boston",
    "Dallas",
    "Houston",
    "Kansas City",
    "Los Angeles",
    "Miami",
    "New York New Jersey",
    "San Francisco Bay Area",
  ];
}

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
    `Destaque ${teamName}`,
    `Ponta direita ${teamName}`,
    `Ponta esquerda ${teamName}`,
    `Atacante 1 ${teamName}`,
    `Atacante 2 ${teamName}`,
    `Craque ${teamName}`,
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
    pageEnd: section.pageStart + (section.sectionType === "team" ? 1 : 3),
  }),
);

export const officialStickers: OfficialSticker[] = checklistSections.flatMap(
  (section, sectionIndex) => {
    const names = teamNames[section.code];
    return names.map((name, stickerIndex) => {
      const officialNumber =
        section.code === "FWC"
          ? stickerIndex + 1
          : 21 + (sectionIndex - 1) * 20 + stickerIndex;
      const isWorldCup = section.code === "FWC";
      const isSpecial = isWorldCup || stickerIndex < 2;
      const stickerType: StickerType = isSpecial ? "special" : "normal";
      const rarityType: RarityType = isWorldCup
        ? "rare"
        : isSpecial
          ? "foil"
          : "base";
      const slotNumber = stickerIndex + 1;
      const compactCode = `${section.code}${String(slotNumber).padStart(2, "0")}`;

      return {
        id: `${chileChecklistVariantId}-${compactCode}`,
        checklistVariantId: chileChecklistVariantId,
        sectionId: section.id,
        officialNumber,
        displayCode: `${section.code} ${slotNumber}`,
        name,
        countryCode: section.sectionType === "team" ? section.code : undefined,
        teamName: section.sectionType === "team" ? section.name : undefined,
        stickerType,
        rarityType,
        role: getRole(stickerIndex, section.sectionType),
        pageNumber:
          section.pageStart + Math.floor(stickerIndex / (section.code === "FWC" ? 5 : 10)),
        sortOrder: officialNumber,
      };
    });
  },
);

function getRole(stickerIndex: number, sectionType: ChecklistSection["sectionType"]) {
  if (sectionType !== "team") return "Especial";
  if (stickerIndex === 0) return "Escudo";
  if (stickerIndex === 1) return "Equipe";
  if (stickerIndex === 18) return "Torcida";
  if (stickerIndex === 19) return "Estádio";
  return "Jogador";
}
