import { Module } from "@nestjs/common";
import { PredictorController } from "./prediction.controller";
import { PredictorService } from "./prediction.service";
import { PredictionHistory } from "./entities/prediction.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
     imports: [TypeOrmModule.forFeature([PredictionHistory]),],
  controllers: [PredictorController],
    providers: [PredictorService],
})
export class PredictionModule {}