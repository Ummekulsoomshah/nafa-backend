// src/risk/entities/risk-answer.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entites/user.entity'

@Entity('risk_answers')
export class RiskAnswer {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'int' })
    questionId: number;

    @Column({ type: 'text' })
    questionText: string;

    @Column({ type: 'text' })
    quizAnswer: string;

    @CreateDateColumn()
    createdAt: Date;
}
