import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { JwtModule } from '@nestjs/jwt';
import { Session } from './entities/session.entity';

@Module({
  imports: [HttpModule, JwtModule,TypeOrmModule.forFeature([Admin, Session])],
  controllers: [AdminController],
  providers: [AdminService, ConfigService],
})
export class UsersModule {} 
