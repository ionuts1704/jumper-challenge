import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request as RequestExpress, Response } from 'express';

import { ErrorDto } from '../../common/dto/error.dto';
import { SessionAuthGuard } from './guard/session-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { WalletConnectUseCase } from './use-case/wallet-connect.use-case';
import { ConnectWalletRequestDto } from './dto/connect-wallet.request.dto';
import { ConnectWalletResponseDto } from './dto/connect-wallet.response.dto';
import { WalletLogoutUseCase } from './use-case/wallet-logout.use-case';
import { LoginWalletRequestDto } from './dto/login-wallet.request.dto';

@ApiTags('Auth')
@Controller({
  path: 'auth',
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
export class AuthController {
  constructor(
    private readonly authWalletConnectUseCase: WalletConnectUseCase,
    private readonly walletLogoutUseCase: WalletLogoutUseCase,
  ) {}

  @Post('/wallet/connect')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Connect Wallet. Register wallet in the back-end and generate a nonce.',
  })
  @ApiOkResponse({
    description: 'Nonce generated',
    type: ConnectWalletResponseDto,
  })
  walletConnect(
    @Body() body: ConnectWalletRequestDto,
  ): ConnectWalletResponseDto {
    return this.authWalletConnectUseCase.execute(body.walletAddress);
  }

  @Post('/wallet/login')
  @ApiOperation({
    summary:
      'Login wallet by creating a session that will be used to authorize requests.',
  })
  @UseGuards(LocalAuthGuard)
  walletLogin(@Body() body: LoginWalletRequestDto): void {}

  @Post('/wallet/logout')
  @ApiOperation({
    summary: 'Login wallet by destroying the session.',
  })
  @ApiCookieAuth()
  @UseGuards(SessionAuthGuard)
  logout(@Req() req: RequestExpress, @Res() res: Response): void {
    return this.walletLogoutUseCase.execute(req, res);
  }
}
