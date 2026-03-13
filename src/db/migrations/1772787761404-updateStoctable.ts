import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateStoctable1772787761404 implements MigrationInterface {
    name = 'UpdateStoctable1772787761404'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock" DROP COLUMN "SharesOutstanding"`);
        await queryRunner.query(`ALTER TABLE "stock" ADD "SharesOutstanding" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stock" DROP COLUMN "MarketCap"`);
        await queryRunner.query(`ALTER TABLE "stock" ADD "MarketCap" bigint NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock" DROP COLUMN "MarketCap"`);
        await queryRunner.query(`ALTER TABLE "stock" ADD "MarketCap" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stock" DROP COLUMN "SharesOutstanding"`);
        await queryRunner.query(`ALTER TABLE "stock" ADD "SharesOutstanding" integer NOT NULL`);
    }

}
