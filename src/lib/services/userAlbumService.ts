import type { UserAlbum } from "@/types/album";
import type { UserSticker } from "@/types/sticker";
import { readFromLocalStorage, writeToLocalStorage } from "@/lib/storage/local-storage";
import { collectionService } from "@/lib/services/collectionService";

const userId = "local-user";
const albumsKey = "user-albums";

function stickersKey(userAlbumId: string) {
  return `user-stickers:${userAlbumId}`;
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const userAlbumService = {
  getUserId() {
    return userId;
  },
  getAlbums() {
    return readFromLocalStorage<UserAlbum[]>(albumsKey, []);
  },
  getAlbum(userAlbumId: string) {
    return this.getAlbums().find((album) => album.id === userAlbumId);
  },
  createAlbum(albumEditionId: string, nickname?: string) {
    const edition = collectionService.getEdition(albumEditionId);

    if (!edition) {
      throw new Error("Edição de álbum não encontrada.");
    }

    const now = new Date().toISOString();
    const album: UserAlbum = {
      id: makeId("album"),
      userId,
      albumEditionId: edition.id,
      collectionId: edition.collectionId,
      checklistVariantId: edition.checklistVariantId,
      nickname: nickname?.trim() || edition.editionName,
      createdAt: now,
      updatedAt: now,
    };

    writeToLocalStorage(albumsKey, [album, ...this.getAlbums()]);
    writeToLocalStorage<UserSticker[]>(stickersKey(album.id), []);

    return album;
  },
  getUserStickers(userAlbumId: string) {
    return readFromLocalStorage<UserSticker[]>(stickersKey(userAlbumId), []);
  },
  saveUserStickers(userAlbumId: string, stickers: UserSticker[]) {
    writeToLocalStorage(stickersKey(userAlbumId), stickers);
  },
  setStickerQuantity(userAlbumId: string, officialStickerId: string, quantity: number) {
    const now = new Date().toISOString();
    const stickers = this.getUserStickers(userAlbumId);
    const nextQuantity = Math.max(quantity, 0);
    const existing = stickers.find(
      (sticker) => sticker.officialStickerId === officialStickerId,
    );
    const nextSticker: UserSticker = existing
      ? { ...existing, quantity: nextQuantity, updatedAt: now }
      : {
          id: makeId("sticker"),
          userId,
          userAlbumId,
          officialStickerId,
          quantity: nextQuantity,
          condition: "new",
          notes: "",
          updatedAt: now,
        };
    const nextStickers = existing
      ? stickers.map((sticker) =>
          sticker.officialStickerId === officialStickerId ? nextSticker : sticker,
        )
      : [...stickers, nextSticker];

    this.saveUserStickers(userAlbumId, nextStickers);
    return nextSticker;
  },
  incrementSticker(userAlbumId: string, officialStickerId: string) {
    const current =
      this.getUserStickers(userAlbumId).find(
        (sticker) => sticker.officialStickerId === officialStickerId,
      )?.quantity ?? 0;

    return this.setStickerQuantity(userAlbumId, officialStickerId, current + 1);
  },
  decrementSticker(userAlbumId: string, officialStickerId: string) {
    const current =
      this.getUserStickers(userAlbumId).find(
        (sticker) => sticker.officialStickerId === officialStickerId,
      )?.quantity ?? 0;

    return this.setStickerQuantity(userAlbumId, officialStickerId, current - 1);
  },
};
