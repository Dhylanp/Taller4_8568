import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import PerfilScreen from './src/screens/PerfilScreen';
import { colores } from './src/config';

const Tabs = createBottomTabNavigator();

function Raiz() {
  const { usuario, cargando } = useAuth();
  if (cargando) return <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator size="large" color={colores.primario} /></View>;
  if (!usuario) return <LoginScreen />;
  return (
    <NavigationContainer>
      <Tabs.Navigator screenOptions={{ tabBarActiveTintColor: colores.primario }}>
        <Tabs.Screen name="Perfil" component={PerfilScreen} />
      </Tabs.Navigator>
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
