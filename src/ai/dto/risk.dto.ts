import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RiskDto {
  @ApiProperty({ example: 'Low' })
  @IsString()
  @IsNotEmpty({ message: 'Risk level is required.' })
  risk!: string;
}