import { hora } from './fechas';

// QR de una reserva APROBADA, generado con la API pública goQR.me (QR Server), igual que en la web.
// La imagen la descarga el teléfono directamente desde internet; no pasa por nuestra API.
// Documentación: https://goqr.me/api/doc/create-qr-code/
const API_QR = 'https://api.qrserver.com/v1/create-qr-code/';

// Mismo contenido que el QR de la web: RESERVA:id | espacio | fecha | horario | nombre
export const textoQR = (r, nombre) =>
  [`RESERVA:${r.id}`, r.espacio.nombre, r.inicio.slice(0, 10), `${hora(r.inicio)} - ${hora(r.fin)}`, nombre].join('|');

export const urlQR = (r, nombre, size = 300) =>
  `${API_QR}?size=${size}x${size}&margin=10&format=png&data=${encodeURIComponent(textoQR(r, nombre))}`;
