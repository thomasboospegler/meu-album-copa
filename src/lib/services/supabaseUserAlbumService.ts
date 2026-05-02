import type { UserAlbum } from "@/types/album";
import type { UserSticker } from "@/types/sticker";
import { supabase } from "@/lib/supabase/client";
import { collectionService } from "@/lib/services/collectionService";

export const supabaseUserAlbumService = {
  async getAlbums(): Promise<UserAlbum[] | undefined> {
    if (!supabase) return undefined;

    const { data, error } = await supabase
      .from("user_albums")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return data.map(mapUserAlbum);
  },

  async getAlbum(userAlbumId: string): Promise<UserAlbum | undefined> {
    if (!supabase) return undefined;

    const { data, error } = await supabase
      .from("user_albums")
      .select("*")
      .eq("id", userAlbumId)
      .maybeSingle();

    if (error) throw error;
    return data ? mapUserAlbum(data) : undefined;
  },

  async createAlbum(albumEditionId: string, nickname?: string) {
    if (!supabase) return undefined;

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    const userId = userData.user?.id;
    const edition = collectionService.getEdition(albumEditionId);

    if (!userId || !edition) {
      return undefined;
    }

    const { data, error } = await supabase
      .from("user_albums")
      .insert({
        user_id: userId,
        album_edition_id: edition.id,
        collection_id: edition.collectionId,
        checklist_variant_id: edition.checklistVariantId,
        nickname: nickname?.trim() || edition.editionName,
      })
      .select()
      .single();

    if (error) throw error;
    return mapUserAlbum(data);
  },

  async getUserStickers(userAlbumId: string): Promise<UserSticker[] | undefined> {
    if (!supabase) return undefined;

    const { data, error } = await supabase
      .from("user_stickers")
      .select("*")
      .eq("user_album_id", userAlbumId);

    if (error) throw error;
    return data.map(mapUserSticker);
  },

  async setStickerQuantity(
    userAlbumId: string,
    officialStickerId: string,
    quantity: number,
  ) {
    if (!supabase) return undefined;

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    const userId = userData.user?.id;

    if (!userId) {
      return undefined;
    }

    const { data, error } = await supabase
      .from("user_stickers")
      .upsert(
        {
          user_id: userId,
          user_album_id: userAlbumId,
          official_sticker_id: officialStickerId,
          quantity: Math.max(quantity, 0),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_album_id,official_sticker_id" },
      )
      .select()
      .single();

    if (error) throw error;
    return mapUserSticker(data);
  },
};

function mapUserAlbum(row: Record<string, unknown>): UserAlbum {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    albumEditionId: String(row.album_edition_id),
    collectionId: String(row.collection_id),
    checklistVariantId: String(row.checklist_variant_id),
    nickname: String(row.nickname),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function mapUserSticker(row: Record<string, unknown>): UserSticker {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    userAlbumId: String(row.user_album_id),
    officialStickerId: String(row.official_sticker_id),
    quantity: Number(row.quantity),
    condition: row.condition === "pasted" || row.condition === "damaged" ? row.condition : "new",
    notes: String(row.notes ?? ""),
    updatedAt: String(row.updated_at),
  };
}
