"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const env_1 = require("./config/env");
const logger_1 = require("./config/logger");
const sequelize_1 = require("./db/sequelize");
const error_1 = require("./middlewares/error");
const auth_routes_1 = require("./modules/auth/auth.routes");
const doctor_routes_1 = require("./modules/doctors/doctor.routes");
const appointment_routes_1 = require("./modules/appointments/appointment.routes");
const user_routes_1 = require("./modules/users/user.routes");
const path_2 = require("path");
const allowedOrigins = env_1.env.corsOrigins.length ? env_1.env.corsOrigins : [env_1.env.corsOrigin];
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: allowedOrigins, credentials: true }));
app.use(express_1.default.json());
// Static image serving
app.use('/static/doctor', express_1.default.static((0, path_2.join)(process.cwd(), 'uploads', 'doctor'), {
    maxAge: '7d',
    immutable: true,
    setHeaders: (res, _path) => {
        // Allow frontend origin to load images
        res.setHeader('Access-Control-Allow-Origin', env_1.env.corsOrigin);
    },
}));
// OpenAPI docs (with optional basic auth + hot reload in dev)
const openapiPath = path_1.default.join(__dirname, '..', 'openapi.yaml');
function loadSpec() {
    try {
        const file = fs_1.default.readFileSync(openapiPath, 'utf8');
        return js_yaml_1.default.load(file);
    }
    catch (e) {
        logger_1.logger.warn({ err: e }, 'Failed to load openapi.yaml');
        return null;
    }
}
let cachedSpec = loadSpec();
function docsAuth(req, res, next) {
    if (env_1.env.docs.disableAuth || (!env_1.env.docs.user && !env_1.env.docs.pass))
        return next();
    const authHeader = req.headers.authorization;
    if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Basic ')))
        return res.set('WWW-Authenticate', 'Basic').status(401).send('Auth required');
    const decoded = Buffer.from(authHeader.split(' ')[1], 'base64').toString();
    const [user, pass] = decoded.split(':');
    if (user === env_1.env.docs.user && pass === env_1.env.docs.pass)
        return next();
    return res.set('WWW-Authenticate', 'Basic').status(401).send('Invalid credentials');
}
if (cachedSpec) {
    app.get('/docs.json', (_req, res) => {
        if (env_1.env.nodeEnv === 'development') {
            cachedSpec = loadSpec() || cachedSpec;
        }
        res.json(cachedSpec);
    });
    // Raw YAML download
    app.get('/docs/download', docsAuth, (_req, res) => {
        try {
            const yamlContent = fs_1.default.readFileSync(openapiPath, 'utf8');
            res.setHeader('Content-Type', 'application/yaml');
            res.setHeader('Content-Disposition', 'attachment; filename="openapi.yaml"');
            res.send(yamlContent);
        }
        catch (e) {
            res.status(500).json({ error: 'Spec not available' });
        }
    });
    app.use('/docs', docsAuth, swagger_ui_express_1.default.serve, (req, res, next) => {
        if (env_1.env.nodeEnv === 'development') {
            cachedSpec = loadSpec() || cachedSpec;
        }
        return swagger_ui_express_1.default.setup(cachedSpec, {
            customSiteTitle: 'Consulto API Docs',
        })(req, res, next);
    });
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
app.use('/auth', auth_routes_1.authRouter);
app.use('/doctors', doctor_routes_1.doctorRouter);
app.use('/appointments', appointment_routes_1.appointmentRouter);
app.use('/users', user_routes_1.userRouter);
app.use(error_1.errorHandler);
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, sequelize_1.testConnection)();
            yield sequelize_1.sequelize.sync();
            app.listen(env_1.env.port, () => logger_1.logger.info(`API listening on :${env_1.env.port}`));
        }
        catch (err) {
            logger_1.logger.error({ err }, 'Startup failed');
            process.exit(1);
        }
    });
}
start();
