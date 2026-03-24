# Swagger UI + PostgREST Slave Server

Este proyecto es un servidor Express que integra y automatiza la ejecución de un binario de **PostgREST**, exponiendo simultáneamente una interfaz de **Swagger UI** para documentar y probar la API generada.

## Características principales

- **Automatización**: Al iniciar el proyecto, se levanta automáticamente el proceso de PostgREST.
- **Detección Multiplataforma**: Detecta si debe ejecutar `postgrest` (Linux/macOS) o `postgrest.exe` (Windows).
- **Documentación automática**: Swagger UI se configura para leer la especificación OpenAPI generada por PostgREST en tiempo real.
- **Soporte Multi-esquema**: Configurado para exponer los esquemas `api`, `public` y `auth`.
- **Mensajes informativos**: Proporciona feedback claro en la consola sobre el estado de los servicios.

---

## Requisitos previos

- **Node.js** (v18 o superior)
- **PostgreSQL**: Una base de datos en funcionamiento (por defecto configurada en `localhost:5430`).
- **Binario de PostgREST**: El archivo ejecutable `postgrest` (Linux/macOS) o `postgrest.exe` (Windows) debe estar en la raíz del proyecto.

---

## Instalación

1. Instala las dependencias de Node.js:
   ```bash
   npm install
   ```

2. (Solo Linux/macOS) Asegúrate de que el binario `postgrest` tenga permisos de ejecución:
   ```bash
   chmod +x postgrest
   ```

---

## Configuración

### 1. PostgREST (`postgrest.conf`)
El archivo `postgrest.conf` controla el comportamiento del motor de la API:

- `db-uri`: URI de conexión a PostgreSQL.
- `db-schemas`: Esquemas expuestos (`api, public, auth`).
- `db-anon-role`: Rol para peticiones no autenticadas (debe existir en la DB).
- `server-port`: Puerto donde corre PostgREST (por defecto `3000`).

### 2. Variables de Entorno (`.env`)
Configura el servidor de Swagger UI:

- `PORT`: Puerto para Swagger UI (por defecto `8080`).
- `POSTGREST_URL`: URL donde Swagger buscará la especificación (por defecto `http://localhost:3000`).

---

## Uso

Para iniciar ambos servicios (PostgREST y Swagger UI):

```bash
npm start
```

### Endpoints disponibles:
- **Swagger UI**: [http://localhost:8080/api-docs](http://localhost:8080/api-docs)
- **API (PostgREST)**: [http://localhost:3000](http://localhost:3000)

---

## Arquitectura y Detalles de Implementación

### Inicio de procesos multiplataforma
El archivo `index.js` detecta automáticamente el sistema operativo (`win32` para Windows) y selecciona el binario adecuado (`postgrest.exe` o `postgrest`). Utiliza `child_process.spawn` para iniciar el proceso como un hijo. Los logs de PostgREST se capturan y se muestran en la consola principal con el prefijo `[PostgREST]`.

### Flujo de Documentación
1. `index.js` inicia PostgREST.
2. PostgREST genera un documento OpenAPI en su raíz (`/`).
3. El middleware `swagger-ui-express` en el servidor Express consume ese documento y lo renderiza en `/api-docs`.

---

## Solución de problemas

- **Error de conexión a la DB**: Verifica que la `db-uri` en `postgrest.conf` sea correcta y que la base de datos sea accesible.
- **Swagger no carga la especificación**: Asegúrate de que PostgREST haya iniciado correctamente en el puerto `3000`.
- **Esquemas no visibles**: El rol `anon` debe tener permisos de `USAGE` sobre los esquemas configurados en la base de datos.
