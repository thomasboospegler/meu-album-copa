import { QuickAdd } from "@/components/album/quick-add";

type QuickAddPageProps = {
  params: Promise<{ userAlbumId: string }>;
};

export default async function QuickAddPage({ params }: QuickAddPageProps) {
  const { userAlbumId } = await params;

  return <QuickAdd userAlbumId={userAlbumId} />;
}
