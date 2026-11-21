import { Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Boton, estilos } from '../components/ui';
import { API_URL } from '../config';

export default function PerfilScreen() {
  const { usuario, salir } = useAuth();
  return (
    <View style={[estilos.pantalla, { padding: 16 }]}>
      <View style={estilos.tarjeta}>
        <Text style={estilos.titulo}>{usuario.nombre}</Text>
        <Text style={estilos.suave}>{usuario.correo}</Text>
        <Text style={estilos.suave}>Rol: {usuario.rol}</Text>
      </View>
      <Text style={estilos.suave}>Servidor: {API_URL}</Text>
      <Boton titulo="Cerrar sesión" variante="peligro" onPress={salir} />
    </View>
  );
}
