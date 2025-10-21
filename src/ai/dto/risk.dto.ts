import { ApiProperty } from '@nestjs/swagger';

export class RiskDto {
  @ApiProperty({ example: 'Low', description: 'Risk level: Low, Moderate, or High' })
  risk: string;
}
