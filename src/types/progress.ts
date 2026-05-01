export type SectionProgress = {
  sectionId: string;
  sectionName: string;
  total: number;
  collected: number;
  missing: number;
  duplicates: number;
  percentage: number;
};

export type AlbumProgress = {
  totalStickers: number;
  collectedUnique: number;
  missing: number;
  duplicates: number;
  completionPercentage: number;
  specialCollected: number;
};
