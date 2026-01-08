//what is the purpose of this file? This file provides a dynamic and validated configuration for TypeORM in a NestJS application. It retrieves database connection settings from environment variables using ConfigService, validates them against a defined schema (DatabaseConfig), and constructs a TypeORM configuration object. This ensures that the application has a robust and flexible database connection setup that can adapt to different environments (development, production, etc.) while also logging the resolved configuration for transparency.
import { Injectable, Logger } from '@nestjs/common'; // from nestjs common module. Injectable decorator marks this class as a provider that can be injected as a dependency. Logger is used for logging messages and it is a built-in NestJS utility.
import { ConfigService } from '@nestjs/config'; // ConfigService is used to access environment variables and application configuration settings.
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'; // TypeOrmModuleOptions defines the configuration options for TypeORM. TypeOrmOptionsFactory is an interface that allows creating dynamic TypeORM configurations.
import { validateSync } from 'class-validator'; // validateSync is a function from class-validator library that validates an object against defined validation rules synchronously.
import { DatabaseConfig } from './dto/database-config'; // Importing a custom DTO that defines the structure and validation rules for database configuration.

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory { // This service implements TypeOrmOptionsFactory to provide dynamic TypeORM configuration. here dynamic means it can change based on environment variables or other runtime conditions(like dev, prod, test, stage etc)
    private readonly logger = new Logger(TypeOrmConfigService.name); // Creating a logger instance specific to this service for logging messages. here TypeOrmConfigService.name provides the context for the logger, making it clear which part of the application the log messages are coming from. readonly means the property cannot be reassigned or modified after its initial assignment.
    private readonly config: DatabaseConfig; // here config property will hold the validated database configuration settings which means once assigned, the config property cannot be reassigned to a different value.

    constructor(private readonly configService: ConfigService) { // Injecting ConfigService to access environment variables and application configuration settings. here this. means the current instance of the TypeOrmConfigService class and this.config refers to the config property defined above.
        this.config = this.validateConfig(); // Validating and assigning the database configuration settings during service initialization. 
        this.logResolvedConfig(); // Logging the resolved database configuration for transparency.
    }

    private validateConfig(): DatabaseConfig { // Method to validate and retrieve database configuration settings.
        const config = new DatabaseConfig(); // Creating a new instance of DatabaseConfig to hold the configuration values.

        config.DATABASE_HOST = this.configService.get<string>('DATABASE_HOST') ?? 'localhost'; // what is happening here? it retrieves the DATABASE_HOST value from the configuration service. If the value is undefined or null, it defaults to 'localhost' using the nullish coalescing operator (??).
        config.DATABASE_PORT = Number(this.configService.get<string>('DATABASE_PORT')) || 5432; // Here, it retrieves the DATABASE_PORT value from the configuration service as a string, converts it to a number using Number(). If the conversion results in NaN (which is falsy), it defaults to 5432 using the logical OR operator (||).
        config.DATABASE_USERNAME = this.configService.get<string>('DATABASE_USERNAME') ?? 'postgres';
        config.DATABASE_PASSWORD = this.configService.get<string>('DATABASE_PASSWORD') ?? 'password';
        config.DATABASE_NAME = this.configService.get<string>('DATABASE_NAME') ?? 'bsc_organics';

        const syncRaw = this.configService.get<string | boolean>('DATABASE_SYNCHRONIZE');
        config.DATABASE_SYNCHRONIZE = syncRaw === true || syncRaw === 'true' || this.configService.get('NODE_ENV') === 'development';

        const errors = validateSync(config, { skipMissingProperties: false });
        if (errors.length > 0) {
            this.logger.error('Invalid database configuration:', JSON.stringify(errors, null, 2));
            throw new Error('Database configuration validation failed');
        }
        return config;
    }

    private logResolvedConfig() { // Method to log the resolved database configuration settings. what is happening here? It logs the current database configuration values such as host, port, database name, username, and whether synchronization is enabled. This helps in debugging and verifying that the correct configuration is being used.
        this.logger.log(
            `DB config -> host=${this.config.DATABASE_HOST} port=${this.config.DATABASE_PORT} ` +
            `db=${this.config.DATABASE_NAME} user=${this.config.DATABASE_USERNAME} ` +
            `synchronize=${this.config.DATABASE_SYNCHRONIZE}`,
        );
    }

    getTypeOrmConfig(): TypeOrmModuleOptions { // Method to construct and return the TypeORM configuration object based on the validated settings.
        const useSsl = (process.env.DATABASE_SSL ?? '').toLowerCase() === 'true';

        return {
            type: 'postgres',
            host: this.config.DATABASE_HOST,
            port: this.config.DATABASE_PORT,
            username: this.config.DATABASE_USERNAME,
            password: this.config.DATABASE_PASSWORD,
            database: this.config.DATABASE_NAME,

            entities: [__dirname + '/../**/*.entity.{ts,js}'],
            synchronize: this.config.DATABASE_SYNCHRONIZE,

            logger: 'advanced-console',
            logging: ['error', 'warn'],
            maxQueryExecutionTime: 1000,

            ssl: useSsl ? { rejectUnauthorized: false } : false,

            extra: {
                application_name: 'bsc-organics-api',
                keepAlive: true,
                connectionTimeoutMillis: 30000,
                idleTimeoutMillis: 30000,
                max: 10,
            },
            retryAttempts: 10,
            retryDelay: 2000,
        };
    }

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return this.getTypeOrmConfig();
    }
}
