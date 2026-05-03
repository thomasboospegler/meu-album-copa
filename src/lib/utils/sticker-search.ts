export function normalizeStickerSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .replace(/^([a-z]+)0+(\d+)$/, "$1$2");
}

export function stickerMatchesSearch(
  query: string,
  values: Array<number | string | undefined>,
) {
  const normalizedQuery = normalizeStickerSearch(query);

  if (!normalizedQuery) return true;

  return values.some((value) => {
    if (value === undefined) return false;

    const normalizedValue = normalizeStickerSearch(String(value));
    return normalizedValue.includes(normalizedQuery);
  });
}
