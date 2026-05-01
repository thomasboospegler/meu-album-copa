export type StickerType = "normal" | "special" | "golden-baller";
export type RarityType = "base" | "foil" | "rare";
export type StickerCondition = "new" | "pasted" | "damaged";

export type OfficialSticker = {
  id: string;
  checklistVariantId: string;
  sectionId: string;
  officialNumber: number;
  displayCode: string;
  name: string;
  countryCode?: string;
  teamName?: string;
  stickerType: StickerType;
  rarityType: RarityType;
  role?: string;
  pageNumber: number;
  sortOrder: number;
};

export type UserSticker = {
  id: string;
  userId: string;
  userAlbumId: string;
  officialStickerId: string;
  quantity: number;
  condition: StickerCondition;
  notes: string;
  updatedAt: string;
};
