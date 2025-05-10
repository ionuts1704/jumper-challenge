import { Strategy } from 'passport-local';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { WalletLoginUseCase } from '../use-case/wallet-login.use-case';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly walletLoginUseCase: WalletLoginUseCase) {
    super({
      usernameField: 'message',
      passwordField: 'signature',
      passReqToCallback: false,
    });
  }

  async validate(message: string, signature: string, done: CallableFunction) {
    const result = await this.walletLoginUseCase.execute({
      message,
      signature,
    });

    if (!result.success) {
      done(result.error);
    }

    done(null, { walletAddress: result.data.address });
  }
}
