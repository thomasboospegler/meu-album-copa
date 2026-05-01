export type Collection = {
  id: string;
  name: string;
  publisher: "Panini";
  competition: string;
  year: number;
  totalStickers: number;
  totalPages: number;
  sourceUrl: string;
};

export type AlbumEdition = {
  id: string;
  collectionId: string;
  country: string;
  language: string;
  editionName: string;
  coverType: string;
  coverVariant: string;
  productName: string;
  productUrl: string;
  checklistVariantId: string;
};

export type ChecklistVariant = {
  id: string;
  collectionId: string;
  name: string;
  country: string;
  language: string;
  totalStickers: number;
  sourceUrl: string;
};

export type ChecklistSection = {
  id: string;
  checklistVariantId: string;
  name: string;
  code: string;
  sectionType: "intro" | "team" | "special";
  sortOrder: number;
  pageStart: number;
  pageEnd: number;
};
