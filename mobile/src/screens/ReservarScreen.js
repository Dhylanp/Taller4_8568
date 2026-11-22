import { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput } from 'react-native';
import { Aviso, Boton, Chip, estilos } from '../components/ui';
import { disponibilidad } from '../services/espacios';
import { crearReserva } from '../services/reservas';
import { ahoraChile, hora, proximosDias } from '../utils/fechas';

const DIAS = proximosDias(7);
const HORAS = Array.from({ length: 13 }, (_, i) => 8 + i); // 08:00 a 20:00
const DURACIONES = [1, 2, 3];
const pad = (n) => String(n).padStart(2, '0');

export default function ReservarScreen({ route, navigation }) {
  const { espacioId } = route.params;
  const [fecha, setFecha] = useState(DIAS[0].valor);
  const [inicio, setInicio] = useState(null);
  const [duracion, setDuracion] = useState(1);
  const [motivo, setMotivo] = useState('');
  const [ocupado, setOcupado] = useState([]);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    setInicio(null);
    disponibilidad(espacioId, fecha).then((d) => setOcupado(d.ocupado)).catch((e) => setError(e.message));
  }, [espacioId, fecha]);

  // Hoy no se pueden elegir horas que ya pasaron (el backend también lo valida)
  const ahora = ahoraChile();
  const pasada = (h) => fecha === ahora.fecha && h <= ahora.hora;

  // Un tramo [h, h+dur) choca si se solapa con alguna reserva activa de ese día.
  const choca = (h, dur) => ocupado.some((o) => {
    const oi = Number(hora(o.inicio).slice(0, 2)) + Number(hora(o.inicio).slice(3)) / 60;
    const of = Number(hora(o.fin).slice(0, 2)) + Number(hora(o.fin).slice(3)) / 60;
    return h < of && h + dur > oi;
  });

  async function enviar() {
    if (inicio === null) return setError('Elige la hora de inicio');
    if (pasada(inicio)) return setError('Esa hora ya pasó, elige una posterior')
    if (inicio + duracion > 24) return setError('La reserva debe terminar el mismo día');
    if (choca(inicio, duracion)) return setError('Ese tramo ya está ocupado, elige otro horario');
    setError(''); setEnviando(true);
    try {
      await crearReserva({
        espacioId,
        inicio: `${fecha}T${pad(inicio)}:00:00`,
        fin: `${fecha}T${pad(inicio + duracion)}:00:00`,
        motivo: motivo.trim() || undefined,
      });
      navigation.navigate('Inicio', { screen: 'MisReservas', params: { nueva: Date.now() } });
    } catch (e) { setError(e.message); } finally { setEnviando(false); }
  }

  return (
    <ScrollView style={estilos.pantalla} contentContainerStyle={{ padding: 14 }} keyboardShouldPersistTaps="handled">
      <Text style={estilos.etiqueta}>Fecha</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {DIAS.map((d) => <Chip key={d.valor} texto={d.etiqueta} activo={fecha === d.valor} onPress={() => setFecha(d.valor)} />)}
      </ScrollView>

      <Text style={estilos.etiqueta}>Duración</Text>
      <ScrollView horizontal contentContainerStyle={{ gap: 8 }}>
        {DURACIONES.map((d) => <Chip key={d} texto={`${d} h`} activo={duracion === d} onPress={() => setDuracion(d)} />)}
      </ScrollView>

      <Text style={estilos.etiqueta}>Hora de inicio (ocupadas o pasadas aparecen deshabilitadas)</Text>
      <ScrollView horizontal={false} contentContainerStyle={estilos.fila}>
        {HORAS.map((h) => (
          <Chip key={h} texto={`${pad(h)}:00`} activo={inicio === h} deshabilitado={pasada(h) || choca(h, duracion)} onPress={() => setInicio(h)} />
        ))}
      </ScrollView>

      <Text style={estilos.etiqueta}>Motivo (opcional)</Text>
      <TextInput style={estilos.input} value={motivo} onChangeText={setMotivo} placeholder="Ej: estudio grupal" />

      <Aviso texto={error} />
      <Boton titulo="Solicitar reserva" onPress={enviar} cargando={enviando} />
    </ScrollView>
  );
}
