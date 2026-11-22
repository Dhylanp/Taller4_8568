import { api } from './api';

// GET /reservas/mias
export const misReservas = () => api('/reservas/mias');

// POST /reservas  { espacioId, inicio, fin, motivo }  (fechas "YYYY-MM-DDTHH:MM:SS")
export const crearReserva = (datos) => api('/reservas', { metodo: 'POST', cuerpo: datos });

// PATCH /reservas/:id/cancelar
export const cancelarReserva = (id) => api(`/reservas/${id}/cancelar`, { metodo: 'PATCH' });

// --- Solo ADMIN ---
// GET /reservas?estado=  (todas las reservas, con el usuario que las pidió)
export const todasLasReservas = (estado) => api('/reservas', { params: { estado } });

// PATCH /reservas/:id/aprobar  y  /rechazar
export const aprobarReserva = (id) => api(`/reservas/${id}/aprobar`, { metodo: 'PATCH' });
export const rechazarReserva = (id) => api(`/reservas/${id}/rechazar`, { metodo: 'PATCH' });
