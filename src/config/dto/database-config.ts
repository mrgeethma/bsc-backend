import { IsString, IsInt, Min, IsBoolean } from 'class-validator';

export class DatabaseConfig {
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
