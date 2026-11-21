import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { colores } from '../config';

export function Boton({ titulo, onPress, cargando, deshabilitado, variante = 'primario' }) {
  const off = cargando || deshabilitado;
  return (
    <Pressable
      onPress={onPress}
      disabled={off}
      style={[s.boton, variante === 'peligro' && s.peligro, variante === 'borde' && s.borde, off && { opacity: 0.5 }]}
    >
      {cargando ? <ActivityIndicator color="#fff" /> : (
        <Text style={[s.botonTxt, variante === 'borde' && { color: colores.primario }]}>{titulo}</Text>
      )}
    </Pressable>
  );
}

export function Chip({ texto, activo, onPress, deshabilitado }) {
  return (
    <Pressable onPress={onPress} disabled={deshabilitado} style={[s.chip, activo && s.chipOn, deshabilitado && { opacity: 0.35 }]}>
      <Text style={[s.chipTxt, activo && { color: '#fff' }]}>{texto}</Text>
    </Pressable>
  );
}

const TONOS = {
  APROBADA: [colores.okFondo, colores.ok],
  PENDIENTE: [colores.avisoFondo, colores.aviso],
  RECHAZADA: [colores.errorFondo, colores.error],
  CANCELADA: ['#e5e7eb', colores.suave],
};
export function Insignia({ estado }) {
  const [bg, fg] = TONOS[estado] ?? TONOS.CANCELADA;
  return <Text style={[s.insignia, { backgroundColor: bg, color: fg }]}>{estado}</Text>;
}

// Estados de interfaz: carga, error (con reintento) y sin resultados.
export function Estado({ cargando, error, vacio, textoVacio, reintentar }) {
  if (cargando) return <View style={s.centro}><ActivityIndicator size="large" color={colores.primario} /><Text style={s.suave}>Cargando…</Text></View>;
  if (error) return (
    <View style={s.centro}>
      <Text style={s.error}>{error}</Text>
      {reintentar && <Boton titulo="Reintentar" onPress={reintentar} variante="borde" />}
    </View>
  );
  if (vacio) return <View style={s.centro}><Text style={s.suave}>{textoVacio}</Text></View>;
  return null;
}

export const Aviso = ({ tipo = 'error', texto }) => texto ? (
  <Text style={[s.aviso, tipo === 'ok'
    ? { backgroundColor: colores.okFondo, color: colores.ok }
    : { backgroundColor: colores.errorFondo, color: colores.error }]}>{texto}</Text>
) : null;

export const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  tarjeta: { backgroundColor: colores.tarjeta, borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colores.borde },
  titulo: { fontSize: 17, fontWeight: '700', color: colores.texto },
  suave: { color: colores.suave, fontSize: 13 },
  etiqueta: { fontWeight: '600', color: colores.texto, marginTop: 14, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: colores.borde, borderRadius: 10, padding: 12, backgroundColor: '#fff', fontSize: 16 },
  fila: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});

const s = StyleSheet.create({
  boton: { backgroundColor: colores.primario, padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 12 },
  peligro: { backgroundColor: colores.error },
  borde: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colores.primario },
  botonTxt: { color: '#fff', fontWeight: '700', fontSize: 15 },
  chip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: colores.borde, backgroundColor: '#fff' },
  chipOn: { backgroundColor: colores.primario, borderColor: colores.primario },
  chipTxt: { color: colores.texto, fontSize: 14 },
  insignia: { fontSize: 11, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, overflow: 'hidden', alignSelf: 'flex-start' },
  centro: { padding: 30, alignItems: 'center', gap: 10 },
  suave: { color: colores.suave, textAlign: 'center' },
  error: { color: colores.error, textAlign: 'center' },
  aviso: { padding: 10, borderRadius: 8, marginTop: 10, overflow: 'hidden' },
});
