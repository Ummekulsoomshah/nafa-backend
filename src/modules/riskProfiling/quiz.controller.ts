import { Body, Controller, Param, Post } from "@nestjs/common";

import { SubmitQuizDto } from "./dto/risk-answer.dto";
import { ApiTags } from "@nestjs/swagger";
import { QuizService } from "./quiz.service";

@Controller('quiz')
export class QuizController {
    constructor(private quizService: QuizService) { }
    @ApiTags('Quiz Api')
    @Post('submit-answers/:id')
    async submitAnswers(@Body() answers: SubmitQuizDto, @Param('id') id: number) {
        return await this.quizService.submitAnswers(answers, id);
    }
}
