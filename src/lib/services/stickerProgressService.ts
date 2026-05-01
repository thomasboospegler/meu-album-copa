import type { ChecklistSection } from "@/types/collection";
import type { OfficialSticker, UserSticker } from "@/types/sticker";
import type { AlbumProgress } from "@/types/progress";
import {
  getCompletionPercentage,
  getDuplicateQuantity,
  getSectionProgress,
  hasSticker,
} from "@/lib/utils/progress";

export const stickerProgressService = {
  toUserStickerMap(userStickers: UserSticker[]) {
    return new Map(
      userStickers.map((userSticker) => [userSticker.officialStickerId, userSticker]),
    );
  },
  getAlbumProgress(stickers: OfficialSticker[], userStickers: UserSticker[]): AlbumProgress {
    const userStickerMap = this.toUserStickerMap(userStickers);
    const collectedUnique = stickers.filter((sticker) =>
      hasSticker(userStickerMap.get(sticker.id)),
    ).length;
    const duplicates = stickers.reduce(
      (total, sticker) => total + getDuplicateQuantity(userStickerMap.get(sticker.id)),
      0,
    );
    const specialCollected = stickers.filter((sticker) => {
      const isSpecial =
        sticker.stickerType === "special" || sticker.stickerType === "golden-baller";
      return isSpecial && hasSticker(userStickerMap.get(sticker.id));
    }).length;

    return {
      totalStickers: stickers.length,
      collectedUnique,
      missing: stickers.length - collectedUnique,
      duplicates,
      completionPercentage: getCompletionPercentage(collectedUnique, stickers.length),
      specialCollected,
    };
  },
  getSectionProgress(
    sections: ChecklistSection[],
    stickers: OfficialSticker[],
    userStickers: UserSticker[],
  ) {
    const userStickerMap = this.toUserStickerMap(userStickers);
    return sections.map((section) =>
      getSectionProgress(section, stickers, userStickerMap),
    );
  },
};
