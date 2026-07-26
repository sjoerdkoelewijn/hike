export function slugify(input: string): string {
  return String(input || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // accenten weg
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'sectie';
}

// Geeft elke blok een uniek anker (op basis van de kop), zodat menu en sectie matchen.
export function withAnchors<T extends { title?: string }>(blocks: T[]): (T & { _anchor: string })[] {
  const seen = new Map<string, number>();
  return (blocks || []).map((b, i) => {
    let base = slugify(b?.title || `sectie-${i + 1}`);
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    if (n > 0) base = `${base}-${n + 1}`;
    return { ...b, _anchor: base };
  });
}
