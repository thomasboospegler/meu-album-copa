import type { ChecklistImportPreview } from "@/lib/services/checklistImportService";
import { supabase } from "@/lib/supabase/client";

export const supabaseAdminCatalogService = {
  async upsertChecklist(preview: ChecklistImportPreview) {
    if (!supabase) {
      return undefined;
    }

    const { error: sectionsError } = await supabase.from("checklist_sections").upsert(
      preview.sections.map((section) => ({
        id: section.id,
        checklist_variant_id: section.checklistVariantId,
        name: section.name,
        code: section.code,
        section_type: section.sectionType,
        sort_order: section.sortOrder,
        page_start: section.pageStart,
        page_end: section.pageEnd,
      })),
      { onConflict: "id" },
    );

    if (sectionsError) throw sectionsError;

    const { error: stickersError } = await supabase.from("official_stickers").upsert(
      preview.stickers.map((sticker) => ({
        id: sticker.id,
        checklist_variant_id: sticker.checklistVariantId,
        section_id: sticker.sectionId,
        official_number: sticker.officialNumber,
        display_code: sticker.displayCode,
        name: sticker.name,
        country_code: sticker.countryCode ?? null,
        team_name: sticker.teamName ?? null,
        sticker_type: sticker.stickerType,
        rarity_type: sticker.rarityType,
        role: sticker.role ?? null,
        page_number: sticker.pageNumber,
        sort_order: sticker.sortOrder,
      })),
      { onConflict: "checklist_variant_id,official_number" },
    );

    if (stickersError) throw stickersError;

    return {
      sections: preview.sections.length,
      stickers: preview.stickers.length,
    };
  },
};
