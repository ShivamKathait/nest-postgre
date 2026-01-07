import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Admin } from './admin/entities/admin.entity';
import { Session } from './admin/entities/session.entity';
import { Product } from './product/entities/product.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'strongpassword123',
  database: process.env.DB_NAME || 'learningPostgres',
  entities: [Admin, Session, Product],
  synchronize: false,
  logging: true,
  migrations: ['src/db/migrations/*.ts'],
});