import Link from "next/link";

import { Button } from "@/components/ui/button";

export function AlbumNotFound() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col justify-center gap-4 px-5 py-10">
      <p className="text-sm font-medium text-muted-foreground">Álbum não encontrado</p>
      <h1 className="text-3xl font-semibold tracking-normal">Crie ou escolha um álbum físico</h1>
      <p className="text-muted-foreground">
        Os álbuns desta primeira versão ficam salvos no localStorage deste navegador.
      </p>
      <div className="flex gap-2">
        <Button asChild>
          <Link href="/onboarding">Novo álbum</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/albums">Meus álbuns</Link>
        </Button>
      </div>
    </main>
  );
}
