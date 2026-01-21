import "reflect-metadata";
import { AppDataSource } from "../config/data-source";

async function main() {
  await AppDataSource.initialize();

  const migrations = await AppDataSource.runMigrations();
  console.log(`✅ Ran ${migrations.length} migration(s).`);

  await AppDataSource.destroy();
}

main().catch((e) => {
  console.error("❌ Failed to run migrations", e);
  process.exit(1);
});
