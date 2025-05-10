import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class WalletLogoutUseCase {
  constructor() {}

  execute(req: Request, res: Response): void {
    req.session.destroy((err) => {
      if (err) {
        throw new InternalServerErrorException('Failed to logout');
      }

      res.clearCookie('jumper.session.id');

      return res.status(200).json();
    });
  }
}
