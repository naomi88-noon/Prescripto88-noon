import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { logger } from './config/logger';
import { testConnection, sequelize } from './db/sequelize';
import { errorHandler } from './middlewares/error';
import { authRouter } from './modules/auth/auth.routes';
import { doctorRouter } from './modules/doctors/doctor.routes';
import { appointmentRouter } from './modules/appointments/appointment.routes';
import { userRouter } from './modules/users/user.routes';
import { join } from 'path';



const app = express();
app.use(helmet());
app.use(cors({ origin: env.corsOrigins,  credentials: true }));
app.use(express.json());
// Static image serving
app.use('/static/doctor', express.static(join(process.cwd(), 'uploads', 'doctor'), {
  maxAge: '7d',
  immutable: true,
  setHeaders: (res, _path) => {
    // Allow frontend origin to load images
    res.setHeader('Access-Control-Allow-Origin', env.corsOrigin);
  },
}));

// OpenAPI docs (with optional basic auth + hot reload in dev)
const openapiPath = path.join(__dirname, '..', 'openapi.yaml');
function loadSpec() {
  try {
    const file = fs.readFileSync(openapiPath, 'utf8');
    return yaml.load(file);
  } catch (e) {
    logger.warn({ err: e }, 'Failed to load openapi.yaml');
    return null;
  }
}
let cachedSpec: any = loadSpec();

function docsAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (env.docs.disableAuth || (!env.docs.user && !env.docs.pass)) return next();
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Basic '))
    return res.set('WWW-Authenticate', 'Basic').status(401).send('Auth required');
  const decoded = Buffer.from(authHeader.split(' ')[1], 'base64').toString();
  const [user, pass] = decoded.split(':');
  if (user === env.docs.user && pass === env.docs.pass) return next();
  return res.set('WWW-Authenticate', 'Basic').status(401).send('Invalid credentials');
}

if (cachedSpec) {
  app.get('/docs.json', (_req, res) => {
    if (env.nodeEnv === 'development') {
      cachedSpec = loadSpec() || cachedSpec;
    }
    res.json(cachedSpec);
  });
  // Raw YAML download
  app.get('/docs/download', docsAuth, (_req, res) => {
    try {
      const yamlContent = fs.readFileSync(openapiPath, 'utf8');
      res.setHeader('Content-Type', 'application/yaml');
      res.setHeader('Content-Disposition', 'attachment; filename="openapi.yaml"');
      res.send(yamlContent);
    } catch (e) {
      res.status(500).json({ error: 'Spec not available' });
    }
  });
  app.use(
    '/docs',
    docsAuth,
    swaggerUi.serve,
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (env.nodeEnv === 'development') {
        cachedSpec = loadSpec() || cachedSpec;
      }
      return swaggerUi.setup(cachedSpec, {
        customSiteTitle: 'Consulto API Docs',
      })(req, res, next);
    }
  );
  // ReDoc alternative UI
  app.get('/redoc', docsAuth, (_req, res) => {
    const specUrl = '/docs.json';
    res.setHeader('Content-Type', 'text/html');
    res.end(`<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/><title>Consulto ReDoc</title>
<link rel="icon" href="data:,">
<style>body{margin:0;background:#0d1117;color:#fff;font-family:system-ui, sans-serif;} .top-link{position:fixed;top:8px;right:12px;z-index:10} a{color:#58a6ff}</style>
<script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script></head>
<body>
<div class="top-link"><a href="/docs" target="_self">Swagger UI</a> | <a href="/docs/download">Download YAML</a></div>
<redoc spec-url="${specUrl}" hide-download-button="false","http":{"get":"#2e8b57","post":"#1f6feb","patch":"#f39c12"}},"typography":{"fontSize":"14px","fontFamily":"system-ui, sans-serif"},"menu":{"backgroundColor":"#161b22"}}'></redoc>
</body></html>`);
  });
}

app.get('/health', (_req, res) => res.json({ status: 'ok', ts: Date.now() }));
app.use('/auth', authRouter);
app.use('/doctors', doctorRouter);
app.use('/appointments', appointmentRouter);
app.use('/users', userRouter);

app.use(errorHandler);

async function start() {
  try {
    await testConnection();
    await sequelize.sync();
    app.listen(env.port, () => logger.info(`API listening on :${env.port}`));
  } catch (err) {
    logger.error({ err }, 'Startup failed');
    process.exit(1);
  }
}

start();
