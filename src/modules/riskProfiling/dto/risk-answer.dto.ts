// src/risk/dto/submit-risk.dto.ts
import { IsArray, ValidateNested, IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';

class SingleAnswerDto {
  @IsInt()
  questionId: number;

  @IsString()
  questionText: string;

  @IsString()
  selectedOption: string; // can be "A", "B", "C", or full text if you prefer
}

export class SubmitQuizDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SingleAnswerDto)
  answers: SingleAnswerDto[];
}
