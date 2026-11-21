import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import PerfilScreen from './src/screens/PerfilScreen';
import EspaciosScreen from './src/screens/EspaciosScreen';
import DetalleEspacioScreen from './src/screens/DetalleEspacioScreen';
import ReservarScreen from './src/screens/ReservarScreen';
import MisReservasScreen from './src/screens/MisReservasScreen';
import { colores } from './src/config';

const Tabs = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Principal() {
  return (
    <Tabs.Navigator screenOptions={{ tabBarActiveTintColor: colores.primario }}>
      <Tabs.Screen name="Espacios" component={EspaciosScreen} />
      <Tabs.Screen name="MisReservas" component={MisReservasScreen} options={{ title: 'Mis reservas' }} />
      <Tabs.Screen name="Perfil" component={PerfilScreen} />
    </Tabs.Navigator>
  );
}

function Raiz() {
  const { usuario, cargando } = useAuth();
  if (cargando) return <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator size="large" color={colores.primario} /></View>;
  if (!usuario) return <LoginScreen />;
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Inicio" component={Principal} options={{ headerShown: false }} />
        <Stack.Screen name="DetalleEspacio" component={DetalleEspacioScreen} options={({ route }) => ({ title: route.params.nombre })} />
        <Stack.Screen name="Reservar" component={ReservarScreen} options={{ title: 'Solicitar reserva' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider><Raiz /></AuthProvider>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
