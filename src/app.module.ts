import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './admin/admin.module';
import { Admin } from './admin/entities/admin.entity';
import { Session } from './admin/entities/session.entity';
import { TempStrategy } from './auth/strategies/temp-jwt.strategy';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { Product } from './product/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'Asdfghjkl@1',
      username: 'shivam',
      entities: [Admin, Session, Product],
      database: 'testTask',
      synchronize: false,
      logging: true,
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