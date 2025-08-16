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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
exports.testConnection = testConnection;
const sequelize_1 = require("sequelize");
const env_1 = require("../config/env");
const logger_1 = require("../config/logger");
exports.sequelize = new sequelize_1.Sequelize(env_1.env.db, {
    dialect: 'postgres',
    logging: (msg) => logger_1.logger.debug(msg),
});
function testConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.sequelize.authenticate();
            logger_1.logger.info('Database connection established');
        }
        catch (err) {
            logger_1.logger.error({ err }, 'Database connection failed');
            throw err;
        }
    });
}
