import { Sequelize } from 'sequelize';
import { env } from '../config/env';
import { logger } from '../config/logger';

export const sequelize = new Sequelize(env.db.name, env.db.user, env.db.password, {
  host: env.db.host,
  port: env.db.port,
  dialect: 'mysql',
  logging: (msg) => logger.debug(msg),
});

export async function testConnection() {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established');
  } catch (err) {
    logger.error({ err }, 'Database connection failed');
    throw err;
  }
}
