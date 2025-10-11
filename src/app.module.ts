import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/users/entites/user.entity';
import { RiskAnswer } from './modules/riskProfiling/entities/risk-answer.entity';
import { QuizModule } from './modules/riskProfiling/quiz.module';

@Module({
  imports: [UserModule,QuizModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: 'postgres',
      database: 'nafaDb',
      entities: [User,RiskAnswer],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
