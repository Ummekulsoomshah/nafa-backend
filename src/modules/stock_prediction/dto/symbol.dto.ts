import { ApiProperty } from '@nestjs/swagger';

export class SymbolDto {
  @ApiProperty({ example: 'BOP', description: 'Stock symbol to analyze' })
  symbol: string;
}
