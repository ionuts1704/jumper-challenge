import { ApiProperty } from '@nestjs/swagger';
import { IsEthereumAddress, IsNotEmpty } from 'class-validator';

export class ConnectWalletRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEthereumAddress()
  readonly walletAddress: string;
}
