import type { MigrationInterface, QueryRunner } from "typeorm";

export class AuthTokens20260121080000 implements MigrationInterface {
  name = "AuthTokens20260121080000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "refreshTokenHash" character varying`);
    await queryRunner.query(`ALTER TABLE "users" ADD "resetPasswordTokenHash" character varying`);
    await queryRunner.query(`ALTER TABLE "users" ADD "resetPasswordExpiresAt" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "resetPasswordExpiresAt"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "resetPasswordTokenHash"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "refreshTokenHash"`);
  }
}
