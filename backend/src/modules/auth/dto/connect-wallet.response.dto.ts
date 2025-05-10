import { ApiProperty } from '@nestjs/swagger';

export class ConnectWalletResponseDto {
  @ApiProperty()
  readonly nonce: string;
}
