import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';

import { appConfig, rpcConfig, authConfig } from './common/config';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';
import { SharedModule } from './modules/shared/shared.module';
import { HttpExceptionFilter } from './common/exception-filter/http.exception-filter';
import { AuthModule } from './modules/auth/auth.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { TokenModule } from './modules/token/token.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, rpcConfig],
      envFilePath: ['.env'],
    }),
    HealthModule,
    SharedModule,
    AuthModule,
    WalletModule,
    TokenModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
