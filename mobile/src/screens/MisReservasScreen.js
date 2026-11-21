import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Platform, Text, View } from 'react-native';
import { Aviso, Boton, Estado, Insignia, estilos } from '../components/ui';
import { cancelarReserva, misReservas } from '../services/reservas';
import { rango } from '../utils/fechas';

const confirmar = (texto, alAceptar) => {
  if (Platform.OS === 'web') { if (window.confirm(texto)) alAceptar(); return; }
  Alert.alert('Confirmar', texto, [{ text: 'No' }, { text: 'Sí, cancelar', style: 'destructive', onPress: alAceptar }]);
};

export default function MisReservasScreen({ route }) {
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cancelando, setCancelando] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true); setError('');
    try { setReservas(await misReservas()); } catch (e) { setError(e.message); } finally { setCargando(false); }
  }, []);

  // Se recarga al abrir y cada vez que se crea una reserva nueva (param "nueva")
  useEffect(() => {
    cargar();
    if (route.params?.nueva) setMensaje('Reserva solicitada: queda PENDIENTE hasta que un administrador la apruebe');
  }, [cargar, route.params?.nueva]);

  const cancelar = (r) => confirmar(`¿Cancelar la reserva de ${r.espacio.nombre}?`, async () => {
    setCancelando(r.id); setMensaje(''); setError('');
    try { await cancelarReserva(r.id); setMensaje('Reserva cancelada'); await cargar(); }
    catch (e) { setError(e.message); } finally { setCancelando(null); }
  });

  return (
    <View style={estilos.pantalla}>
      <View style={{ paddingHorizontal: 12 }}><Aviso tipo="ok" texto={mensaje} /></View>
      <Estado cargando={cargando && !reservas.length} error={error} reintentar={cargar}
        vacio={!cargando && !error && !reservas.length} textoVacio="Aún no tienes reservas. Elige un espacio y solicítala." />
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
            <Text style={estilos.suave}>{r.espacio.edificio.nombre}</Text>
            <Text style={{ marginTop: 6 }}>{rango(r.inicio, r.fin)}</Text>
            {!!r.motivo && <Text style={estilos.suave}>Motivo: {r.motivo}</Text>}
            {(r.estado === 'PENDIENTE' || r.estado === 'APROBADA') && (
              <Boton titulo="Cancelar reserva" variante="peligro" cargando={cancelando === r.id} onPress={() => cancelar(r)} />
            )}
          </View>
        )}
      />
    </View>
  );
}
