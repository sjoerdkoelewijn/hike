// Lichte markdown-renderer: lege regel = nieuwe alinea, **vet**, [tekst](url), en
// een blok van regels die met "- " beginnen wordt een lijst. Enkele newline = <br>.

function esc(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function inline(s: string): string {
  let out = esc(s);
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,
    (_m, t, u) => `<a href="${u}" target="_blank" rel="noopener">${t}</a>`);
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/\n/g, '<br>');
  return out;
}

export function mdToHtml(md: unknown): string {
  if (!md) return '';
  const blocks = String(md).replace(/\r\n/g, '\n').trim().split(/\n{2,}/);
  return blocks
    .map((b) => {
      const lines = b.split('\n');
      if (lines.length && lines.every((l) => /^\s*-\s+/.test(l))) {
        const items = lines.map((l) => `<li>${inline(l.replace(/^\s*-\s+/, ''))}</li>`).join('');
        return `<ul>${items}</ul>`;
      }
      return `<p>${inline(b)}</p>`;
    })
    .join('');
}
