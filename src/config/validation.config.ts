import * as Joi from 'joi'; // Importing Joi for schema validation. joi is a powerful schema description language and data validating schema language for JavaScript.

// Defining the validation schema for environment variables

export const validationSchema = Joi.object({
  //joi.object creates a new schema object
  NODE_ENV: Joi.string() // defining NODE_ENV as a string and it must be one of then below specified valid values
    .valid('development', 'production', 'testing', 'staging')
    .default('development'),

  PORT: Joi.number().default(3001),

  // Database - matching the TypeOrmConfigService expectations
  DATABASE_HOST: Joi.string().default('localhost'), //127.0.0.1 can also be used as default but localhost is more common
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_USERNAME: Joi.string().default('postgres'),
  DATABASE_PASSWORD: Joi.string().default('password'),
  DATABASE_NAME: Joi.string().default('bsc_organics'),
  DATABASE_SYNCHRONIZE: Joi.alternatives()
    .try(
      //synchronize can be boolean or string 'true'/'false'. if DATABASE_SYNCHRONIZE not defined, it defaults to true in development environment
      Joi.boolean(),
      Joi.string().valid('true', 'false'),
    )
    .default(true), // In development, we often want TypeORM to automatically synchronize the database schema with our entities. In production, it's safer to manage migrations manually.

  // JWT
  JWT_SECRET: Joi.string().required(), //if JWT_SECRET is missing, app will not start because it is REQUIRED for signing and verifying JWT tokens.
  JWT_EXPIRES_IN: Joi.string().default('1d'),
});
