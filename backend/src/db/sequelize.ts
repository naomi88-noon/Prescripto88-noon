import { Sequelize } from 'sequelize';
import { env } from '../config/env';
import { logger } from '../config/logger';

export const sequelize = new Sequelize(env.db, {
  dialect: 'postgres',
  logging: (msg: unknown) => logger.debug(msg),
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
