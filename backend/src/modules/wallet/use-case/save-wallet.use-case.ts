import { Injectable } from '@nestjs/common';
import { Wallet, WalletRepository } from '../repository/wallet.repository';

@Injectable()
export class SaveWalletUseCase {
  constructor(private readonly walletRepository: WalletRepository) {}

  execute(id: string): Wallet {
    return this.walletRepository.save(id);
  }
}
