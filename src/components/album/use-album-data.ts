"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { collectionService } from "@/lib/services/collectionService";
import { stickerProgressService } from "@/lib/services/stickerProgressService";
import { userAlbumService } from "@/lib/services/userAlbumService";
import type { UserAlbum } from "@/types/album";
import type { AlbumEdition, ChecklistSection, Collection } from "@/types/collection";
import type { OfficialSticker, UserSticker } from "@/types/sticker";

const albumLoadTimeoutMs = 8000;

export function useAlbumData(userAlbumId: string) {
  const [album, setAlbum] = useState<UserAlbum>();
  const [edition, setEdition] = useState<AlbumEdition>();
  const [collection, setCollection] = useState<Collection>();
  const [sections, setSections] = useState<ChecklistSection[]>([]);
  const [stickers, setStickers] = useState<OfficialSticker[]>([]);
  const [userStickers, setUserStickers] = useState<UserSticker[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string>();

  const refresh = useCallback(async () => {
    try {
      setError(undefined);

      const [nextAlbum, nextUserStickers] = await withTimeout(
        Promise.all([
          userAlbumService.getAlbumAsync(userAlbumId),
          userAlbumService.getUserStickersAsync(userAlbumId),
        ]),
        albumLoadTimeoutMs,
      );

      setAlbum(nextAlbum);
      setUserStickers(nextUserStickers);

      if (nextAlbum) {
        const [nextEdition, nextCollection, nextSections, nextStickers] =
          await withTimeout(
            Promise.all([
              collectionService.getEditionAsync(nextAlbum.albumEditionId),
              collectionService.getCollectionAsync(nextAlbum.collectionId),
              collectionService.getSectionsAsync(nextAlbum.checklistVariantId),
              collectionService.getStickersAsync(nextAlbum.checklistVariantId),
            ]),
            albumLoadTimeoutMs,
          );

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
    } catch (loadError) {
      console.error("Could not load album data.", loadError);
      setAlbum(undefined);
      setEdition(undefined);
      setCollection(undefined);
      setSections([]);
      setStickers([]);
      setUserStickers([]);
      setError(loadError instanceof Error ? loadError.message : "Album load failed.");
    } finally {
      setReady(true);
    }
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
    error,
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

function withTimeout<T>(promise: Promise<T>, timeoutMs: number) {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      window.setTimeout(
        () => reject(new Error("Album data request timed out.")),
        timeoutMs,
      );
    }),
  ]);
}
