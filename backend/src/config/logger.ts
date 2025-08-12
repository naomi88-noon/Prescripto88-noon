import pino from 'pino';

function buildLogger() {
  const base: pino.LoggerOptions = {
    level: process.env.LOG_LEVEL || 'info',
  };
  if (process.env.NODE_ENV === 'development') {
    try {
      base.transport = { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:standard' } } as any;
    } catch (e) {
      // Fallback silently to no transport
    }
  }
  return pino(base);
}

export const logger = buildLogger();
