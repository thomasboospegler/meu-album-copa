import type { AlbumEdition, ChecklistVariant } from "@/types/collection";

const collectionId = "fifa-world-cup-2026";
export const chileChecklistVariantId = "fwc-2026-cl-es-sample";

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
];
