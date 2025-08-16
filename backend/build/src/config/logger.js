"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const pino_1 = __importDefault(require("pino"));
function buildLogger() {
    const base = {
        level: process.env.LOG_LEVEL || 'info',
    };
    if (process.env.NODE_ENV === 'development') {
        try {
            base.transport = { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:standard' } };
        }
        catch (e) {
            // Fallback silently to no transport
        }
    }
    return (0, pino_1.default)(base);
}
exports.logger = buildLogger();
