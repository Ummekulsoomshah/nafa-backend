import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('stocks')
export class Stock {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', nullable: true })
    symbol: string;

    @Column({ type: 'varchar', nullable: true })
    name: string;

    @Column({ type: 'float8', nullable: true })  // ✅ was int
    open: number;

    @Column({ type: 'float8', nullable: true })  // ✅
    high: number;

    @Column({ type: 'float8', nullable: true })  // ✅
    low: number;

    @Column({ type: 'float8', nullable: true })  // ✅
    current_price: number;

    @Column({ type: 'float8', nullable: true })  // ✅
    change: number;

    @Column({ type: 'int', nullable: true })      // ✅ keep int
    volume: number;

    @Column({ type: 'float8', nullable: true })  // ✅
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