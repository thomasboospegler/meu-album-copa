import { DigitalAlbum } from "@/components/album/digital-album";

type DigitalAlbumPageProps = {
  params: Promise<{ userAlbumId: string }>;
};

export default async function DigitalAlbumPage({
  params,
}: DigitalAlbumPageProps) {
  const { userAlbumId } = await params;

  return <DigitalAlbum userAlbumId={userAlbumId} />;
}
