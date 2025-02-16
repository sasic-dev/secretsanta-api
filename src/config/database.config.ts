
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';

dotenv.config();

const typeormConfig: DataSourceOptions   = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [path.join(__dirname, '../**/*.entity.{ts,js}')],
    migrations: [path.join(__dirname, '../migrations/*.{ts,js}')],
    synchronize: false,
    logging: true
}

export const databaseConfig: TypeOrmModuleOptions = typeormConfig;

export default new DataSource({
    ...typeormConfig
});