"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { collectionService } from "@/lib/services/collectionService";
import { stickerProgressService } from "@/lib/services/stickerProgressService";
import { userAlbumService } from "@/lib/services/userAlbumService";
import type { UserAlbum } from "@/types/album";
import type { AlbumEdition, ChecklistSection, Collection } from "@/types/collection";
import type { OfficialSticker, UserSticker } from "@/types/sticker";

export function useAlbumData(userAlbumId: string) {
  const [album, setAlbum] = useState<UserAlbum>();
  const [edition, setEdition] = useState<AlbumEdition>();
  const [collection, setCollection] = useState<Collection>();
  const [sections, setSections] = useState<ChecklistSection[]>([]);
  const [stickers, setStickers] = useState<OfficialSticker[]>([]);
  const [userStickers, setUserStickers] = useState<UserSticker[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    const [nextAlbum, nextUserStickers] = await Promise.all([
      userAlbumService.getAlbumAsync(userAlbumId),
      userAlbumService.getUserStickersAsync(userAlbumId),
    ]);

    setAlbum(nextAlbum);
    setUserStickers(nextUserStickers);

    if (nextAlbum) {
      const [nextEdition, nextCollection, nextSections, nextStickers] =
        await Promise.all([
          collectionService.getEditionAsync(nextAlbum.albumEditionId),
          collectionService.getCollectionAsync(nextAlbum.collectionId),
          collectionService.getSectionsAsync(nextAlbum.checklistVariantId),
          collectionService.getStickersAsync(nextAlbum.checklistVariantId),
        ]);

      setEdition(nextEdition);
      setCollection(nextCollection);
      setSections(nextSections);
      setStickers(nextStickers);
    } else {
      setEdition(undefined);
      setCollection(undefined);
      setSections([]);
      setStickers([]);
    }

    setReady(true);
  }, [userAlbumId]);

  useEffect(() => {
    queueMicrotask(refresh);
  }, [refresh]);

  const userStickerMap = useMemo(
    () => stickerProgressService.toUserStickerMap(userStickers),
    [userStickers],
  );
  const progress = stickerProgressService.getAlbumProgress(stickers, userStickers);
  const sectionProgress = stickerProgressService.getSectionProgress(
    sections,
    stickers,
    userStickers,
  );

  const increment = (officialStickerId: string) => {
    userAlbumService
      .incrementStickerAsync(userAlbumId, officialStickerId)
      .then(refresh);
  };

  const decrement = (officialStickerId: string) => {
    userAlbumService
      .decrementStickerAsync(userAlbumId, officialStickerId)
      .then(refresh);
  };

  return {
    ready,
    album,
    edition,
    collection,
    sections,
    stickers,
    userStickerMap,
    progress,
    sectionProgress,
    increment,
    decrement,
    refresh,
  };
}
