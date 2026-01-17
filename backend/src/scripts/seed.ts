import "reflect-metadata";
import "dotenv/config";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { Board } from "../entities/Board";
import { ColumnEntity } from "../entities/Column";
import { Task } from "../entities/Task";

async function seed() {
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);
  const boardRepo = AppDataSource.getRepository(Board);
  const columnRepo = AppDataSource.getRepository(ColumnEntity);
  const taskRepo = AppDataSource.getRepository(Task);

  // User
  const user = userRepo.create({
    email: "admin@galilee.dev",
    passwordHash: "hashed_password",
    role: "admin",
  });
  await userRepo.save(user);

  //  Board
  const board = boardRepo.create({
    title: "Demo Board",
    owner: user,
  });

  await boardRepo.save(board);

  // Columns
  const todo = columnRepo.create({
    title: "Todo",
    position: 1,
    board,
  });

  const doing = columnRepo.create({
    title: "Doing",
    position: 2,
    board,
  });

  await columnRepo.save([todo, doing]);

  // Tasks
  const task1 = taskRepo.create({
    title: "Setup project",
    description: "Initialize backend",
    column: todo,
  });

  const task2 = taskRepo.create({
    title: "Create API",
    description: "Implement routes",
    column: doing,
  });

  await taskRepo.save([task1, task2]);

  console.log("✅ Database seeded successfully");
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error("❌ Seed failed", err);
  process.exit(1);
});
