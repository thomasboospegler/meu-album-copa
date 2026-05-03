import { checklistSections, officialStickers } from "@/data/panini-world-cup-2026/checklist-sample";
import { fifaWorldCup2026Collection } from "@/data/panini-world-cup-2026/collection";
import {
  checklistVariants,
  paniniWorldCup2026Editions,
  plannedEditionMarkets,
} from "@/data/panini-world-cup-2026/editions";
import { checklistImportService } from "@/lib/services/checklistImportService";
import { supabaseCatalogService } from "@/lib/services/supabaseCatalogService";
import type { AlbumEdition } from "@/types/collection";

type EditionFilters = {
  country?: string;
  language?: string;
  coverType?: string;
  coverVariant?: string;
  includeDisabled?: boolean;
};

type EditionFilterOptionKey = Exclude<keyof EditionFilters, "includeDisabled">;

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

    return filterEditions(paniniWorldCup2026Editions, collectionId, normalizedFilters);
  },
  async getEditionsAsync(collectionId: string, filters: EditionFilters | string = {}) {
    const normalizedFilters =
      typeof filters === "string" ? { country: filters } : filters;

    try {
      const supabaseEditions =
        await supabaseCatalogService.getAlbumEditions(collectionId);

      return supabaseEditions && supabaseEditions.length > 0
        ? filterEditions(
            withLocalEditionMetadata(supabaseEditions),
            collectionId,
            normalizedFilters,
          )
        : this.getEditions(collectionId, normalizedFilters);
    } catch {
      return this.getEditions(collectionId, normalizedFilters);
    }
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
          .filter(
            (edition) =>
              edition.collectionId === collectionId && edition.isEnabled !== false,
          )
          .map((edition) => edition.country),
      ),
    );
  },
  getPlannedMarkets() {
    return plannedEditionMarkets;
  },
  getEditionFilterOptions(collectionId: string, filters: EditionFilters = {}) {
    const editions = paniniWorldCup2026Editions.filter(
      (edition) =>
        edition.collectionId === collectionId && edition.isEnabled !== false,
    );

    const scoped = (key: EditionFilterOptionKey) =>
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

    if (importedChecklist) {
      return importedChecklist.sections
        .filter((section) => section.checklistVariantId === checklistVariantId)
        .sort((a, b) => a.sortOrder - b.sortOrder);
    }

    return getLocalSectionsForVariant(checklistVariantId)
      .filter((section) => section.checklistVariantId === checklistVariantId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },
  async getSectionsAsync(checklistVariantId: string) {
    try {
      const supabaseSections = await supabaseCatalogService.getSections(checklistVariantId);
      return supabaseSections && supabaseSections.length > 0
        ? supabaseSections
        : this.getSections(checklistVariantId);
    } catch {
      return this.getSections(checklistVariantId);
    }
  },
  getStickers(checklistVariantId: string) {
    const importedChecklist =
      checklistImportService.getImportedChecklist(checklistVariantId);

    if (importedChecklist) {
      return importedChecklist.stickers
        .filter((sticker) => sticker.checklistVariantId === checklistVariantId)
        .sort((a, b) => a.sortOrder - b.sortOrder);
    }

    return getLocalStickersForVariant(checklistVariantId)
      .filter((sticker) => sticker.checklistVariantId === checklistVariantId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  },
  async getStickersAsync(checklistVariantId: string) {
    try {
      const supabaseStickers =
        await supabaseCatalogService.getOfficialStickers(checklistVariantId);
      const localStickers = this.getStickers(checklistVariantId);

      return supabaseStickers && supabaseStickers.length >= localStickers.length
        ? supabaseStickers
        : localStickers;
    } catch {
      return this.getStickers(checklistVariantId);
    }
  },
  getSticker(officialStickerId: string) {
    const directSticker = officialStickers.find(
      (sticker) => sticker.id === officialStickerId,
    );

    if (directSticker) {
      return directSticker;
    }

    return checklistVariants
      .flatMap((variant) => getLocalStickersForVariant(variant.id))
      .find((sticker) => sticker.id === officialStickerId);
  },
};

function filterEditions(
  editions: AlbumEdition[],
  collectionId: string,
  filters: EditionFilters,
) {
  return editions.filter(
    (edition) =>
      edition.collectionId === collectionId &&
      (filters.includeDisabled || edition.isEnabled !== false) &&
      (!filters.country || edition.country === filters.country) &&
      (!filters.language || edition.language === filters.language) &&
      (!filters.coverType || edition.coverType === filters.coverType) &&
      (!filters.coverVariant || edition.coverVariant === filters.coverVariant),
  );
}

function withLocalEditionMetadata(editions: AlbumEdition[]) {
  return editions.map((edition) => {
    const localEdition = paniniWorldCup2026Editions.find(
      (item) => item.id === edition.id,
    );

    return {
      ...edition,
      isEnabled: edition.isEnabled ?? localEdition?.isEnabled ?? true,
      marketLabel: localEdition?.marketLabel,
      packTheme: localEdition?.packTheme,
      availabilityNote: localEdition?.availabilityNote,
    };
  });
}

function getLocalSectionsForVariant(checklistVariantId: string) {
  const directSections = checklistSections.filter(
    (section) => section.checklistVariantId === checklistVariantId,
  );

  if (directSections.length > 0) {
    return directSections;
  }

  return checklistSections.map((section) => ({
    ...section,
    id: `${checklistVariantId}-${section.code.toLowerCase()}`,
    checklistVariantId,
  }));
}

function getLocalStickersForVariant(checklistVariantId: string) {
  const directStickers = officialStickers.filter(
    (sticker) => sticker.checklistVariantId === checklistVariantId,
  );

  if (directStickers.length > 0) {
    return directStickers;
  }

  return officialStickers.map((sticker) => ({
    ...sticker,
    id: `${checklistVariantId}-${sticker.displayCode}`,
    checklistVariantId,
    sectionId: `${checklistVariantId}-${sticker.displayCode.replace(/\d+$/, "").toLowerCase()}`,
  }));
}
