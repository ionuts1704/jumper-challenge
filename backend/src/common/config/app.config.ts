import * as process from 'process';
import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import * as packageJson from '../../../package.json';

export default registerAs('app', () => {
  const values = {
    nodeEnv: process.env.APP_ENV,
    name: process.env.APP_NAME,
    version: packageJson.version,
    port: process.env.APP_PORT || 3000,
    logLevel: process.env.API_LOG_LEVEL || 'info',
    cors: {
      enabled: process.env.CORS_ENABLED === 'true' || false,
      whitelist: process.env.CORS_WHITELIST || '*',
    },
  };

  const schema = Joi.object({
    nodeEnv: Joi.string().required(),
    name: Joi.string().required(),
    version: Joi.string().required(),
    port: Joi.number().required(),
    logLevel: Joi.string().required().valid('debug', 'info', 'warn', 'error'),
    cors: {
      enabled: Joi.boolean().required(),
      whitelist: Joi.string().required(),
    },
  });

  const { error } = schema.validate(values, { abortEarly: false });

  if (error) {
    throw new Error(`Validation failed: ${error.message}`);
  }

  return values;
});
