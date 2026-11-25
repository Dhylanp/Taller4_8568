import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Platform, ScrollView, Text, View } from 'react-native';
import { Aviso, Boton, Chip, Estado, Insignia, estilos } from '../components/ui';
import { aprobarReserva, cancelarReserva, rechazarReserva, todasLasReservas } from '../services/reservas';
import { rango } from '../utils/fechas';

const ESTADOS = ['PENDIENTE', 'APROBADA', 'RECHAZADA', 'CANCELADA'];

const confirmar = (texto, alAceptar) => {
  if (Platform.OS === 'web') { if (window.confirm(texto)) alAceptar(); return; }
  Alert.alert('Confirmar', texto, [{ text: 'No' }, { text: 'Sí', onPress: alAceptar }]);
};

// Pantalla solo para administradores: revisar solicitudes de todos los usuarios.
export default function SolicitudesScreen() {
  const [estado, setEstado] = useState('PENDIENTE');
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [accion, setAccion] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true); setError('');
    try { setReservas(await todasLasReservas(estado)); } catch (e) { setError(e.message); } finally { setCargando(false); }
  }, [estado]);
  useEffect(() => { cargar(); }, [cargar]);

  const ejecutar = (r, fn, texto, ok) => confirmar(`${texto} ${r.espacio.nombre} (${r.usuario.nombre})?`, async () => {
    setAccion(r.id); setMensaje(''); setError('');
    try { await fn(r.id); setMensaje(ok); await cargar(); }
    catch (e) { setError(e.message); } finally { setAccion(null); }
  });

  return (
    <View style={estilos.pantalla}>
      <View style={{ padding: 12, paddingBottom: 0 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {ESTADOS.map((e) => <Chip key={e} texto={e} activo={estado === e} onPress={() => setEstado(e)} />)}
        </ScrollView>
        <Aviso tipo="ok" texto={mensaje} />
      </View>
      <Estado cargando={cargando && !reservas.length} error={error} reintentar={cargar}
        vacio={!cargando && !error && !reservas.length} textoVacio={`No hay solicitudes ${estado.toLowerCase()}s`} />
      <FlatList
        data={reservas}
        keyExtractor={(r) => String(r.id)}
        contentContainerStyle={{ padding: 12 }}
        refreshing={cargando && reservas.length > 0}
        onRefresh={cargar}
        renderItem={({ item: r }) => (
          <View style={estilos.tarjeta}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={estilos.titulo}>{r.espacio.nombre}</Text>
              <Insignia estado={r.estado} />
            </View>
            <Text style={estilos.suave}>{r.usuario.nombre} · {r.usuario.correo}</Text>
            <Text style={{ marginTop: 6 }}>{rango(r.inicio, r.fin)}</Text>
            {!!r.motivo && <Text style={estilos.suave}>Motivo: {r.motivo}</Text>}
            {r.estado === 'PENDIENTE' && (
              <>
                <Boton titulo="Aprobar" cargando={accion === r.id} onPress={() => ejecutar(r, aprobarReserva, '¿Aprobar', 'Reserva aprobada')} />
                <Boton titulo="Rechazar" variante="peligro" deshabilitado={accion === r.id} onPress={() => ejecutar(r, rechazarReserva, '¿Rechazar', 'Reserva rechazada')} />
              </>
            )}
            {r.estado === 'APROBADA' && (
              <Boton titulo="Cancelar" variante="peligro" cargando={accion === r.id} onPress={() => ejecutar(r, cancelarReserva, '¿Cancelar', 'Reserva cancelada')} />
            )}
          </View>
        )}
      />
    </View>
  );
}
