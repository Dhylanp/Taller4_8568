import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Chip, Estado, estilos } from '../components/ui';
import { listarEspacios } from '../services/espacios';
import { colores } from '../config';

export default function EspaciosScreen({ navigation }) {
  const [espacios, setEspacios] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [tipo, setTipo] = useState('');
  const [q, setQ] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargar = useCallback(async () => {
    setCargando(true); setError('');
    try {
      const lista = await listarEspacios({ tipo, q: q.trim() });
      setEspacios(lista);
      if (!tipo && !q.trim()) setTipos([...new Set(lista.map((e) => e.tipo))]);
    } catch (e) { setError(e.message); } finally { setCargando(false); }
  }, [tipo, q]);

  useEffect(() => { const t = setTimeout(cargar, 300); return () => clearTimeout(t); }, [cargar]);

  return (
    <View style={estilos.pantalla}>
      <View style={{ padding: 12, paddingBottom: 4 }}>
        <TextInput style={estilos.input} value={q} onChangeText={setQ} placeholder="Buscar por nombre…" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }} contentContainerStyle={{ gap: 8 }}>
          <Chip texto="Todos" activo={!tipo} onPress={() => setTipo('')} />
          {tipos.map((t) => <Chip key={t} texto={t} activo={tipo === t} onPress={() => setTipo(t)} />)}
        </ScrollView>
      </View>
      <Estado cargando={cargando && !espacios.length} error={error} reintentar={cargar}
        vacio={!cargando && !error && !espacios.length} textoVacio="No hay espacios que coincidan con la búsqueda" />
      <FlatList
        data={espacios}
        keyExtractor={(e) => String(e.id)}
        contentContainerStyle={{ padding: 12 }}
        refreshing={cargando && espacios.length > 0}
        onRefresh={cargar}
        renderItem={({ item: e }) => (
          <Pressable style={estilos.tarjeta} onPress={() => navigation.navigate('DetalleEspacio', { id: e.id, nombre: e.nombre })}>
            <Text style={estilos.titulo}>{e.nombre}</Text>
            <Text style={estilos.suave}>{e.edificio.nombre} · piso {e.piso} · {e.tipo}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
              <Text style={{ color: colores.texto }}>Capacidad: {e.capacidad}</Text>
              <Text style={{ color: e.disponible ? colores.ok : colores.error, fontWeight: '600' }}>
                {e.disponible ? 'Disponible' : 'No disponible'}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}
