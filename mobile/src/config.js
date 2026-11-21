import { Platform } from 'react-native';

// Dirección base de la API (Hito 3). Se cambia en mobile/.env con EXPO_PUBLIC_API_URL.
// Sin configurar: el emulador de Android usa 10.0.2.2 (alias de la PC) y el resto localhost.
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL || (Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000');

export const colores = {
  primario: '#0f766e',
  fondo: '#f4f6f8',
  tarjeta: '#ffffff',
  texto: '#1f2937',
  suave: '#6b7280',
  borde: '#d9dee3',
  error: '#b91c1c',
  errorFondo: '#fee2e2',
  ok: '#15803d',
  okFondo: '#dcfce7',
  aviso: '#b45309',
  avisoFondo: '#fef3c7',
};
