import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('stocks')
export class Stock {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', nullable: true })
  symbol!: string | null;

  @Column({ type: 'varchar', nullable: true })
  name!: string | null;

  @Column({ type: 'float', nullable: true })
  open!: number | null;

  @Column({ type: 'float', nullable: true })
  high!: number | null;

  @Column({ type: 'float', nullable: true })
  low!: number | null;

  @Column({ type: 'float', nullable: true })
  current_price!: number | null;

  @Column({ type: 'float', nullable: true })
  change!: number | null;

  @Column({ type: 'bigint', nullable: true })
  volume!: number | null;

  @Column({ type: 'float', nullable: true })
  beta!: number | null;

  @Column({ type: 'varchar', nullable: true })
  risk_level!: string | null;

  @Column({ type: 'varchar', nullable: true })
  sector!: string | null;

  @Column({ type: 'varchar', nullable: true })
  shariah_status!: string | null;

  @Column({ type: 'varchar', nullable: true })
  timestamp!: string | null;
}