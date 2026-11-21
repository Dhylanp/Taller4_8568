# App móvil – Gestión de Espacios Universitarios (Hito 4)

Segundo cliente del sistema del Hito 3: una app **React Native (Expo)** que consume la **misma API REST** (NestJS + PostgreSQL + MongoDB). No tiene backend ni base de datos propios; todo lo que se hace en el celular queda guardado en la API y se ve en la web.

```
Web React (:5173)   App móvil Expo
        \              /
         API REST (:3000)
          /          \
   PostgreSQL       MongoDB
```

## Funcionalidades (caso: gestión de espacios, punto 3.1 del enunciado)
| Flujo | Pantalla |
|---|---|
| Iniciar / cerrar sesión (JWT guardado en el dispositivo) | Login, Perfil |
| Consultar edificios, salas y laboratorios (buscar por nombre, filtrar por tipo) con capacidad y estado | Espacios |
| Ver equipamiento y disponibilidad por día | Detalle de espacio |
| Solicitar una reserva (fecha, duración, hora; horas ocupadas deshabilitadas) | Reservar |
| Consultar reservas propias y su estado; cancelar una reserva | Mis reservas |

Estados de interfaz: carga, error con botón "Reintentar", lista vacía, mensajes de confirmación y validaciones (formato de correo, campos obligatorios, tramo ocupado, errores del backend como "Conflicto de horario" o "No se puede reservar en el pasado").

## Cómo ejecutarla
Requisitos: Node 18+ y la API del Hito 3 corriendo (`docker compose up -d --build` en la raíz del repo).

```bash
cd mobile
cp .env.example .env      # y ajustar EXPO_PUBLIC_API_URL (ver abajo)
npm install
npx expo start            # escanear el QR con Expo Go, o pulsar "a" (Android) / "w" (navegador)
```

### Dirección base de la API
Se configura en `mobile/.env` con `EXPO_PUBLIC_API_URL` (sin `/` al final). Tras cambiarla, reiniciar `npx expo start`.

| Dónde corre la app | Valor |
|---|---|
| Navegador (`w`) / simulador iOS | `http://localhost:3000` |
| Emulador de Android | `http://10.0.2.2:3000` |
| Celular físico (Expo Go, misma WiFi que la PC) | `http://<IP de tu PC>:3000` (ver con `ipconfig`) |

Si no se define, el emulador de Android usa `10.0.2.2` y el resto `localhost`. En un celular físico puede ser necesario permitir el puerto 3000 en el firewall de Windows.

Usuario de prueba (seed): `dhylan@unab.cl` / `Admin1234`.

## Estructura
```
mobile/
  App.js                 navegación (pestañas + pila) y sesión
  src/config.js          dirección de la API y colores
  src/services/          api.js (único módulo HTTP), auth.js, espacios.js, reservas.js
  src/context/           AuthContext (sesión)
  src/components/ui.js   botón, chips, insignias de estado, pantallas de carga/error/vacío
  src/screens/           Login, Espacios, DetalleEspacio, Reservar, MisReservas, Perfil
  src/utils/fechas.js    manejo de fechas y horas
```

## Endpoints de la API que usa la app
| Método y ruta | Uso |
|---|---|
| `POST /auth/login` | Iniciar sesión |
| `GET /espacios?tipo=&q=` | Listado con edificio y equipamiento |
| `GET /espacios/:id` | Detalle, capacidad y equipamiento |
| `GET /espacios/:id/disponibilidad?fecha=` | Tramos ocupados del día |
| `POST /reservas` | Solicitar reserva (el backend valida conflictos y pasado) |
| `GET /reservas/mias` | Reservas del usuario |
| `PATCH /reservas/:id/cancelar` | Cancelar reserva propia |

Las reglas de negocio (conflictos, estados, auditoría en MongoDB) están en el backend; la app solo valida lo básico antes de enviar.

## Comprobar que se refleja en la web
1. En la app: reservar un espacio → aparece en "Mis reservas" como PENDIENTE.
2. En la web (`http://localhost:5173`, mismo usuario): la reserva aparece en "Mis reservas"; un administrador puede aprobarla.
3. Cancelarla desde la app y recargar la web: queda CANCELADA. También se puede verificar en Swagger (`http://localhost:3000/docs`).

## Capturas
Ver `docs/capturas/` (login, espacios, detalle, reservar, mis reservas).

## Uso de herramientas de IA
Se usó Claude (Anthropic) como asistente para generar el esqueleto de la app, los servicios, las pantallas y esta documentación, a partir del enunciado y de los endpoints del Hito 3. El equipo revisó el código, probó los flujos contra la API real (login, listado, reserva, conflicto de horario, cancelación) y decidió el alcance mínimo (solo los flujos obligatorios del caso). Los datos provienen siempre de la API; no hay datos hardcodeados.
