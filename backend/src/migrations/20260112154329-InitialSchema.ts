import type { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema20260112154329 implements MigrationInterface {
  name = "InitialSchema20260112154329";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "user_profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "xp" integer NOT NULL DEFAULT '0', "level" integer NOT NULL DEFAULT '1', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "REL_8481388d6325e752cd4d7e26c6" UNIQUE ("userId"), CONSTRAINT "PK_1ec6662219f4605723f1e41b6cb" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'student', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text, "completed" boolean NOT NULL DEFAULT false, "position" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "columnId" uuid NOT NULL, CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "columns" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "position" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "boardId" uuid, CONSTRAINT "PK_4ac339ccbbfed1dcd96812abbd5" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "boards" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" uuid, CONSTRAINT "PK_606923b0b068ef262dfdcd18f44" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "tags" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_d90243459a697eadb8ad56e9092" UNIQUE ("name"), CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "board_members" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" character varying NOT NULL DEFAULT 'member', "joinedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "boardId" uuid NOT NULL, CONSTRAINT "UQ_345cd31bb32ae01f9fbc5ac3a1c" UNIQUE ("userId", "boardId"), CONSTRAINT "PK_6994cea1393b5fa3a0dd827a9f7" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "task_tags" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "taskId" uuid NOT NULL, "tagId" uuid NOT NULL, CONSTRAINT "UQ_20be04cfd9558da670ed177211d" UNIQUE ("taskId", "tagId"), CONSTRAINT "PK_7b47a7628547c0976415988d3cb" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_8481388d6325e752cd4d7e26c6d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_0ecfe75e5bd731e00e634d70e5f" FOREIGN KEY ("columnId") REFERENCES "columns"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "columns" ADD CONSTRAINT "FK_ac92bfd7ba33174aabef610f361" FOREIGN KEY ("boardId") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "boards" ADD CONSTRAINT "FK_dcdf669d9c6727190556702de56" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "board_members" ADD CONSTRAINT "FK_2af5912734e7fbedc23afd07adc" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "board_members" ADD CONSTRAINT "FK_8dfe924ec592792320086ebb692" FOREIGN KEY ("boardId") REFERENCES "boards"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "task_tags" ADD CONSTRAINT "FK_1470ad368e79cb5636163a4bf8d" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "task_tags" ADD CONSTRAINT "FK_ac1cfe87c11bc138ee8675cff3c" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // ================================================================
    // ✅ FIX : DROP les contraintes FK AVANT de DROP les tables
    // Ordre : constraints → pivot tables → dependent tables → main tables
    // ================================================================
    
    // 1. Drop Foreign Key Constraints
    await queryRunner.query(`ALTER TABLE "task_tags" DROP CONSTRAINT "FK_ac1cfe87c11bc138ee8675cff3c"`);
    await queryRunner.query(`ALTER TABLE "task_tags" DROP CONSTRAINT "FK_1470ad368e79cb5636163a4bf8d"`);
    await queryRunner.query(`ALTER TABLE "board_members" DROP CONSTRAINT "FK_8dfe924ec592792320086ebb692"`);
    await queryRunner.query(`ALTER TABLE "board_members" DROP CONSTRAINT "FK_2af5912734e7fbedc23afd07adc"`);
    await queryRunner.query(`ALTER TABLE "boards" DROP CONSTRAINT "FK_dcdf669d9c6727190556702de56"`);
    await queryRunner.query(`ALTER TABLE "columns" DROP CONSTRAINT "FK_ac92bfd7ba33174aabef610f361"`);
    await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_0ecfe75e5bd731e00e634d70e5f"`);
    await queryRunner.query(`ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_8481388d6325e752cd4d7e26c6d"`);
    
    // 2. Drop Tables (reverse dependency order)
    await queryRunner.query(`DROP TABLE "task_tags"`);       // Pivot Task-Tag
    await queryRunner.query(`DROP TABLE "board_members"`);   // Pivot User-Board
    await queryRunner.query(`DROP TABLE "tasks"`);           // Dépend de columns
    await queryRunner.query(`DROP TABLE "tags"`);            // Indépendant
    await queryRunner.query(`DROP TABLE "columns"`);         // Dépend de boards
    await queryRunner.query(`DROP TABLE "boards"`);          // Dépend de users
    await queryRunner.query(`DROP TABLE "user_profiles"`);   // Dépend de users
    await queryRunner.query(`DROP TABLE "users"`);           // Table principale
  }
}
