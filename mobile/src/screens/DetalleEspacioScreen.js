import { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Boton, Chip, Estado, estilos } from '../components/ui';
import { disponibilidad, obtenerEspacio } from '../services/espacios';
import { hora, proximosDias } from '../utils/fechas';
import { colores } from '../config';

const DIAS = proximosDias(7);

export default function DetalleEspacioScreen({ route, navigation }) {
  const { id } = route.params;
  const [espacio, setEspacio] = useState(null);
  const [fecha, setFecha] = useState(DIAS[0].valor);
  const [ocupado, setOcupado] = useState(null);
  const [error, setError] = useState('');

  const cargar = useCallback(async () => {
    setError('');
    try { setEspacio(await obtenerEspacio(id)); } catch (e) { setError(e.message); }
  }, [id]);
  useEffect(() => { cargar(); }, [cargar]);

  useEffect(() => {
    setOcupado(null);
    disponibilidad(id, fecha).then((d) => setOcupado(d.ocupado)).catch((e) => setError(e.message));
  }, [id, fecha]);

  if (!espacio) return <Estado cargando={!error} error={error} reintentar={cargar} />;

  return (
    <ScrollView style={estilos.pantalla} contentContainerStyle={{ padding: 14 }}>
      <View style={estilos.tarjeta}>
        <Text style={estilos.titulo}>{espacio.nombre}</Text>
        <Text style={estilos.suave}>{espacio.edificio.nombre} · piso {espacio.piso} · {espacio.tipo}</Text>
        <Text style={{ marginTop: 8 }}>Capacidad: {espacio.capacidad} personas</Text>
        <Text style={{ color: espacio.disponible ? colores.ok : colores.error, fontWeight: '600' }}>
          {espacio.disponible ? 'Disponible para reservas' : 'No disponible para reservas'}
        </Text>
        {!!espacio.descripcion && <Text style={[estilos.suave, { marginTop: 6 }]}>{espacio.descripcion}</Text>}
      </View>

      <Text style={estilos.etiqueta}>Equipamiento</Text>
      {espacio.equipamiento.length === 0
        ? <Text style={estilos.suave}>Sin equipamiento registrado</Text>
        : espacio.equipamiento.map((x) => (
          <Text key={x.equipamientoId}>• {x.equipamiento.nombre}{x.cantidad > 1 ? ` (x${x.cantidad})` : ''}</Text>
        ))}

      <Text style={estilos.etiqueta}>Disponibilidad</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {DIAS.map((d) => <Chip key={d.valor} texto={d.etiqueta} activo={fecha === d.valor} onPress={() => setFecha(d.valor)} />)}
      </ScrollView>
      <View style={{ marginTop: 10 }}>
        <Estado cargando={!ocupado && !error} error={error} />
        {ocupado && (ocupado.length === 0
          ? <Text style={{ color: colores.ok }}>Todo el día libre</Text>
          : ocupado.map((o) => (
            <Text key={o.id} style={{ color: colores.error }}>Ocupado {hora(o.inicio)} – {hora(o.fin)} ({o.estado})</Text>
          )))}
      </View>
      <Boton titulo="Reservar este espacio" deshabilitado={!espacio.disponible}
        onPress={() => navigation.navigate('Reservar', { espacioId: id })} />
    </ScrollView>
  );
}
