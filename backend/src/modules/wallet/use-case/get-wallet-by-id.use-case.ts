import { Injectable } from '@nestjs/common';
import { Wallet, WalletRepository } from '../repository/wallet.repository';

@Injectable()
export class GetWalletByIdUseCase {
  constructor(private readonly walletRepository: WalletRepository) {}

  execute(id: string): Wallet | undefined {
    return this.walletRepository.getById(id);
  }
}
