import * as process from 'process';
import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export default registerAs('auth', () => {
  const values = {
    session: {
      name: process.env.AUTH_SESSION_NAME,
      secret: process.env.AUTH_SESSION_SECRET || 'secret',
      resave: process.env.AUTH_SESSION_RESAVE || false,
      saveUninitialized: process.env.AUTH_SESSION_SAVE_UNINITIALIZED || false,
    },
  };

  const schema = Joi.object({
    session: {
      name: Joi.string().required(),
      secret: Joi.string().required(),
      resave: Joi.boolean().required(),
      saveUninitialized: Joi.boolean().required(),
    },
  });

  const { error } = schema.validate(values, { abortEarly: false });

  if (error) {
    throw new Error(`Validation failed: ${error.message}`);
  }

  return values;
});
