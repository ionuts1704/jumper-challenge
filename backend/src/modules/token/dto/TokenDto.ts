import { ApiProperty } from '@nestjs/swagger';

export class TokenDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  symbol: string;

  @ApiProperty()
  balance: number;

  @ApiProperty()
  contractAddress: string;

  @ApiProperty()
  chainId: number;

  @ApiProperty()
  chainName: string;
}
