import { Module } from '@nestjs/common';

import { WalletRepository } from './repository/wallet.repository';
import { GetWalletByIdUseCase } from './use-case/get-wallet-by-id.use-case';
import { SaveWalletUseCase } from './use-case/save-wallet.use-case';
import { InMemoryWalletRepository } from './repository/in-memory-wallet.repository';

@Module({
  providers: [
    {
      provide: WalletRepository,
      useClass: InMemoryWalletRepository,
    },
    GetWalletByIdUseCase,
    SaveWalletUseCase,
  ],
  exports: [WalletRepository, GetWalletByIdUseCase, SaveWalletUseCase],
})
export class WalletModule {}
