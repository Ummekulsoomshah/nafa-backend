import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('stocks')
export class Stock {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', nullable: true })
    symbol: string;

    @Column({ type: 'varchar', nullable: true })
    name: string;

    @Column({ type: 'int', nullable: true })
    open: number;

    @Column({ type: 'int', nullable: true })
    high: number;

    @Column({ type: 'int', nullable: true })
    low: number;

    @Column({ type: 'int', nullable: true })
    current_price: number;

    @Column({ type: 'int', nullable: true })
    change: number;

    @Column({ type: 'int', nullable: true })
    volume: number;

    @Column({ type: 'int', nullable: true })
    beta: number;

    @Column({ type: 'varchar', nullable: true })
    risk_level: string;

    @Column({ type: 'varchar', nullable: true })
    sector: string;

    @Column({ type: 'varchar', nullable: true })
    shariah_status: string;

    @Column({ type: 'varchar', nullable: true })
    timestamp: string;
}