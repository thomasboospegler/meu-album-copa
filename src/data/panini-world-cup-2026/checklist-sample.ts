import type { ChecklistSection } from "@/types/collection";
import type { OfficialSticker, RarityType, StickerType } from "@/types/sticker";
import { chileChecklistVariantId } from "@/data/panini-world-cup-2026/editions";

// TODO: Checklist mockado temporario para desenvolvimento.
// Substituir pela importacao do checklist oficial Panini quando a lista publica
// completa de nomes/numeracao estiver validada. Esta versao usa:
// - total oficial divulgado pela Panini: 980 figurinhas, 112 paginas,
//   48 selecoes e 68 especiais.
// - ordem e paginas dos times fotografadas no album fisico boliviano do usuario.
// - nomes genericos para jogadores, sem inventar a lista oficial de atletas.
const sectionsSeed = [
  { name: "FIFA World Cup", code: "FWC", sectionType: "special", pageStart: 1 },
  { name: "Mexico", code: "MEX", sectionType: "team", pageStart: 8 },
  { name: "South Africa", code: "RSA", sectionType: "team", pageStart: 10 },
  { name: "Korea Republic", code: "KOR", sectionType: "team", pageStart: 12 },
  { name: "Czechia", code: "CZE", sectionType: "team", pageStart: 14 },
  { name: "Canada", code: "CAN", sectionType: "team", pageStart: 16 },
  { name: "Bosnia-Herzegovina", code: "BIH", sectionType: "team", pageStart: 18 },
  { name: "Qatar", code: "QAT", sectionType: "team", pageStart: 20 },
  { name: "Switzerland", code: "SUI", sectionType: "team", pageStart: 22 },
  { name: "Brazil", code: "BRA", sectionType: "team", pageStart: 24 },
  { name: "Morocco", code: "MAR", sectionType: "team", pageStart: 26 },
  { name: "Haiti", code: "HAI", sectionType: "team", pageStart: 28 },
  { name: "Scotland", code: "SCO", sectionType: "team", pageStart: 30 },
  { name: "USA", code: "USA", sectionType: "team", pageStart: 32 },
  { name: "Paraguay", code: "PAR", sectionType: "team", pageStart: 34 },
  { name: "Australia", code: "AUS", sectionType: "team", pageStart: 36 },
  { name: "Türkiye", code: "TUR", sectionType: "team", pageStart: 38 },
  { name: "Germany", code: "GER", sectionType: "team", pageStart: 40 },
  { name: "Curaçao", code: "CUW", sectionType: "team", pageStart: 42 },
  { name: "Côte d'Ivoire", code: "CIV", sectionType: "team", pageStart: 44 },
  { name: "Ecuador", code: "ECU", sectionType: "team", pageStart: 46 },
  { name: "Netherlands", code: "NED", sectionType: "team", pageStart: 48 },
  { name: "Japan", code: "JPN", sectionType: "team", pageStart: 50 },
  { name: "Sweden", code: "SWE", sectionType: "team", pageStart: 52 },
  { name: "Tunisia", code: "TUN", sectionType: "team", pageStart: 54 },
  { name: "Belgium", code: "BEL", sectionType: "team", pageStart: 58 },
  { name: "Egypt", code: "EGY", sectionType: "team", pageStart: 60 },
  { name: "IR Iran", code: "IRN", sectionType: "team", pageStart: 62 },
  { name: "New Zealand", code: "NZL", sectionType: "team", pageStart: 64 },
  { name: "Spain", code: "ESP", sectionType: "team", pageStart: 66 },
  { name: "Cabo Verde", code: "CPV", sectionType: "team", pageStart: 68 },
  { name: "Saudi Arabia", code: "KSA", sectionType: "team", pageStart: 70 },
  { name: "Uruguay", code: "URU", sectionType: "team", pageStart: 72 },
  { name: "France", code: "FRA", sectionType: "team", pageStart: 74 },
  { name: "Senegal", code: "SEN", sectionType: "team", pageStart: 76 },
  { name: "Iraq", code: "IRQ", sectionType: "team", pageStart: 78 },
  { name: "Norway", code: "NOR", sectionType: "team", pageStart: 80 },
  { name: "Argentina", code: "ARG", sectionType: "team", pageStart: 82 },
  { name: "Algeria", code: "ALG", sectionType: "team", pageStart: 84 },
  { name: "Austria", code: "AUT", sectionType: "team", pageStart: 86 },
  { name: "Jordan", code: "JOR", sectionType: "team", pageStart: 88 },
  { name: "Portugal", code: "POR", sectionType: "team", pageStart: 90 },
  { name: "Congo DR", code: "COD", sectionType: "team", pageStart: 92 },
  { name: "Uzbekistan", code: "UZB", sectionType: "team", pageStart: 94 },
  { name: "Colombia", code: "COL", sectionType: "team", pageStart: 96 },
  { name: "England", code: "ENG", sectionType: "team", pageStart: 98 },
  { name: "Croatia", code: "CRO", sectionType: "team", pageStart: 100 },
  { name: "Ghana", code: "GHA", sectionType: "team", pageStart: 102 },
  { name: "Panama", code: "PAN", sectionType: "team", pageStart: 104 },
] as const;

function makeWorldCupNames() {
  return [
    "Official Emblem",
    "Official Mascots",
    "Official Slogan",
    "Official Match Ball",
    "Official Ball",
    "Host Country Emblem Canada",
    "Host Country Emblem Mexico",
    "Host Country Emblem USA",
    "Host Cities 01",
    "Host Cities 02",
    "Host Cities 03",
    "Host Cities 04",
    "Host Cities 05",
    "Host Cities 06",
    "Host Cities 07",
    "Host Cities 08",
    "Host Cities 09",
    "Host Cities 10",
    "Host Cities 11",
    "Host Cities 12",
  ];
}

function makeTeamNames(teamName: string) {
  return [
    `Escudo ${teamName}`,
    `Foto de equipo ${teamName}`,
    `Arquero ${teamName}`,
    `Defensor 1 ${teamName}`,
    `Defensor 2 ${teamName}`,
    `Lateral derecho ${teamName}`,
    `Lateral izquierdo ${teamName}`,
    `Mediocampista 1 ${teamName}`,
    `Mediocampista 2 ${teamName}`,
    `Mediocampista 3 ${teamName}`,
    `Mediocampista 4 ${teamName}`,
    `Mediocampista 5 ${teamName}`,
    `Extremo derecho ${teamName}`,
    `Extremo izquierdo ${teamName}`,
    `Delantero 1 ${teamName}`,
    `Delantero 2 ${teamName}`,
    `Jugador destacado ${teamName}`,
    `Jugador 16 ${teamName}`,
    `Jugador 17 ${teamName}`,
    `Jugador 18 ${teamName}`,
  ];
}

const worldCupStickerPages = [
  1, 1, 1, 1, 2, 2, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7,
];

export const checklistSections: ChecklistSection[] = sectionsSeed.map(
  (section, index) => ({
    id: `${chileChecklistVariantId}-${section.code.toLowerCase()}`,
    checklistVariantId: chileChecklistVariantId,
    name: section.name,
    code: section.code,
    sectionType: section.sectionType,
    sortOrder: index + 1,
    pageStart: section.pageStart,
    pageEnd: section.pageStart + (section.sectionType === "team" ? 1 : 6),
  }),
);

export const officialStickers: OfficialSticker[] = checklistSections.flatMap(
  (section, sectionIndex) => {
    const names =
      section.code === "FWC" ? makeWorldCupNames() : makeTeamNames(section.name);

    return names.map((name, stickerIndex) => {
      const officialNumber =
        section.code === "FWC"
          ? stickerIndex + 1
          : 21 + (sectionIndex - 1) * 20 + stickerIndex;
      const isWorldCup = section.code === "FWC";
      const isSpecial = isWorldCup || stickerIndex === 0;
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
          section.code === "FWC"
            ? worldCupStickerPages[stickerIndex]
            : section.pageStart + Math.floor(stickerIndex / 10),
        sortOrder: officialNumber,
      };
    });
  },
);

function getRole(stickerIndex: number, sectionType: ChecklistSection["sectionType"]) {
  if (sectionType !== "team") return "Especial";
  if (stickerIndex === 0) return "Escudo";
  if (stickerIndex === 1) return "Equipo";
  return "Jogador";
}
