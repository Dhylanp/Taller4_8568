import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Aviso, Boton, estilos } from '../components/ui';
import { API_URL, colores } from '../config';

export default function LoginScreen() {
  const { entrar } = useAuth();
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function enviar() {
    if (!correo.trim() || !clave) return setError('Ingresa tu correo y tu clave');
    if (!/^\S+@\S+\.\S+$/.test(correo.trim())) return setError('El correo no tiene un formato válido');
    setError(''); setCargando(true);
    try { await entrar(correo, clave); } catch (e) { setError(e.message); setCargando(false); }
  }

  return (
    <KeyboardAvoidingView style={estilos.pantalla} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: 24, justifyContent: 'center', flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <Text style={{ fontSize: 26, fontWeight: '800', color: colores.primario }}>Espacios UNAB</Text>
        <Text style={[estilos.suave, { marginBottom: 20 }]}>Reserva salas y laboratorios desde tu celular</Text>

        <Text style={estilos.etiqueta}>Correo</Text>
        <TextInput style={estilos.input} value={correo} onChangeText={setCorreo} autoCapitalize="none"
          keyboardType="email-address" placeholder="nombre@unab.cl" />
        <Text style={estilos.etiqueta}>Clave</Text>
        <TextInput style={estilos.input} value={clave} onChangeText={setClave} secureTextEntry
          placeholder="Tu clave" onSubmitEditing={enviar} />

        <Aviso texto={error} />
        <Boton titulo="Ingresar" onPress={enviar} cargando={cargando} />
        <View style={{ marginTop: 24 }}><Text style={estilos.suave}>Servidor: {API_URL}</Text></View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
