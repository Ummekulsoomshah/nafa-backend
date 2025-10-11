import { Injectable } from "@nestjs/common";
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
        private readonly riskClassifierService: RiskClassifierService
    ){}

    async submitAnswers(answers:SubmitQuizDto,id:number){
        const answerEntities = answers.answers.map(answer => {
            const quizData = new RiskAnswer();
            quizData.user = { id: id } as User;
            quizData.questionId = answer.questionId;
            quizData.questionText = answer.questionText;
            quizData.selectedOption = answer.selectedOption;
            return quizData;
        });
        console.log(answerEntities);
        await this.quizRepository.save(answerEntities);

        const riskCategory=await this.riskClassifierService.classifyRisk(answerEntities)

        return { message: 'Answers submitted successfully', riskCategory  };
        
    }
}