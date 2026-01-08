//what is the purpose of this file? This file defines and exports the application configuration settings using NestJS's configuration module. It uses the registerAs function to create a named configuration namespace ('app') that encapsulates various application settings such as the server port, environment, API prefix, maximum file size for uploads, and upload destination. These settings can be easily accessed throughout the application via the ConfigService, promoting modularity and maintainability in managing configuration values.
import { registerAs } from '@nestjs/config'; // Importing the registerAs function from NestJS config module. this function allows us to create named configuration namespaces, which helps organize and modularize configuration settings in a NestJS application.

export default registerAs('app', () => ({ 
  port: parseInt(process.env.PORT || '3001', 10), //here process.env is used to access environment variables. // Converting the PORT environment variable to a number. how the conversion is handled is, it first checks if process.env.PORT is defined. If it is, it uses that value; if not, it defaults to the string '3001'. The parseInt function then converts this string to a base-10 integer which results in the number 3001.
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || 'api/v1',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB default which is 10 * 1024 * 1024 bytes
  uploadDest: process.env.UPLOAD_DEST || './uploads', // Directory where uploaded files will be stored in the server.
}));
