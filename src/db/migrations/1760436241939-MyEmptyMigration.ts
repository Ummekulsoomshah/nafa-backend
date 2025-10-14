import { MigrationInterface, QueryRunner } from "typeorm";

export class MyEmptyMigration1760436241939 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
