import type { ChecklistSection } from "@/types/collection";
import type { OfficialSticker, UserSticker } from "@/types/sticker";
import type { SectionProgress } from "@/types/progress";

export function hasSticker(userSticker?: UserSticker) {
  return (userSticker?.quantity ?? 0) >= 1;
}

export function getDuplicateQuantity(userSticker?: UserSticker) {
  return Math.max((userSticker?.quantity ?? 0) - 1, 0);
}

export function getCompletionPercentage(collected: number, total: number) {
  if (total <= 0) {
    return 0;
  }

  return Math.round((collected / total) * 100);
}

export function getSectionProgress(
  section: ChecklistSection,
  stickers: OfficialSticker[],
  userStickerByOfficialId: Map<string, UserSticker>,
): SectionProgress {
  const sectionStickers = stickers.filter(
    (sticker) => sticker.sectionId === section.id,
  );
  const collected = sectionStickers.filter((sticker) =>
    hasSticker(userStickerByOfficialId.get(sticker.id)),
  ).length;
  const duplicates = sectionStickers.reduce(
    (total, sticker) =>
      total + getDuplicateQuantity(userStickerByOfficialId.get(sticker.id)),
    0,
  );

  return {
    sectionId: section.id,
    sectionName: section.name,
    total: sectionStickers.length,
    collected,
    missing: sectionStickers.length - collected,
    duplicates,
    percentage: getCompletionPercentage(collected, sectionStickers.length),
  };
}
