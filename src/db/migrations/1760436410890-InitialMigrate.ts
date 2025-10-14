import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigrate1760436410890 implements MigrationInterface {
    name = 'InitialMigrate1760436410890'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "risk_answers" RENAME COLUMN "selectedOption" TO "quizAnswer"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "risk_answers" RENAME COLUMN "quizAnswer" TO "selectedOption"`);
    }

}
