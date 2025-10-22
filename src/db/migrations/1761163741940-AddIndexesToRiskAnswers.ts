import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexesToRiskAnswers1761163741940 implements MigrationInterface {
    name = 'AddIndexesToRiskAnswers1761163741940'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_c09950e1821cd0f8d0a9633367" ON "risk_answers" ("createdAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_fcebac831763703a306ef754f7" ON "risk_answers" ("userId", "questionId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_fcebac831763703a306ef754f7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c09950e1821cd0f8d0a9633367"`);
    }

}
