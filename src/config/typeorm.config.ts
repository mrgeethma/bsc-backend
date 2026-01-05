import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { validateSync } from 'class-validator';
import { DatabaseConfig } from './dto/database-config';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    private readonly logger = new Logger(TypeOrmConfigService.name);
    private readonly config: DatabaseConfig;

    constructor(private readonly configService: ConfigService) {
        this.config = this.validateConfig();
        this.logResolvedConfig();
    }

    private validateConfig(): DatabaseConfig {
        const config = new DatabaseConfig();

        config.DATABASE_HOST = this.configService.get<string>('DATABASE_HOST') ?? 'localhost';
        config.DATABASE_PORT = Number(this.configService.get<string>('DATABASE_PORT')) || 5432;
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

    private logResolvedConfig() {
        this.logger.log(
            `DB config -> host=${this.config.DATABASE_HOST} port=${this.config.DATABASE_PORT} ` +
            `db=${this.config.DATABASE_NAME} user=${this.config.DATABASE_USERNAME} ` +
            `synchronize=${this.config.DATABASE_SYNCHRONIZE}`,
        );
    }

    getTypeOrmConfig(): TypeOrmModuleOptions {
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
