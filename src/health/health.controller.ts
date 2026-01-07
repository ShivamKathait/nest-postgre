import { Controller, Get, Inject } from '@nestjs/common';
import { 
  HealthCheck, 
  HealthCheckService, 
  HealthIndicatorResult,
  HealthIndicator
} from '@nestjs/terminus';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller('health')
export class HealthController extends HealthIndicator {
  constructor(
    private health: HealthCheckService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {
    super();
  }

  @Get()
  @HealthCheck()
  async check() {
    return this.health.check([
      () => this.checkRedis('redis'),
    ]);
  }

  private async checkRedis(key: string): Promise<HealthIndicatorResult> {
    try {
      // Test Redis connection by setting and getting a value
      const testKey = 'health-check';
      const testValue = 'ok';
      await this.cacheManager.set(testKey, testValue, 5); // 5ms TTL
      const value = await this.cacheManager.get(testKey);
      
      return this.getStatus(key, value === testValue);
    } catch (error) {
      return this.getStatus(key, false, { error: error.message });
    }
  }
}