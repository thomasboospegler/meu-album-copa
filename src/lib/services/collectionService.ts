import { checklistSections, officialStickers } from "@/data/panini-world-cup-2026/checklist-sample";
import { fifaWorldCup2026Collection } from "@/data/panini-world-cup-2026/collection";
import {
  checklistVariants,
  paniniWorldCup2026Editions,
  plannedEditionMarkets,
} from "@/data/panini-world-cup-2026/editions";
import { checklistImportService } from "@/lib/services/checklistImportService";
import { supabaseCatalogService } from "@/lib/services/supabaseCatalogService";

type EditionFilters = {
  country?: string;
  language?: string;
  coverType?: string;
  coverVariant?: string;
};

export const collectionService = {
  getCollections() {
    return [fifaWorldCup2026Collection];
  },
  async getCollectionsAsync() {
    try {
      return (await supabaseCatalogService.getCollections()) ?? this.getCollections();
    } catch {
      return this.getCollections();
    }
  },
  getCollection(collectionId: string) {
    return this.getCollections().find((collection) => collection.id === collectionId);
  },
  async getCollectionAsync(collectionId: string) {
    return (await this.getCollectionsAsync()).find(
      (collection) => collection.id === collectionId,
    );
  },
  getEditions(collectionId: string, filters: EditionFilters | string = {}) {
    const normalizedFilters =
      typeof filters === "string" ? { country: filters } : filters;

    return paniniWorldCup2026Editions.filter(
      (edition) =>
        edition.collectionId === collectionId &&
        (!normalizedFilters.country || edition.country === normalizedFilters.country) &&
        (!normalizedFilters.language || edition.language === normalizedFilters.language) &&
        (!normalizedFilters.coverType || edition.coverType === normalizedFilters.coverType) &&
        (!normalizedFilters.coverVariant ||
          edition.coverVariant === normalizedFilters.coverVariant),
    );
  },
  getEdition(editionId: string) {
    return paniniWorldCup2026Editions.find((edition) => edition.id === editionId);
  },
  async getEditionAsync(editionId: string) {
    try {
      const localEdition = this.getEdition(editionId);
      const collectionId = localEdition?.collectionId ?? fifaWorldCup2026Collection.id;
      const supabaseEditions =
        (await supabaseCatalogService.getAlbumEditions(collectionId)) ?? [];
      return (
        supabaseEditions.find((edition) => edition.id === editionId) ??
        localEdition
      );
    } catch {
      return this.getEdition(editionId);
    }
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
  getPlannedMarkets() {
    return plannedEditionMarkets;
  },
  getEditionFilterOptions(collectionId: string, filters: EditionFilters = {}) {
    const editions = paniniWorldCup2026Editions.filter(
      (edition) => edition.collectionId === collectionId,
    );

    const scoped = (key: keyof EditionFilters) =>
      editions
        .filter((edition) => {
          if (key !== "country" && filters.country && edition.country !== filters.country) {
            return false;
          }
          if (key !== "language" && filters.language && edition.language !== filters.language) {
            return false;
          }
          if (key !== "coverType" && filters.coverType && edition.coverType !== filters.coverType) {
            return false;
          }
          if (
            key !== "coverVariant" &&
            filters.coverVariant &&
            edition.coverVariant !== filters.coverVariant
          ) {
            return false;
          }
          return true;
        })
        .map((edition) => edition[key])
        .filter(Boolean) as string[];

    return {
      countries: Array.from(new Set(scoped("country"))),
      languages: Array.from(new Set(scoped("language"))),
      coverTypes: Array.from(new Set(scoped("coverType"))),
      coverVariants: Array.from(new Set(scoped("coverVariant"))),
    };
  },
  getChecklistVariant(checklistVariantId: string) {
    return checklistVariants.find((variant) => variant.id === checklistVariantId);
  },
  async getChecklistVariantAsync(checklistVariantId: string) {
    try {
      return (
        (await supabaseCatalogService.getChecklistVariant(checklistVariantId)) ??
        this.getChecklistVariant(checklistVariantId)
      );
    } catch {
      return this.getChecklistVariant(checklistVariantId);
    }
  },
  getSections(checklistVariantId: string) {
    const importedChecklist =
      checklistImportService.getImportedChecklist(checklistVariantId);

    return (importedChecklist?.sections ?? checklistSections)
      .filter((section) => section.checklistVariantId === checklistVariantId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },
  async getSectionsAsync(checklistVariantId: string) {
    try {
      return (
        (await supabaseCatalogService.getSections(checklistVariantId)) ??
        this.getSections(checklistVariantId)
      );
    } catch {
      return this.getSections(checklistVariantId);
    }
  },
  getStickers(checklistVariantId: string) {
    const importedChecklist =
      checklistImportService.getImportedChecklist(checklistVariantId);

    return (importedChecklist?.stickers ?? officialStickers)
      .filter((sticker) => sticker.checklistVariantId === checklistVariantId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },
  async getStickersAsync(checklistVariantId: string) {
    try {
      return (
        (await supabaseCatalogService.getOfficialStickers(checklistVariantId)) ??
        this.getStickers(checklistVariantId)
      );
    } catch {
      return this.getStickers(checklistVariantId);
    }
  },
  getSticker(officialStickerId: string) {
    return officialStickers.find((sticker) => sticker.id === officialStickerId);
  },
};
