import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    @Index('IDX_user_email')
    email: string;

    @Column()
    password: string;

    @Column({ default: 'user' })
    role:string;

    @Column({ nullable: true })
riskCategory: string;
}