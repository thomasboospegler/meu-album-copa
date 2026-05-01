import { checklistSections, officialStickers } from "@/data/panini-world-cup-2026/checklist-sample";
import { fifaWorldCup2026Collection } from "@/data/panini-world-cup-2026/collection";
import { checklistVariants, paniniWorldCup2026Editions } from "@/data/panini-world-cup-2026/editions";

export const collectionService = {
  getCollections() {
    return [fifaWorldCup2026Collection];
  },
  getCollection(collectionId: string) {
    return this.getCollections().find((collection) => collection.id === collectionId);
  },
  getEditions(collectionId: string, country?: string) {
    return paniniWorldCup2026Editions.filter(
      (edition) =>
        edition.collectionId === collectionId &&
        (!country || edition.country === country),
    );
  },
  getEdition(editionId: string) {
    return paniniWorldCup2026Editions.find((edition) => edition.id === editionId);
  },
  getCountries(collectionId: string) {
    return Array.from(
      new Set(
        paniniWorldCup2026Editions
          .filter((edition) => edition.collectionId === collectionId)
          .map((edition) => edition.country),
      ),
    );
  },
  getChecklistVariant(checklistVariantId: string) {
    return checklistVariants.find((variant) => variant.id === checklistVariantId);
  },
  getSections(checklistVariantId: string) {
    return checklistSections
      .filter((section) => section.checklistVariantId === checklistVariantId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },
  getStickers(checklistVariantId: string) {
    return officialStickers
      .filter((sticker) => sticker.checklistVariantId === checklistVariantId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },
  getSticker(officialStickerId: string) {
    return officialStickers.find((sticker) => sticker.id === officialStickerId);
  },
};
