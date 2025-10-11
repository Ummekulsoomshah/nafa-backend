import { TypeOrmModule } from "@nestjs/typeorm";
import { RiskAnswer } from "./entities/risk-answer.entity";
import { User } from "../users/entites/user.entity";
import { QuizController } from "./quiz.controller";
import { QuizService } from "./quiz.service";
import { Module } from "@nestjs/common";
import { RiskClassifierService } from "src/utils/risk-classifier.service";

@Module({
    imports: [TypeOrmModule.forFeature([RiskAnswer, User]),],
    controllers: [QuizController],
    providers: [QuizService,RiskClassifierService],

})
export class QuizModule { }