import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1767772348478 implements MigrationInterface {
    name = 'Init1767772348478'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."sessions_role_enum" AS ENUM('ADMIN', 'STAFF')`);
        await queryRunner.query(`CREATE TABLE "sessions" ("id" SERIAL NOT NULL, "role" "public"."sessions_role_enum" NOT NULL DEFAULT 'ADMIN', "created_at" bigint NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000, "admin_id" integer, CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "admin" ("id" SERIAL NOT NULL, "name" character varying, "email" character varying NOT NULL, "is_deleted" boolean NOT NULL DEFAULT false, "is_email_verified" boolean NOT NULL DEFAULT false, "password" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'ADMIN', "otp" character varying, "otp_expire_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e032310bcef831fb83101899b10" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "description" text, "price" numeric(10,2) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD CONSTRAINT "FK_981628d272eb7be19041aea76e4" FOREIGN KEY ("admin_id") REFERENCES "admin"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "FK_981628d272eb7be19041aea76e4"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "admin"`);
        await queryRunner.query(`DROP TABLE "sessions"`);
        await queryRunner.query(`DROP TYPE "public"."sessions_role_enum"`);
    }

}
