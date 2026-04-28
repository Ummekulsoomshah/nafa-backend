import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RiskAnswer } from "./entities/risk-answer.entity";
import { SubmitQuizDto } from "./dto/risk-answer.dto";
import { User } from "src/modules/users/entites/user.entity";
import { RiskClassifierService } from "src/utils/risk-classifier.service";

@Injectable()
export class QuizService {
    constructor(
        @InjectRepository(RiskAnswer) private quizRepository: Repository<RiskAnswer>,
        @InjectRepository(User) private userRepository: Repository<User>,
        private readonly riskClassifierService: RiskClassifierService
    ) { }
    private calculateRiskScore(answers: RiskAnswer[]): number {
  let score = 0;

  for (const ans of answers) {
    switch (ans.questionId) {

      case 10: // experience
        if (ans.quizAnswer === "0 years") score += 5;
        else if (ans.quizAnswer === "Less than 1 year") score += 4;
        else if (ans.quizAnswer === "1–3 years") score += 3;
        else if (ans.quizAnswer === "4–7 years") score += 2;
        else score += 1;
        break;

      case 11: // monitoring frequency
        if (ans.quizAnswer === "Multiple times a day") score += 5;
        else if (ans.quizAnswer === "Daily") score += 4;
        else if (ans.quizAnswer === "Weekly") score += 3;
        else if (ans.quizAnswer === "Monthly") score += 2;
        else score += 1;
        break;

      case 12: // decision making style
        if (ans.quizAnswer === "Following tips or influencers") score += 5;
        else if (ans.quizAnswer === "Impulsive decisions") score += 4;
        else if (ans.quizAnswer === "Basic research") score += 3;
        else if (ans.quizAnswer === "Detailed analysis") score += 2;
        else score += 1;
        break;

      case 13: // emotional behavior
        if (ans.quizAnswer === "Very anxious") score += 5;
        else if (ans.quizAnswer === "Somewhat anxious") score += 4;
        else if (ans.quizAnswer === "Neutral") score += 3;
        else if (ans.quizAnswer === "Calm") score += 2;
        else score += 1;
        break;

      case 14: // reaction to loss
        if (ans.quizAnswer === "Sell immediately") score += 5;
        else if (ans.quizAnswer === "Sell part of it") score += 4;
        else if (ans.quizAnswer === "Hold and wait") score += 3;
        else if (ans.quizAnswer === "Buy more") score += 2;
        else score += 1;
        break;
    }
  }

  return score;
}
private getRiskCategory(score: number): string {
  if (score <= 12) return "Low";
  if (score <= 18) return "Moderate";
  return "High";
}

   async submitAnswers(answers: SubmitQuizDto, id: number) {
    console.log('Received answers:', answers);
    if (!answers || !Array.isArray(answers)) {
      throw new BadRequestException('Invalid payload: answers.answers must be an array');
    }
    return await this.quizRepository.manager.transaction(async (manager) => {
        const answerEntities = answers.map(answer => {
            const quizData = new RiskAnswer();
            quizData.user = { id: id } as User;
            quizData.questionId = answer.questionId;
            quizData.questionText = answer.questionText;
            quizData.quizAnswer = answer.quizAnswer;
            return quizData;
        });
        
        await manager.save(RiskAnswer, answerEntities);
        // const riskCategory = await this.riskClassifierService.classifyRisk(answerEntities);
        // await manager.update(User, id, { riskCategory });
        // console.log(`User ID ${id} classified as risk category: ${riskCategory}`);
        // return { message: 'Answers submitted successfully', riskCategory,id };
        const score = this.calculateRiskScore(answerEntities);
const riskCategory = this.getRiskCategory(score);

await manager.update(User, id, { riskCategory });

console.log(`User ID ${id} score: ${score}, category: ${riskCategory}`);

return { message: 'Answers submitted successfully', riskCategory, score, id };
    });
}
}