import { MigrationInterface, QueryRunner } from "typeorm";

export class StocksTbale1772787099498 implements MigrationInterface {
    name = 'StocksTbale1772787099498'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "prediction_history" ("id" SERIAL NOT NULL, "symbol" character varying NOT NULL, "prediction" text NOT NULL, "recommendation" character varying NOT NULL, "confidence" double precision NOT NULL, "reasoning" text NOT NULL, "risks" text NOT NULL, "sources" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_97cc0a8087892d52d7691bddfa6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "stock" ("id" SERIAL NOT NULL, "Ticker" character varying NOT NULL, "CompanyName" character varying NOT NULL, "Status" character varying NOT NULL, "OpenPrice" character varying NOT NULL, "ClosePrice" character varying NOT NULL, "DailyReturn" character varying NOT NULL, "SharesOutstanding" integer NOT NULL, "MarketCap" integer NOT NULL, "CAGR" character varying NOT NULL, "Volatility" character varying NOT NULL, "RiskScore" character varying NOT NULL, "RiskLevel" character varying NOT NULL, "Sector" character varying NOT NULL, CONSTRAINT "PK_092bc1fc7d860426a1dec5aa8e9" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "stock"`);
        await queryRunner.query(`DROP TABLE "prediction_history"`);
    }

}
