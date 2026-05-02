import type { UserAlbum } from "@/types/album";
import type { UserSticker } from "@/types/sticker";
import { readFromLocalStorage } from "@/lib/storage/local-storage";
import { supabaseUserAlbumService } from "@/lib/services/supabaseUserAlbumService";

const localAlbumsKey = "user-albums";

function localStickersKey(userAlbumId: string) {
  return `user-stickers:${userAlbumId}`;
}

export const localStorageMigrationService = {
  getLocalSnapshot() {
    const albums = readFromLocalStorage<UserAlbum[]>(localAlbumsKey, []);
    const stickers = albums.flatMap((album) =>
      readFromLocalStorage<UserSticker[]>(localStickersKey(album.id), []),
    );

    return {
      albums,
      stickers,
      albumCount: albums.length,
      stickerCount: stickers.length,
    };
  },

  async migrateToSupabase() {
    const snapshot = this.getLocalSnapshot();
    const migratedAlbums: UserAlbum[] = [];
    let migratedStickers = 0;

    for (const localAlbum of snapshot.albums) {
      const createdAlbum = await supabaseUserAlbumService.createAlbum(
        localAlbum.albumEditionId,
        localAlbum.nickname,
      );

      if (!createdAlbum) {
        continue;
      }

      migratedAlbums.push(createdAlbum);

      const stickers = readFromLocalStorage<UserSticker[]>(
        localStickersKey(localAlbum.id),
        [],
      );

      for (const sticker of stickers) {
        await supabaseUserAlbumService.setStickerQuantity(
          createdAlbum.id,
          sticker.officialStickerId,
          sticker.quantity,
        );
        migratedStickers += 1;
      }
    }

    return {
      sourceAlbums: snapshot.albumCount,
      sourceStickers: snapshot.stickerCount,
      migratedAlbums: migratedAlbums.length,
      migratedStickers,
    };
  },
};
