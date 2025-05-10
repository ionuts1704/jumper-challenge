import { Injectable } from '@nestjs/common';

import { GetWalletByIdUseCase } from '../../wallet/use-case/get-wallet-by-id.use-case';
import { SaveWalletUseCase } from '../../wallet/use-case/save-wallet.use-case';
import { ConnectWalletResponseDto } from '../dto/connect-wallet.response.dto';

@Injectable()
export class WalletConnectUseCase {
  constructor(
    private readonly getWalletByIdUseCase: GetWalletByIdUseCase,
    private readonly saveWalletUseCase: SaveWalletUseCase,
  ) {}

  execute(id: string): ConnectWalletResponseDto {
    let wallet = this.getWalletByIdUseCase.execute(id);

    if (!wallet) {
      wallet = this.saveWalletUseCase.execute(id);
    }

    return { nonce: wallet.nonce };
  }
}
