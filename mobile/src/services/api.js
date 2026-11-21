import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

const CLAVE = 'sesionEspacios';
let alExpirar = null; // el contexto de sesión registra aquí qué hacer ante un 401

export const registrarExpiracion = (fn) => { alExpirar = fn; };

export async function leerSesion() {
  try { return JSON.parse(await AsyncStorage.getItem(CLAVE)); } catch { return null; }
}
export const guardarSesion = (s) => AsyncStorage.setItem(CLAVE, JSON.stringify(s));
export const borrarSesion = () => AsyncStorage.removeItem(CLAVE);

// Único punto de comunicación HTTP/JSON con la API del Hito 3.
export async function api(ruta, { metodo = 'GET', cuerpo, params } = {}) {
  const query = params
    ? '?' + new URLSearchParams(Object.entries(params).filter(([, v]) => v !== '' && v != null)).toString()
    : '';
  const token = (await leerSesion())?.token;
  let resp;
  try {
    resp = await fetch(API_URL + ruta + query, {
      method: metodo,
      headers: {
        ...(cuerpo ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: cuerpo ? JSON.stringify(cuerpo) : undefined,
    });
  } catch {
    throw new Error(`No se pudo conectar con el servidor (${API_URL}). Revisa la red y la dirección de la API.`);
  }
  if (resp.status === 401 && token && alExpirar) alExpirar();
  const datos = await resp.json().catch(() => null);
  if (!resp.ok) {
    const m = datos?.message;
    throw new Error(Array.isArray(m) ? m.join('. ') : m ?? 'Error inesperado del servidor');
  }
  return datos;
}
