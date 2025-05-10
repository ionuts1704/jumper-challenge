import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { SessionSerializer } from './serializer/session.serializer';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { LocalStrategy } from './strategy/local.strategy';
import { WalletModule } from '../wallet/wallet.module';
import { WalletConnectUseCase } from './use-case/wallet-connect.use-case';
import { WalletLoginUseCase } from './use-case/wallet-login.use-case';
import { WalletLogoutUseCase } from './use-case/wallet-logout.use-case';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'local', session: true }),
    WalletModule,
  ],
  controllers: [AuthController],
  providers: [
    LocalStrategy,
    LocalAuthGuard,
    SessionSerializer,
    WalletConnectUseCase,
    WalletLoginUseCase,
    WalletLogoutUseCase,
  ],
})
export class AuthModule {}
