import Link from "next/link";

import { Button } from "@/components/ui/button";

const albumSections = [
  { href: "digital", label: "Digital" },
  { href: "stickers", label: "Figurinhas" },
  { href: "missing", label: "Faltantes" },
  { href: "duplicates", label: "Repetidas" },
  { href: "quick-add", label: "Adição rápida" },
];

type AlbumNavigationProps = {
  userAlbumId: string;
};

export function AlbumNavigation({ userAlbumId }: AlbumNavigationProps) {
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
