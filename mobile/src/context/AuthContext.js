import { createContext, useContext, useEffect, useState } from 'react';
import { leerSesion, registrarExpiracion } from '../services/api';
import { iniciarSesion, cerrarSesion } from '../services/auth';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    leerSesion().then((s) => { setUsuario(s); setCargando(false); });
    registrarExpiracion(() => { cerrarSesion(); setUsuario(null); });
  }, []);

  const entrar = async (correo, clave) => setUsuario(await iniciarSesion(correo, clave));
  const salir = async () => { await cerrarSesion(); setUsuario(null); };

  return <Ctx.Provider value={{ usuario, cargando, entrar, salir }}>{children}</Ctx.Provider>;
}
