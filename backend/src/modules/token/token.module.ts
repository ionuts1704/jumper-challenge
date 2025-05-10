import { Module } from '@nestjs/common';

import { GetWalletTokensUseCase } from './use-case/get-wallet-tokens.use-case';
import { TokenController } from './token.controller';

@Module({
  controllers: [TokenController],
  providers: [GetWalletTokensUseCase],
})
export class TokenModule {}
