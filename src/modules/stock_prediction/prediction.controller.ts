
import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { PredictorService } from './prediction.service';
import { ApiTags } from '@nestjs/swagger';
import { SymbolDto } from './dto/symbol.dto';

@Controller('predictor')
export class PredictorController {
  constructor(private readonly predictorService:PredictorService
  ) {}

  @ApiTags('Stock Prediction')
  @Post('analyze')
  async analyze(@Body() symboldto:SymbolDto ) {
    return this.predictorService.getPrediction(symboldto.symbol);
  }

  @ApiTags('Stock Prediction')
  @Get('history')
  async history() {
    return this.predictorService.getRecentHistory();
  }
}
