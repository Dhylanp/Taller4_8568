// La API guarda y devuelve las horas "tal como se envían" (sin zona), por eso se leen del texto ISO
// y no con Date (que las movería según la zona horaria del teléfono).
const DIAS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const pad = (n) => String(n).padStart(2, '0');

export const aTexto = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// Próximos n días desde hoy: [{ valor: '2026-11-20', etiqueta: 'vie 20' }]
export function proximosDias(n = 7) {
  const hoy = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + i);
    return { valor: aTexto(d), etiqueta: `${DIAS[d.getDay()]} ${d.getDate()}` };
  });
}

export const hora = (iso) => iso.slice(11, 16);
export const dia = (iso) => iso.slice(8, 10) + '-' + iso.slice(5, 7) + '-' + iso.slice(0, 4);
export const rango = (ini, fin) => `${dia(ini)}  ${hora(ini)} – ${hora(fin)}`;
