import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('stock')
export class Stock {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    Ticker: string;
    @Column()
    CompanyName: string;
    @Column()
    Status: string;
    @Column()
    OpenPrice: string;
    @Column()
    ClosePrice: string;
    @Column()
    DailyReturn: string;
    @Column('bigint')
    SharesOutstanding: string;
    @Column('bigint')
    MarketCap: string;
    @Column()
    CAGR: string;
    @Column()
    Volatility: string;
    @Column()
    RiskScore: string;
    @Column()
    RiskLevel: string;
    @Column()
    Sector: string;}
