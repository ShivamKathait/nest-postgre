import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './admin/admin.module';
import { Admin } from './admin/entities/admin.entity';
import { Session } from './admin/entities/session.entity';
import { TempStrategy } from './auth/strategies/temp-jwt.strategy';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { Product } from './product/entities/product.entity';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: 'redis',
        host: configService.get<string>('REDIS_HOST', 'localhost'),
        port: configService.get<number>('REDIS_PORT', 6379),
        ttl: configService.get<number>('CACHE_TTL', 300), // 5 minutes default
      }),
      inject: [ConfigService],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: +configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [Admin, Session, Product],
        synchronize: false,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Admin, Session, Product]),
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService, TempStrategy, JwtStrategy],
})
export class AppModule { }