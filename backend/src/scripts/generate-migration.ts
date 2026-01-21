import "reflect-metadata";
import { AppDataSource } from "../config/data-source";
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

function tsTimestamp() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    d.getFullYear().toString() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  );
}

function escapeBackticks(sql: string) {
  return sql.replace(/`/g, "\\`");
}

async function main() {
  await AppDataSource.initialize();

  // Génère les requêtes SQL nécessaires pour aligner la DB sur les entités
  const schemaLog = await AppDataSource.driver.createSchemaBuilder().log();

  const upSql = schemaLog.upQueries.map((q) => q.query).filter(Boolean);
  const downSql = schemaLog.downQueries.map((q) => q.query).filter(Boolean);

  const name = "InitialSchema";
  const stamp = tsTimestamp();
  const className = `${name}${stamp}`;
  const fileName = `${stamp}-${name}.ts`;

  mkdirSync(join(process.cwd(), "src/migrations"), { recursive: true });

  const file = `
import { MigrationInterface, QueryRunner } from "typeorm";

export class ${className} implements MigrationInterface {
  name = "${className}";

  public async up(queryRunner: QueryRunner): Promise<void> {
${upSql.map((q) => `    await queryRunner.query(\`${escapeBackticks(q)}\`);`).join("\n")}
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
${downSql.map((q) => `    await queryRunner.query(\`${escapeBackticks(q)}\`);`).join("\n")}
  }
}
`.trimStart();

  const outPath = join(process.cwd(), "src/migrations", fileName);
  writeFileSync(outPath, file, { encoding: "utf8" });

  await AppDataSource.destroy();

  console.log(`✅ Migration generated: ${outPath}`);
  console.log(`   up queries: ${upSql.length}, down queries: ${downSql.length}`);
}

main().catch((e) => {
  console.error("❌ Failed to generate migration", e);
  process.exit(1);
});
