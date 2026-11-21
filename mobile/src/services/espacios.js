import { api } from './api';

// GET /espacios?tipo=&q=  (incluye edificio y equipamiento)
export const listarEspacios = (filtros = {}) => api('/espacios', { params: filtros });

// GET /espacios/:id
export const obtenerEspacio = (id) => api(`/espacios/${id}`);

// GET /espacios/:id/disponibilidad?fecha=YYYY-MM-DD  -> { ocupado: [{ inicio, fin, estado }] }
export const disponibilidad = (id, fecha) => api(`/espacios/${id}/disponibilidad`, { params: { fecha } });
