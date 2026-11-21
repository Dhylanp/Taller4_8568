import { api } from './api';

// GET /reservas/mias
export const misReservas = () => api('/reservas/mias');

// POST /reservas  { espacioId, inicio, fin, motivo }  (fechas "YYYY-MM-DDTHH:MM:SS")
export const crearReserva = (datos) => api('/reservas', { metodo: 'POST', cuerpo: datos });

// PATCH /reservas/:id/cancelar
export const cancelarReserva = (id) => api(`/reservas/${id}/cancelar`, { metodo: 'PATCH' });
