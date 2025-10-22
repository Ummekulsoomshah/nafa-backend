import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexesToUser1761168545124 implements MigrationInterface {
    name = 'AddIndexesToUser1761168545124'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_user_email" ON "user" ("email") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_user_email"`);
    }

}
