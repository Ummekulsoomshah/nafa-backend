
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('prediction_history')
export class PredictionHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  symbol: string;

  @Column('text')
  prediction: string;

  @Column()
  recommendation: string;

  @Column('float')
  confidence: number;

  @Column('simple-array')
  reasoning: string[];

  @Column('simple-array')
  risks: string[];

  @Column('jsonb', { nullable: true })
  sources: any[];

  @CreateDateColumn()
  createdAt: Date;
}
