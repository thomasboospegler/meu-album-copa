import { stickerProgressService } from "@/lib/services/stickerProgressService";
import { supabaseCatalogService } from "@/lib/services/supabaseCatalogService";
import { supabaseUserAlbumService } from "@/lib/services/supabaseUserAlbumService";

export const supabaseProgressService = {
  async getAlbumProgress(userAlbumId: string) {
    const album = await supabaseUserAlbumService.getAlbum(userAlbumId);

    if (!album) {
      return undefined;
    }

    const [stickers, userStickers] = await Promise.all([
      supabaseCatalogService.getOfficialStickers(album.checklistVariantId),
      supabaseUserAlbumService.getUserStickers(userAlbumId),
    ]);

    if (!stickers || !userStickers) {
      return undefined;
    }

    return stickerProgressService.getAlbumProgress(stickers, userStickers);
  },
};
