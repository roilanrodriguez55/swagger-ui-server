# Swagger UI para PostgREST

Este proyecto es un pequeño servidor Express que expone una instancia de **Swagger UI** para visualizar y probar la especificación OpenAPI generada por un servidor **PostgREST**.

La UI de Swagger se sirve en la ruta `/api-docs` y consume automáticamente el documento OpenAPI expuesto por PostgREST.

---

## Requisitos previos

- **Node.js** (versión 18 o superior recomendada)
- Un servidor **PostgREST** accesible vía HTTP (por ejemplo en `http://localhost:3000`)
- Git (opcional, pero recomendado)

---

## Instalación

Clona el repositorio (o copia los archivos del proyecto) y luego instala las dependencias:

```bash
npm install
```

Esto instalará:

- `express`: servidor HTTP
- `swagger-ui-express`: middleware que sirve la UI de Swagger
- `dotenv`: manejo de variables de entorno

---

## Configuración del entorno

El proyecto utiliza **variables de entorno** para definir:

- `PORT`: puerto donde se expone Swagger UI.
- `POSTGREST_URL`: URL base donde está corriendo PostgREST.

### Archivo `.env`

1. Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

2. Edita `.env` con los valores adecuados para tu entorno:

```env
PORT=8080
POSTGREST_URL=http://localhost:3000
```

- `PORT`: puerto donde se expondrá Swagger UI, por defecto `8080`.
- `POSTGREST_URL`: URL base de tu servidor PostgREST.  
  - Por ejemplo, si PostgREST corre en `http://localhost:3000`, y allí expone el documento OpenAPI en la raíz (`/`), puedes dejar el valor por defecto.

> **Nota:** El archivo `.env` está ignorado por Git mediante `.gitignore`. No lo subas al repositorio.

---

## Cómo funciona

El archivo principal es `index.js`:

- Carga las variables de entorno mediante `dotenv`.
- Configura un servidor Express.
- Configura Swagger UI en la ruta `/api-docs`.
- Apunta Swagger UI al JSON de OpenAPI que sirve PostgREST desde `POSTGREST_URL`.

En tiempo de ejecución:

- El servidor escucha en el puerto definido por `PORT` o usa `8080` como valor por defecto.
- Swagger UI consulta la especificación en `POSTGREST_URL` (por ejemplo, `http://localhost:3000/`).

---

## Arrancar el servidor

Una vez configurado el archivo `.env` y con las dependencias instaladas:

```bash
npm start
```

Por defecto, verás en la consola algo como:

- `Swagger UI disponible en: http://localhost:8080/api-docs`
- `Leyendo spec desde: http://localhost:3000`

Abre tu navegador en:

```text
http://localhost:8080/api-docs
```

Ahí podrás ver la documentación interactiva de tu API PostgREST.

---

## Personalización

- **Puerto del servidor Swagger UI**: cambia `PORT` en tu `.env`.
- **Origen de la especificación OpenAPI**: cambia `POSTGREST_URL` en tu `.env` para apuntar a otro servidor PostgREST (por ejemplo, un entorno de staging o producción).

---

## Problemas comunes

- **La página `/api-docs` no muestra nada o da error de carga de la spec**  
  - Verifica que `POSTGREST_URL` sea accesible desde el servidor donde corre este proyecto.
  - Comprueba que PostgREST esté sirviendo correctamente su especificación OpenAPI en la ruta configurada (por defecto la raíz `/`).

- **El servidor no arranca**  
  - Asegúrate de haber ejecutado `npm install`.
  - Comprueba que el puerto definido en `PORT` no esté siendo utilizado por otro proceso.
