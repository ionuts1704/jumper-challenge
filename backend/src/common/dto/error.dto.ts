import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ErrorDto {
  @ApiProperty()
  @IsNotEmpty()
  statusCode: number;

  @ApiProperty()
  @IsNotEmpty()
  message: string[];

  @ApiProperty()
  @IsNotEmpty()
  error: string;
}
