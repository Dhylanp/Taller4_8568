// La API guarda y devuelve las horas "tal como se envían" (sin zona), por eso se leen del texto ISO
// y no con Date (que las movería según la zona horaria del teléfono).
const DIAS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const pad = (n) => String(n).padStart(2, '0');

export const aTexto = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// Hora actual de Chile (la misma zona con que el backend valida "no reservar en el pasado").
// Devuelve { fecha: 'YYYY-MM-DD', hora: 0-23 }. Si el teléfono no soporta zonas, usa su hora local.
export function ahoraChile() {
  try {
    const t = new Date().toLocaleString('sv-SE', { timeZone: 'America/Santiago' }); // "2026-11-20 14:35:10"
    if (/^\d{4}-\d{2}-\d{2} \d{2}:/.test(t)) return { fecha: t.slice(0, 10), hora: Number(t.slice(11, 13)) };
  } catch { /* se usa la hora local */ }
  const d = new Date();
  return { fecha: aTexto(d), hora: d.getHours() };
}

// Próximos n días desde hoy (en Chile): [{ valor: '2026-11-20', etiqueta: 'vie 20' }]
export function proximosDias(n = 7) {
  const [a, m, dd] = ahoraChile().fecha.split('-').map(Number);
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(a, m - 1, dd + i);
    return { valor: aTexto(d), etiqueta: `${DIAS[d.getDay()]} ${d.getDate()}` };
  });
}

export const hora = (iso) => iso.slice(11, 16);
export const dia = (iso) => iso.slice(8, 10) + '-' + iso.slice(5, 7) + '-' + iso.slice(0, 4);
export const rango = (ini, fin) => `${dia(ini)}  ${hora(ini)} – ${hora(fin)}`;
