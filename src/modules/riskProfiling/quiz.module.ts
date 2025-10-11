import { TypeOrmModule } from "@nestjs/typeorm";
import { RiskAnswer } from "./entities/risk-answer.entity";
import { User } from "../users/entites/user.entity";
import { QuizController } from "./quiz.controller";
import { QuizService } from "./quiz.service";
import { Module } from "@nestjs/common";

@Module({
    imports: [TypeOrmModule.forFeature([RiskAnswer, User])],
    controllers: [QuizController],
    providers: [QuizService],

})
export class QuizModule { }