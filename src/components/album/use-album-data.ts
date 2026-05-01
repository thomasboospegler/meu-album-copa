"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { collectionService } from "@/lib/services/collectionService";
import { stickerProgressService } from "@/lib/services/stickerProgressService";
import { userAlbumService } from "@/lib/services/userAlbumService";
import type { UserAlbum } from "@/types/album";
import type { UserSticker } from "@/types/sticker";

export function useAlbumData(userAlbumId: string) {
  const [album, setAlbum] = useState<UserAlbum>();
  const [userStickers, setUserStickers] = useState<UserSticker[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setAlbum(userAlbumService.getAlbum(userAlbumId));
    setUserStickers(userAlbumService.getUserStickers(userAlbumId));
    setReady(true);
  }, [userAlbumId]);

  useEffect(() => {
    queueMicrotask(refresh);
  }, [refresh]);

  const edition = album
    ? collectionService.getEdition(album.albumEditionId)
    : undefined;
  const collection = album
    ? collectionService.getCollection(album.collectionId)
    : undefined;
  const sections = album
    ? collectionService.getSections(album.checklistVariantId)
    : [];
  const stickers = album
    ? collectionService.getStickers(album.checklistVariantId)
    : [];

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
    userAlbumService.incrementSticker(userAlbumId, officialStickerId);
    refresh();
  };

  const decrement = (officialStickerId: string) => {
    userAlbumService.decrementSticker(userAlbumId, officialStickerId);
    refresh();
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
