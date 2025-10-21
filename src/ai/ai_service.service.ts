import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AiService {
  constructor(private readonly httpService: HttpService) {}

  async getRecommendationsByRisk(risk: string) {
    const apiUrl = 'http://localhost:8001/recommend-by-risk'; // Python FastAPI URL

    try {
      const body = { risk };
      const response = await firstValueFrom(this.httpService.post(apiUrl, body));
      return response.data;
    } catch (error) {
      console.error('AI Service error:', error.message);
      throw new Error('Failed to get recommendations from AI service');
    }
  }
}
