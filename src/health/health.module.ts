import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    TerminusModule,
    CacheModule.register(),
  ],
  controllers: [HealthController],
})
export class HealthModule {}
