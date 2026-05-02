import type { UserAlbum } from "@/types/album";
import type { UserSticker } from "@/types/sticker";
import { readFromLocalStorage, writeToLocalStorage } from "@/lib/storage/local-storage";
import { collectionService } from "@/lib/services/collectionService";
import { supabaseUserAlbumService } from "@/lib/services/supabaseUserAlbumService";

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
  async getAlbumsAsync() {
    try {
      return (await supabaseUserAlbumService.getAlbums()) ?? this.getAlbums();
    } catch {
      return this.getAlbums();
    }
  },
  getAlbum(userAlbumId: string) {
    return this.getAlbums().find((album) => album.id === userAlbumId);
  },
  async getAlbumAsync(userAlbumId: string) {
    try {
      return (await supabaseUserAlbumService.getAlbum(userAlbumId)) ?? this.getAlbum(userAlbumId);
    } catch {
      return this.getAlbum(userAlbumId);
    }
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
  async createAlbumAsync(albumEditionId: string, nickname?: string) {
    try {
      return (await supabaseUserAlbumService.createAlbum(albumEditionId, nickname)) ??
        this.createAlbum(albumEditionId, nickname);
    } catch {
      return this.createAlbum(albumEditionId, nickname);
    }
  },
  getUserStickers(userAlbumId: string) {
    return readFromLocalStorage<UserSticker[]>(stickersKey(userAlbumId), []);
  },
  async getUserStickersAsync(userAlbumId: string) {
    try {
      return (await supabaseUserAlbumService.getUserStickers(userAlbumId)) ??
        this.getUserStickers(userAlbumId);
    } catch {
      return this.getUserStickers(userAlbumId);
    }
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
  async setStickerQuantityAsync(
    userAlbumId: string,
    officialStickerId: string,
    quantity: number,
  ) {
    try {
      return (await supabaseUserAlbumService.setStickerQuantity(
        userAlbumId,
        officialStickerId,
        quantity,
      )) ?? this.setStickerQuantity(userAlbumId, officialStickerId, quantity);
    } catch {
      return this.setStickerQuantity(userAlbumId, officialStickerId, quantity);
    }
  },
  incrementSticker(userAlbumId: string, officialStickerId: string) {
    const current =
      this.getUserStickers(userAlbumId).find(
        (sticker) => sticker.officialStickerId === officialStickerId,
      )?.quantity ?? 0;

    return this.setStickerQuantity(userAlbumId, officialStickerId, current + 1);
  },
  async incrementStickerAsync(userAlbumId: string, officialStickerId: string) {
    const current =
      (await this.getUserStickersAsync(userAlbumId)).find(
        (sticker) => sticker.officialStickerId === officialStickerId,
      )?.quantity ?? 0;

    return this.setStickerQuantityAsync(userAlbumId, officialStickerId, current + 1);
  },
  decrementSticker(userAlbumId: string, officialStickerId: string) {
    const current =
      this.getUserStickers(userAlbumId).find(
        (sticker) => sticker.officialStickerId === officialStickerId,
      )?.quantity ?? 0;

    return this.setStickerQuantity(userAlbumId, officialStickerId, current - 1);
  },
  async decrementStickerAsync(userAlbumId: string, officialStickerId: string) {
    const current =
      (await this.getUserStickersAsync(userAlbumId)).find(
        (sticker) => sticker.officialStickerId === officialStickerId,
      )?.quantity ?? 0;

    return this.setStickerQuantityAsync(userAlbumId, officialStickerId, current - 1);
  },
};
