import { GroupedStickerList } from "@/components/album/grouped-sticker-list";

type DuplicatesPageProps = {
  params: Promise<{ userAlbumId: string }>;
};

export default async function DuplicatesPage({ params }: DuplicatesPageProps) {
  const { userAlbumId } = await params;

  return <GroupedStickerList mode="duplicates" userAlbumId={userAlbumId} />;
}
