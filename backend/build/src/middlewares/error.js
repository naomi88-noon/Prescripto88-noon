"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const logger_1 = require("../config/logger");
function errorHandler(err, _req, res, _next) {
    logger_1.logger.error({ err }, 'Unhandled error');
    const status = err.status || 500;
    res.status(status).json({
        error: {
            code: err.code || 'INTERNAL_ERROR',
            message: err.message || 'Internal Server Error',
        },
    });
}
