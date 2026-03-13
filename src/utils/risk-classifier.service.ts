import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class RiskClassifierService {
    private readonly model: any;
    private readonly logger = new Logger(RiskClassifierService.name);

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY environment variable is not set');
        }
        const genAI = new GoogleGenerativeAI(apiKey);
        this.model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    }

    async classifyRisk(userResponses: any[]): Promise<string> {
        const formatted = userResponses
            .map(
                (r, i) =>
                    `${i + 1}. Q: ${r.questionText}\n   A: ${r.quizAnswer}`,
            )
            .join('\n');

        const prompt = `
You are a certified financial advisor.
Classify the investor's financial risk tolerance based on their quiz answers.

Return ONLY one of the following categories: Low, Moderate, or High.

User responses:
${formatted}

Return JSON only:
{"riskCategory": "<Low|Moderate|High>"}
    `;

        try {
            const result = await this.model.generateContent(prompt);
            const text = result.response.text();
            this.logger.log('Gemini raw output: ' + text);

            const match = text.match(/"riskCategory"\s*:\s*"(\w+)"/i);
            if (!match) throw new Error('Invalid response format');

            const category = match[1];
            if (!['Low', 'Moderate', 'High'].includes(category))
                throw new Error('Unexpected category');

            return category;
        } catch (err) {
            this.logger.error('Gemini classification failed', err);
            return 'Moderate'; // fallback
        }
    }
}