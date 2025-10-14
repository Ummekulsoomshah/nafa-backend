// src/db/db.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './db.config';
import { User } from 'src/modules/users/entites/user.entity';
import { RiskAnswer } from 'src/modules/riskProfiling/entities/risk-answer.entity';
import { ConfigModule } from '@nestjs/config';
// ...existing code...


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        ...databaseConfig,
        entities: [User, RiskAnswer],
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DbModule {}
