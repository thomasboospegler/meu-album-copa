import { StickerList } from "@/components/album/sticker-list";

type StickersPageProps = {
  params: Promise<{ userAlbumId: string }>;
};

export default async function StickersPage({ params }: StickersPageProps) {
  const { userAlbumId } = await params;

  return <StickerList userAlbumId={userAlbumId} />;
}
