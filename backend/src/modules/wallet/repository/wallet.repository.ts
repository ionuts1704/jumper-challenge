export interface Wallet {
  id: string;
  nonce: string;
}

export abstract class WalletRepository {
  abstract getById(id: string): Wallet | undefined;
  abstract save(id: string): Wallet;
  abstract updateNonceById(id: string): Wallet | undefined;
}