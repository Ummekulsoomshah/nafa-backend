import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai_service.service';
import { RiskDto } from './dto/risk.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('recommend-by-risk')
  async getRecommendations(@Body() aidto:RiskDto) {
    console.log('Received risk level:', aidto.risk);
    return await this.aiService.getRecommendationsByRisk(aidto.risk);
  }
}
