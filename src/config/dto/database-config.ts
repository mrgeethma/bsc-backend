// this is a custom Data Transfer Object (DTO) that defines the structure and validation rules for database configuration settings in a NestJS application not essentially a schema for database config. but it ensures that the configuration values used to connect to the database meet certain criteria before being applied.
import { IsString, IsInt, Min, IsBoolean } from 'class-validator'; // Importing decorators from class-validator to define validation rules for the properties of the DatabaseConfig class.

export class DatabaseConfig { // This class defines the structure and validation rules for database configuration settings.
  @IsString()
  DATABASE_HOST: string;

  @IsInt()
  @Min(1)
  DATABASE_PORT: number;

  @IsString()
  DATABASE_USERNAME: string;

  @IsString()
  DATABASE_PASSWORD: string;

  @IsString()
  DATABASE_NAME: string;

  @IsBoolean()
  DATABASE_SYNCHRONIZE: boolean;
}
