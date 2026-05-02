import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n";

type AlbumNavigationProps = {
  userAlbumId: string;
};

export function AlbumNavigation({ userAlbumId }: AlbumNavigationProps) {
  const { t } = useLocale();
  const albumSections = [
    { href: "digital", label: t.digitalAlbum },
    { href: "stickers", label: t.stickers },
    { href: "missing", label: t.missing },
    { href: "duplicates", label: t.duplicates },
    { href: "quick-add", label: t.quickAddNav },
  ];

  return (
    <nav className="flex flex-wrap gap-3">
      {albumSections.map((section) => (
        <Button asChild key={section.href} variant="outline">
          <Link href={`/albums/${userAlbumId}/${section.href}`}>
            {section.label}
          </Link>
        </Button>
      ))}
    </nav>
  );
}
