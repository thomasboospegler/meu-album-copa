"use client";

import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n";

type StickerQuantityControlsProps = {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
};

export function StickerQuantityControls({
  quantity,
  onIncrement,
  onDecrement,
}: StickerQuantityControlsProps) {
  const { t } = useLocale();

  return (
    <div className="flex items-center gap-1">
      <Button
        aria-label={t.decreaseQuantity}
        onClick={(event) => {
          event.stopPropagation();
          onDecrement();
        }}
        size="icon-sm"
        type="button"
        variant="outline"
      >
        <Minus />
      </Button>
      <span className="grid h-7 min-w-8 place-items-center rounded-lg bg-muted px-2 text-sm font-semibold">
        {quantity}
      </span>
      <Button
        aria-label={t.increaseQuantity}
        onClick={(event) => {
          event.stopPropagation();
          onIncrement();
        }}
        size="icon-sm"
        type="button"
      >
        <Plus />
      </Button>
    </div>
  );
}
