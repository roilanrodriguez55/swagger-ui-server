require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const { spawn } = require('child_process');
const path = require('path');

/**
 * Start PostgREST process
 */
function startPostgREST() {
  const isWindows = process.platform === 'win32';
  const binaryName = isWindows ? 'postgrest.exe' : 'postgrest';
  const postgrestPath = path.join(__dirname, binaryName);
  const configPath = path.join(__dirname, 'postgrest.conf');

  console.log(`🚀 Starting PostgREST (${binaryName})...`);
  
  const postgrest = spawn(postgrestPath, [configPath]);

  postgrest.stdout.on('data', (data) => {
    console.log(`[PostgREST] ${data}`);
  });

  postgrest.stderr.on('data', (data) => {
    // PostgREST sends logs to stderr by default, we just print them
    console.log(`[PostgREST] ${data.toString().trim()}`);
  });

  postgrest.on('close', (code) => {
    console.log(`[PostgREST] Process exited with code ${code}`);
  });

  return postgrest;
}

// Start PostgREST
startPostgREST();

const app = express();
const PORT = process.env.PORT || 8080; // Port for Swagger UI
const POSTGREST_URL = process.env.POSTGREST_URL || 'http://localhost:3000';

const options = {
  swaggerOptions: {
    url: '/openapi-spec',
  },
};

// Middleware to intercept OpenAPI spec and add security definitions (Swagger 2.0)
app.get('/openapi-spec', async (req, res) => {
  try {
    const response = await fetch(`${POSTGREST_URL}/`);
    const spec = await response.json();

    // Inject security definitions
    spec.securityDefinitions = {
      JWT: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        description: 'JWT Token. Formato: Bearer <token>'
      }
    };

    // Apply security globally
    spec.security = [
      {
        JWT: []
      }
    ];

    res.json(spec);
  } catch (error) {
    console.error('Error fetching OpenAPI spec:', error);
    res.status(500).json({ error: 'Error fetching OpenAPI spec' });
  }
});

// Route for documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, options));

app.listen(PORT, () => {
  console.log('\n--- INFO ---');
  console.log(`✅ Swagger UI available at: http://localhost:${PORT}/api-docs`);
  console.log(`🔗 Reading spec from: ${POSTGREST_URL}`);
  console.log('👉 Make sure your database is running and accessible as configured in postgrest.conf');
  console.log('------------\n');
});