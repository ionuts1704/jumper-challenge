import { Injectable } from '@nestjs/common';
import { NetworkService } from '../../shared/service/network.service';

@Injectable()
export class GetWalletTokensUseCase {
  constructor(private readonly networkService: NetworkService) {}

  execute(walletAddress: string) {
    return this.networkService.getAllTokens(walletAddress);
  }
}
