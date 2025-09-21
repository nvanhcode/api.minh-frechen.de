import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();

export function setupConfigTypeOrm(moduleName: string): DataSourceOptions {
  return {
    type: 'mysql',
    host: process.env[`${moduleName}_DB_HOST`] || 'localhost',
    port: parseInt(process.env[`${moduleName}_DB_PORT`] || '3306'),
    username: process.env[`${moduleName}_DB_USER`] || 'root',
    password: process.env[`${moduleName}_DB_PASSWORD`] || '',
    database: process.env[`${moduleName}_DB_NAME`] || 'iam_db',
    entities: [`dist/domain/${moduleName.toLowerCase()}/models/**/*.js`],
    migrations: [
      `dist/domain/${moduleName.toLowerCase()}/database/migrations/**/*.js`,
    ],
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
    charset: 'utf8mb4',
    timezone: '+07:00',
  };
}

export function initConfigTypeOrm(moduleName: string): DataSource {
  return new DataSource(setupConfigTypeOrm(moduleName));
}
