import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SiweMessage, SiweResponse } from 'siwe';

import { LoginWalletRequestDto } from '../dto/login-wallet.request.dto';
import { GetWalletByIdUseCase } from '../../wallet/use-case/get-wallet-by-id.use-case';
import { WalletRepository } from '../../wallet/repository/wallet.repository';

@Injectable()
export class WalletLoginUseCase {
  constructor(
    private readonly getWalletByIdUseCase: GetWalletByIdUseCase,
    private readonly walletRepository: WalletRepository,
  ) {}

  async execute(body: LoginWalletRequestDto): Promise<SiweResponse> {
    const siweMessage = new SiweMessage(body.message);
    const result = await siweMessage.verify({ signature: body.signature });

    if (!result.success) {
      throw new ForbiddenException('Invalid signature');
    }

    const wallet = this.getWalletByIdUseCase.execute(result.data.address);

    if (!wallet) {
      throw new NotFoundException(
        'Wallet Not registered or Nonce is no long valid',
      );
    }

    if (wallet.nonce !== result.data.nonce) {
      throw new UnauthorizedException('Nonce is no long valid');
    }

    this.walletRepository.updateNonceById(wallet.id);

    return result;
  }
}
