# Guía para probar la app móvil (Hito 4)

Todo se hace en una terminal de Windows (PowerShell). Reemplaza `<carpeta>` por la ruta donde esté el repo.

## 0. Requisitos (una sola vez)
- **Docker Desktop** instalado y abierto.
- **Node.js 18 o superior** (`node -v` para comprobarlo).
- En el celular: app **Expo Go** (Play Store / App Store).
- Una cuenta gratis de Expo (https://expo.dev/signup). Se usa el mismo usuario en la PC y en Expo Go.
- El celular y el PC deben estar en la **misma red WiFi**.

## 1. Levantar la API y la web (Hito 3)
```powershell
cd <carpeta>
copy .env.example .env        # solo la primera vez
docker compose up -d --build
```
Esperar ~1 minuto. Comprobar en el navegador del PC:
- API (Swagger): http://localhost:3000/docs
- Web: http://localhost:5173

Si es una base nueva o cambiaste la clave del seed: `docker compose down -v` y volver a levantar.

## 2. Obtener la IP del PC
```powershell
ipconfig
```
Copiar la **Dirección IPv4** del bloque *Adaptador de LAN inalámbrica Wi-Fi* (ej. `192.168.1.50`). Ignorar los bloques vEthernet / WSL / Docker.

Comprobar desde el **navegador del celular**: `http://<IP>:3000/docs` debe mostrar Swagger.
Si no carga: revisar que esté en la misma WiFi y permitir el puerto 3000 en el Firewall de Windows (como administrador):
```powershell
netsh advfirewall firewall add rule name="API Espacios 3000" dir=in action=allow protocol=TCP localport=3000
```

## 3. Configurar y ejecutar la app
```powershell
cd <carpeta>\mobile
copy .env.example .env
notepad .env
```
Dejar una sola línea con la IP completa, **con `http://` y `:3000`**:
```
EXPO_PUBLIC_API_URL=http://192.168.1.50:3000
```
Luego:
```powershell
npm install
npx expo login        # una sola vez, con la cuenta de Expo
npx expo start -c
```
> No ejecutar `npm audit fix --force`: baja Expo y rompe el proyecto.

En el celular: iniciar sesión en Expo Go con la **misma cuenta** (pestaña Profile) y escanear el QR (Android: desde Expo Go; iPhone: con la cámara).
Al abrir la app, abajo del login debe decir `Servidor: http://<IP>:3000`.

Otras formas de ejecutar:
| Dónde | `EXPO_PUBLIC_API_URL` |
|---|---|
| Emulador Android | `http://10.0.2.2:3000` |
| Navegador / simulador iOS | `http://localhost:3000` (requiere agregar `http://localhost:8081` a `CORS_ORIGIN` del `.env` raíz) |

Cada vez que se cambie `mobile/.env` hay que reiniciar con `npx expo start -c`.

## 4. Usuarios de prueba
| Usuario | Clave | Rol |
|---|---|---|
| `dhylan@unab.cl` | `Admin1234` | ADMIN (ve la pestaña Solicitudes) |
| un usuario común | crearlo en la web (Registro) | usuario normal |

## 5. Recorrido de prueba (lo que se muestra en la defensa)
1. **Validación:** en el login escribir un correo inválido → aparece el mensaje de error.
2. **Consulta:** iniciar sesión; en *Espacios* buscar por nombre y filtrar por tipo; abrir un espacio y ver capacidad, equipamiento y disponibilidad por día.
3. **Crear:** *Reservar este espacio* → elegir día, duración y hora (las horas pasadas y ocupadas salen deshabilitadas) → *Solicitar reserva*. Aparece en *Mis reservas* como PENDIENTE.
4. **Error del backend:** intentar reservar el mismo tramo con otra cuenta o desde la web → "Conflicto de horario".
5. **Reflejo en la web:** abrir http://localhost:5173 con el mismo usuario → la reserva aparece.
6. **Administrador:** con `dhylan@unab.cl` abrir la pestaña *Solicitudes* → Aprobar o Rechazar; el usuario ve el nuevo estado en *Mis reservas* (deslizar hacia abajo para recargar).
7. **Cancelar:** en *Mis reservas* cancelar una reserva → queda CANCELADA también en la web.

## 6. Problemas frecuentes
| Síntoma | Causa y solución |
|---|---|
| "Error inesperado del servidor" al iniciar sesión | La URL del `.env` está incompleta (falta `http://` o `:3000`). Corregir y `npx expo start -c`. |
| "No se pudo conectar con el servidor" | Docker apagado, otra WiFi o firewall. Probar `http://<IP>:3000/docs` en el celular. |
| "You need to be signed in to Expo Go" | Hacer `npx expo login` y entrar con la misma cuenta en Expo Go. |
| Clave `Admin1234` no entra | Base antigua: `docker compose down -v` y `docker compose up -d --build`. |
| Cambié el `.env` y no pasa nada | Reiniciar con `npx expo start -c` y recargar la app. |
| La IP cambió (otra red) | Volver a ejecutar `ipconfig`, actualizar `mobile/.env` y reiniciar Expo. |
