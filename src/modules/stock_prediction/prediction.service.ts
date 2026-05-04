
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoogleGenAI, Type } from '@google/genai';
import { PredictionHistory } from './entities/prediction.entity';

@Injectable()
export class PredictorService {
  private readonly apiKeys: string[] = [
    process.env.API1 || '', // Fallback to GEMINI_API_KEY if API1 is not set
    process.env.API2 || '',
    process.env.API3 || '',
    process.env.API4 || '',
    process.env.API5 || '',
    process.env.API6 || '',
    process.env.API7 || '',
    process.env.API8 || '',
    process.env.API9 || '',
  ];
  constructor(
    // @InjectRepository(PredictionHistory)
    // private predictionRepository: Repository<PredictionHistory>,
  ) { }
  private currentKeyIndex = 0;
  private getNextApiKey(): string {
    const key = this.apiKeys[this.currentKeyIndex];
    console.log(`Using API key index: ${this.currentKeyIndex}`);

    // Prepare the index for the NEXT call
    this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeys.length;
    return key;
  }
  async getPrediction(symbol: string,retryCount = 0) {

    const ai = new GoogleGenAI({ apiKey: this.getNextApiKey() });
    const modelName = 'gemini-2.5-flash';
    const MAX_RETRIES = 3;

    const prompt = `
   Perform a professional financial analysis for:
  Symbol: "${symbol}" 
  Exchange: "Pakistan Stock Exchange (PSX)"
  Focus on predicting the market condition for tomorrow.

  Make TWO separate recommendations:
  1) for a user who DOES NOT currently own the stock (entry decision)
  2) for a user who ALREADY OWNS the stock (position management decision)

  Use expert logic behind BUY/HOLD/SELL decisions based on:
  - current technical indicators and trend
  - support and resistance levels
  - volume and momentum
  - macro-economic sentiment in Pakistan
  - IMF news, SBP interest rates, and sector-specific updates

  IMPORTANT OUTPUT RULES:
  - Return ONLY valid JSON
  - Do NOT return explanations outside JSON
  - Do NOT wrap JSON in markdown or code fences
  - No prose paragraphs

  Provide this exact JSON structure:

  {
    "symbol": "<symbol>",
    "prediction": "<brief price/momentum outlook for tomorrow>",

    "action_for_non_holder": "BUY" | "DO_NOT_BUY",
    "action_for_existing_holder": "HOLD" | "SELL",

    "recommendation": "Strong Buy" | "Buy" | "Hold" | "Sell" | "Strong Sell",

    "confidence": 0-100,

    "reasoning": [
      "short reason 1",
      "short reason 2",
      "short reason 3"
    ],

    "risks": [
      "short risk 1",
      "short risk 2"
    ]
  }

  Decision guidance:
  - If trend positive but overbought → DO_NOT_BUY for new investors, HOLD for existing
  - If strong upside expected → BUY for non-holders, HOLD or BUY for holders
  - If negative outlook → DO_NOT_BUY for non-holders, SELL for existing holders

`;


    try
     {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          // When using tools like Google Search, 'application/json' responses are unsupported.
          // Use plain text and parse JSON from `response.text` instead.
          responseMimeType: 'text/plain',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              symbol: { type: Type.STRING },
              prediction: { type: Type.STRING },
              recommendation: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              reasoning: { type: Type.ARRAY, items: { type: Type.STRING } },
              risks: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['symbol', 'prediction', 'recommendation', 'confidence', 'reasoning', 'risks'],
          },
        },
      });

      const text = response.text || '';
      let data;
      try {
        data = this.parseJsonFromText(text);
      } catch (err) {
        console.error('Failed to parse JSON from model response:', { text, error: err });
        throw new InternalServerErrorException('Failed to parse model response as JSON');
      }

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const sources = groundingChunks?.map(chunk => {
        if (chunk.web) {
          return {
            title: chunk.web.title || "Financial Source",
            uri: chunk.web.uri
          };
        }
        return null;
      }).filter((s): s is { title: string; uri: string } => s !== null && !!s.uri) || [];

      // Save the analysis history to PostgreSQL.
      // const history = this.predictionRepository.create({
      //   ...data,
      //   sources,
      // });
      // await this.predictionRepository.save(history);

      return {
        ...data,
        sources,
        // generatedAt: history.createdAt,
      };
    } catch (error) {
      if ((error.status === 503 || error.status === 429) && retryCount < MAX_RETRIES) {
      const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s...
      console.warn(`Retrying in ${delay}ms due to API demand...`);
      await new Promise(res => setTimeout(res, delay));
      return this.getPrediction(symbol, retryCount + 1);
    }
      console.error('Gemini API Error:', error);
      throw new InternalServerErrorException('Failed to generate market prediction');
    }
  }


  private parseJsonFromText(text: string) {
    const trimmed = (text || '').trim();
    if (!trimmed) throw new Error('Empty response text');

    try {
      return JSON.parse(trimmed);
    } catch (_) { }

    const jsonFence = trimmed.match(/```json\s*([\s\S]*?)\s*```/i);
    if (jsonFence) {
      try { return JSON.parse(jsonFence[1].trim()); } catch (_) { }
    }

    const fence = trimmed.match(/```(?:[^\n]*)\n([\s\S]*?)\n```/);
    if (fence) {
      try { return JSON.parse(fence[1].trim()); } catch (_) { }
    }

    const firstBrace = trimmed.indexOf('{');
    const lastBrace = trimmed.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const candidate = trimmed.substring(firstBrace, lastBrace + 1);
      try { return JSON.parse(candidate); } catch (_) { }
    }

    const firstBracket = trimmed.indexOf('[');
    const lastBracket = trimmed.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
      const candidate = trimmed.substring(firstBracket, lastBracket + 1);
      try { return JSON.parse(candidate); } catch (_) { }
    }

    throw new Error('No JSON found in text');
  }

  async getRecentHistory() {
    // return this.predictionRepository.find({
    //   order: { createdAt: 'DESC' },
    //   take: 10,
    // });
    return []; // Placeholder until repository is enabled
  }
}
