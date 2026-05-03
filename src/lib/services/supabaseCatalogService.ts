import type {
  AlbumEdition,
  ChecklistSection,
  ChecklistVariant,
  Collection,
} from "@/types/collection";
import type { OfficialSticker } from "@/types/sticker";
import { supabase } from "@/lib/supabase/client";

type CollectionRow = {
  id: string;
  name: string;
  publisher: "Panini";
  competition: string;
  year: number;
  total_stickers: number;
  total_pages: number;
  source_url: string;
};

type AlbumEditionRow = {
  id: string;
  collection_id: string;
  country: string;
  language: string;
  edition_name: string;
  cover_type: string;
  cover_variant: string;
  product_name: string;
  product_url: string;
  checklist_variant_id: string;
  is_enabled?: boolean | null;
};

type ChecklistVariantRow = {
  id: string;
  collection_id: string;
  name: string;
  country: string;
  language: string;
  total_stickers: number;
  source_url: string;
};

type ChecklistSectionRow = {
  id: string;
  checklist_variant_id: string;
  name: string;
  code: string;
  section_type: ChecklistSection["sectionType"];
  sort_order: number;
  page_start: number;
  page_end: number;
};

type OfficialStickerRow = {
  id: string;
  checklist_variant_id: string;
  section_id: string;
  official_number: number;
  display_code: string;
  name: string;
  country_code: string | null;
  team_name: string | null;
  sticker_type: OfficialSticker["stickerType"];
  rarity_type: OfficialSticker["rarityType"];
  role: string | null;
  page_number: number;
  sort_order: number;
};

export const supabaseCatalogService = {
  async getCollections(): Promise<Collection[] | undefined> {
    if (!supabase) return undefined;
    const { data, error } = await supabase.from("collections").select("*");
    if (error) throw error;
    return data.map(mapCollection);
  },

  async getAlbumEditions(collectionId: string): Promise<AlbumEdition[] | undefined> {
    if (!supabase) return undefined;
    const { data, error } = await supabase
      .from("album_editions")
      .select("*")
      .eq("collection_id", collectionId)
      .order("country")
      .order("edition_name");
    if (error) throw error;
    return data.map(mapAlbumEdition);
  },

  async getChecklistVariant(
    checklistVariantId: string,
  ): Promise<ChecklistVariant | undefined> {
    if (!supabase) return undefined;
    const { data, error } = await supabase
      .from("checklist_variants")
      .select("*")
      .eq("id", checklistVariantId)
      .maybeSingle();
    if (error) throw error;
    return data ? mapChecklistVariant(data) : undefined;
  },

  async getSections(checklistVariantId: string): Promise<ChecklistSection[] | undefined> {
    if (!supabase) return undefined;
    const { data, error } = await supabase
      .from("checklist_sections")
      .select("*")
      .eq("checklist_variant_id", checklistVariantId)
      .order("sort_order");
    if (error) throw error;
    return data.map(mapChecklistSection);
  },

  async getOfficialStickers(checklistVariantId: string): Promise<OfficialSticker[] | undefined> {
    if (!supabase) return undefined;
    const { data, error } = await supabase
      .from("official_stickers")
      .select("*")
      .eq("checklist_variant_id", checklistVariantId)
      .order("sort_order");
    if (error) throw error;
    return data.map(mapOfficialSticker);
  },
};

function mapCollection(row: CollectionRow): Collection {
  return {
    id: row.id,
    name: row.name,
    publisher: row.publisher,
    competition: row.competition,
    year: row.year,
    totalStickers: row.total_stickers,
    totalPages: row.total_pages,
    sourceUrl: row.source_url,
  };
}

function mapAlbumEdition(row: AlbumEditionRow): AlbumEdition {
  return {
    id: row.id,
    collectionId: row.collection_id,
    country: row.country,
    language: row.language,
    editionName: row.edition_name,
    coverType: row.cover_type,
    coverVariant: row.cover_variant,
    productName: row.product_name,
    productUrl: row.product_url,
    checklistVariantId: row.checklist_variant_id,
    isEnabled: row.is_enabled ?? undefined,
  };
}

function mapChecklistVariant(row: ChecklistVariantRow): ChecklistVariant {
  return {
    id: row.id,
    collectionId: row.collection_id,
    name: row.name,
    country: row.country,
    language: row.language,
    totalStickers: row.total_stickers,
    sourceUrl: row.source_url,
  };
}

function mapChecklistSection(row: ChecklistSectionRow): ChecklistSection {
  return {
    id: row.id,
    checklistVariantId: row.checklist_variant_id,
    name: row.name,
    code: row.code,
    sectionType: row.section_type,
    sortOrder: row.sort_order,
    pageStart: row.page_start,
    pageEnd: row.page_end,
  };
}

function mapOfficialSticker(row: OfficialStickerRow): OfficialSticker {
  return {
    id: row.id,
    checklistVariantId: row.checklist_variant_id,
    sectionId: row.section_id,
    officialNumber: row.official_number,
    displayCode: row.display_code,
    name: row.name,
    countryCode: row.country_code ?? undefined,
    teamName: row.team_name ?? undefined,
    stickerType: row.sticker_type,
    rarityType: row.rarity_type,
    role: row.role ?? undefined,
    pageNumber: row.page_number,
    sortOrder: row.sort_order,
  };
}
