import { GroupedStickerList } from "@/components/album/grouped-sticker-list";

type MissingPageProps = {
  params: Promise<{ userAlbumId: string }>;
};

export default async function MissingPage({ params }: MissingPageProps) {
  const { userAlbumId } = await params;

  return <GroupedStickerList mode="missing" userAlbumId={userAlbumId} />;
}
