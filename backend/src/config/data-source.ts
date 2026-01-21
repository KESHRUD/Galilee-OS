import "reflect-metadata";
import "dotenv/config";
import { DataSource } from "typeorm";

import { User } from "../entities/User";
import { UserProfile } from "../entities/UserProfile";
import { Board } from "../entities/Board";
import { ColumnEntity } from "../entities/Column";
import { Task } from "../entities/Task";
import { Tag } from "../entities/Tag";
import { BoardMember } from "../entities/BoardMember";
import { TaskTag } from "../entities/TaskTag";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || "galilee_admin",
  password: process.env.DB_PASSWORD || "galilee_password",
  database: process.env.DB_NAME || "galilee_os",

  //On utilise les migrations (pas synchronize)
  synchronize: false,
  logging: false,

  entities: [User, UserProfile, Board, ColumnEntity, Task, Tag, BoardMember, TaskTag],
  migrations: ["src/migrations/**/*.ts"],
});
