require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 8080; // Puerto donde vivirá Swagger UI, en este caso la URL raíz de PostgREST

// URL donde está corriendo PostgREST
const POSTGREST_URL = process.env.POSTGREST_URL || 'http://localhost:3000';

const options = {
  swaggerOptions: {
    url: `${POSTGREST_URL}/`, 
  },
};

// Ruta donde se ve la documentación
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, options));

app.listen(PORT, () => {
  console.log(`✅ Swagger UI disponible en: http://localhost:${PORT}/api-docs`);
  console.log(`🔗 Leyendo spec desde: ${POSTGREST_URL}`);
});