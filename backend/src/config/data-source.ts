import "reflect-metadata";
import "dotenv/config";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || "galilee_admin",
  password: process.env.DB_PASSWORD || "galilee_password",
  database: process.env.DB_NAME || "galilee_os",

  //on garde false, les tables seront gérées par migrations
  synchronize: false,
  logging: false,


  entities: ["src/entities/**/*.ts"],
  migrations: ["src/migrations/**/*.ts"],
});

