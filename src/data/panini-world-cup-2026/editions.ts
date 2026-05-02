import type { AlbumEdition, ChecklistVariant } from "@/types/collection";

const collectionId = "fifa-world-cup-2026";
export const chileChecklistVariantId = "fwc-2026-cl-es-sample";
export const internationalChecklistVariantId = "fwc-2026-intl-sample";

export type PlannedEditionMarket = {
  country: string;
  languages: string[];
  enabled: boolean;
};

export const checklistVariants: ChecklistVariant[] = [
  {
    id: chileChecklistVariantId,
    collectionId,
    name: "Chile ES - Checklist de desenvolvimento",
    country: "Chile",
    language: "es-CL",
    totalStickers: 980,
    sourceUrl: "https://www.panini.com/",
  },
  {
    id: internationalChecklistVariantId,
    collectionId,
    name: "Internacional - Checklist de desenvolvimento",
    country: "Internacional",
    language: "en",
    totalStickers: 980,
    sourceUrl: "https://www.panini.com/",
  },
];

export const plannedEditionMarkets: PlannedEditionMarket[] = [
  { country: "Chile", languages: ["es-CL"], enabled: true },
  { country: "Brasil", languages: ["pt-BR"], enabled: false },
  { country: "Bolívia", languages: ["es-BO"], enabled: false },
  { country: "Argentina", languages: ["es-AR"], enabled: false },
  { country: "México", languages: ["es-MX"], enabled: false },
  { country: "Internacional", languages: ["en"], enabled: false },
];

export const paniniWorldCup2026Editions: AlbumEdition[] = [
  {
    id: "chile-tapa-blanda",
    collectionId,
    country: "Chile",
    language: "es-CL",
    editionName: "Chile - Álbum Tapa Blanda",
    coverType: "Tapa Blanda",
    coverVariant: "Standard",
    productName: "FIFA World Cup 2026 - Álbum Tapa Blanda",
    productUrl: "https://www.panini.com/",
    checklistVariantId: chileChecklistVariantId,
  },
  {
    id: "chile-tapa-dura-gold",
    collectionId,
    country: "Chile",
    language: "es-CL",
    editionName: "Chile - Álbum Tapa Dura Gold",
    coverType: "Tapa Dura",
    coverVariant: "Gold",
    productName: "FIFA World Cup 2026 - Álbum Tapa Dura Gold",
    productUrl: "https://www.panini.com/",
    checklistVariantId: chileChecklistVariantId,
  },
  {
    id: "chile-tapa-dura-silver",
    collectionId,
    country: "Chile",
    language: "es-CL",
    editionName: "Chile - Álbum Tapa Dura Silver",
    coverType: "Tapa Dura",
    coverVariant: "Silver",
    productName: "FIFA World Cup 2026 - Álbum Tapa Dura Silver",
    productUrl: "https://www.panini.com/",
    checklistVariantId: chileChecklistVariantId,
  },
  {
    id: "chile-tapa-dura-color",
    collectionId,
    country: "Chile",
    language: "es-CL",
    editionName: "Chile - Álbum Tapa Dura Color",
    coverType: "Tapa Dura",
    coverVariant: "Color",
    productName: "FIFA World Cup 2026 - Álbum Tapa Dura Color",
    productUrl: "https://www.panini.com/",
    checklistVariantId: chileChecklistVariantId,
  },
  {
    id: "international-softcover-preview",
    collectionId,
    country: "Internacional",
    language: "en",
    editionName: "Internacional - Softcover Preview",
    coverType: "Softcover",
    coverVariant: "Standard",
    productName: "FIFA World Cup 2026 - International Softcover Preview",
    productUrl: "https://www.panini.com/",
    checklistVariantId: internationalChecklistVariantId,
  },
];
