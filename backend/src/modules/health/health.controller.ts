import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import {ApiOperation, ApiTags} from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private healthCheckService: HealthCheckService,
    private memoryHealthIndicator: MemoryHealthIndicator,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Basic health check endpoint.',
  })
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([
      () =>
        this.memoryHealthIndicator.checkRSS(
          'mem_rss',
          1024 * 2 ** 20 /* 1024 MB */,
        ),
    ]);
  }
}
