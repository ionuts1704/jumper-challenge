import { Injectable } from '@nestjs/common';
import { generateNonce } from 'siwe';
import { WalletRepository } from './wallet.repository';

export interface Wallet {
  id: string;
  nonce: string;
}

@Injectable()
export class InMemoryWalletRepository implements WalletRepository {
  private readonly wallets: Map<string, Wallet> = new Map<string, Wallet>();

  getById(id: string): Wallet | undefined {
    return this.wallets.get(id);
  }

  save(id: string): Wallet {
    const wallet = {
      id: id,
      nonce: generateNonce(),
    };

    this.wallets.set(wallet.id, wallet);

    return wallet;
  }

  updateNonceById(id: string): Wallet | undefined {
    const wallet = this.wallets.get(id);

    if (!wallet) {
      return undefined;
    }

    wallet.nonce = generateNonce();

    this.wallets.set(id, wallet);

    return this.wallets.get(id);
  }
}
