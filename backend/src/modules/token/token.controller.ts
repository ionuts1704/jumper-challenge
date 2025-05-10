import {
  Controller,
  Get,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request as RequestExpress } from 'express';

import { ErrorDto } from '../../common/dto/error.dto';
import { GetWalletTokensUseCase } from './use-case/get-wallet-tokens.use-case';
import { SessionAuthGuard } from '../auth/guard/session-auth.guard';
import { TokenDto } from './dto/TokenDto';

@ApiTags('Tokens')
@Controller({
  path: 'tokens',
  version: '1',
})
@ApiResponse({ status: 400, description: 'BadRequest', type: ErrorDto })
@ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorDto })
@ApiResponse({ status: 404, description: 'NotFound', type: ErrorDto })
@ApiResponse({
  status: 500,
  description: 'InternalServerError',
  type: ErrorDto,
})
export class TokenController {
  constructor(
    private readonly getWalletTokensUseCase: GetWalletTokensUseCase,
  ) {}

  @Get('/me')
  @ApiOperation({
    summary:
      'Retrieve all ERC-20 tokens associated to the logged in wallet from a list of networks supported.',
  })
  @ApiResponse({
    status: 200,
    description: 'Ok',
    type: TokenDto,
    isArray: true,
  })
  @ApiCookieAuth()
  @UseGuards(SessionAuthGuard)
  getWalletTokens(@Request() req: RequestExpress): Promise<TokenDto[]> {
    if (!req.user || !(req.user as any).walletAddress) {
      throw new UnauthorizedException('Wallet address not found in session');
    }

    return this.getWalletTokensUseCase.execute((req.user as any).walletAddress);
  }
}
