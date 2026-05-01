import { AlbumDashboard } from "@/components/album/album-dashboard";

type AlbumPageProps = {
  params: Promise<{ userAlbumId: string }>;
};

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { userAlbumId } = await params;

  return <AlbumDashboard userAlbumId={userAlbumId} />;
}
