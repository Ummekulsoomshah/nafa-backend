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
        const riskCategory = await this.riskClassifierService.classifyRisk(answerEntities);
        await manager.update(User, id, { riskCategory });
        console.log(`User ID ${id} classified as risk category: ${riskCategory}`);
        return { message: 'Answers submitted successfully', riskCategory,id };
    });
}
}