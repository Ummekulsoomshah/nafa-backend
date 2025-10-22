import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    Index,
} from 'typeorm';
import { User } from '../../users/entites/user.entity'

@Entity('risk_answers')
@Index(['user', 'questionId'])
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

    @Index()
    @CreateDateColumn()
    createdAt: Date;
}
