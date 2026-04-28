import { Body, Controller, Param, Post, UseGuards, Request } from "@nestjs/common";

import { SubmitQuizDto } from "./dto/risk-answer.dto";
import { ApiBearerAuth, ApiProxyAuthenticationRequiredResponse, ApiTags } from "@nestjs/swagger";
import { QuizService } from "./quiz.service";
import { AuthGuard } from "../auth/auth.guard";

@Controller('quiz')
export class QuizController {
    constructor(private quizService: QuizService) { }
    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiTags('Quiz Api')
    @Post('submit-answers/:id')
    async submitAnswers(@Body() answers: SubmitQuizDto, @Request() req: any) {
        console.log('Received answers:', answers);
        const id = req.user.id;
        return await this.quizService.submitAnswers(answers, id);
    }
}
