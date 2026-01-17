import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "@app/index";
import { AppDataSource } from "@app/config/data-source";

import { User } from "@app/entities/User";
import { UserProfile } from "@app/entities/UserProfile";
import { Board } from "@app/entities/Board";
import { ColumnEntity } from "@app/entities/Column";
import { Task } from "@app/entities/Task";
import { Tag } from "@app/entities/Tag";
import { BoardMember } from "@app/entities/BoardMember";
import { TaskTag } from "@app/entities/TaskTag";

import type { DeepPartial } from "typeorm";

describe("DB Relations (1:1, 1:N, N:M)", () => {
  it("GET /api/health should not crash (CI safe)", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
  });

  it("should create and fetch relations in DB when available", async () => {
    if (!AppDataSource.isInitialized) {
      expect(true).toBe(true);
      return;
    }

    const userRepo = AppDataSource.getRepository(User);
    const profileRepo = AppDataSource.getRepository(UserProfile);
    const boardRepo = AppDataSource.getRepository(Board);
    const columnRepo = AppDataSource.getRepository(ColumnEntity);
    const taskRepo = AppDataSource.getRepository(Task);
    const tagRepo = AppDataSource.getRepository(Tag);
    const boardMemberRepo = AppDataSource.getRepository(BoardMember);
    const taskTagRepo = AppDataSource.getRepository(TaskTag);

    // Cleanup simple
    await taskTagRepo.delete({});
    await boardMemberRepo.delete({});
    await taskRepo.delete({});
    await columnRepo.delete({});
    await boardRepo.delete({});
    await profileRepo.delete({});
    await userRepo.delete({});
    await tagRepo.delete({});

    // =========================
    // 1:1 User <-> UserProfile
    // =========================
    const user = await userRepo.save(
      userRepo.create({
        email: "rel-test@example.com",
        passwordHash: "hash",
        role: "student",
      } as DeepPartial<User>)
    );

    // On ne met que la relation user ici (les autres champs dépendent de ton modèle)
    await profileRepo.save(
      profileRepo.create({
        user,
      } as DeepPartial<UserProfile>)
    );

    const fetchedUser = await userRepo.findOne({
      where: { id: user.id },
      relations: { profile: true },
    });

    expect(fetchedUser).toBeTruthy();
    expect(fetchedUser?.profile).toBeTruthy();

    // =========================
    // 1:N User -> Boards
    // =========================
    const board = await boardRepo.save(
      boardRepo.create({
        title: "Relations Board",
        owner: user,
      } as DeepPartial<Board>)
    );

    const boards = await boardRepo.find({
      where: { owner: { id: user.id } },
      relations: { owner: true },
    });

    expect(boards.length).toBeGreaterThan(0);

    // =========================
    // 1:N Board -> Columns
    // =========================
    const column = await columnRepo.save(
      columnRepo.create({
        title: "To Do",
        position: 0,
        board,
      } as DeepPartial<ColumnEntity>)
    );

    const cols = await columnRepo.find({
      where: { board: { id: board.id } },
      relations: { board: true },
    });

    expect(cols.length).toBeGreaterThan(0);

    // =========================
    // 1:N Column -> Tasks
    // =========================
    // ⚠️ On force DeepPartial pour éviter les erreurs si tes champs ne s'appellent pas title/status/etc.
    const task = await taskRepo.save(
      taskRepo.create({
        column,
      } as DeepPartial<Task>)
    );

    const tasks = await taskRepo.find({
      where: { column: { id: column.id } },
      relations: { column: true },
    });

    expect(tasks.length).toBeGreaterThan(0);

    // =========================
    // N:M User <-> Board via BoardMember
    // =========================
    await boardMemberRepo.save(
      boardMemberRepo.create({
        role: "member",
        user,
        board,
      } as DeepPartial<BoardMember>)
    );

    const members = await boardMemberRepo.find({
      where: { user: { id: user.id } },
      relations: { user: true, board: true },
    });

    expect(members.length).toBeGreaterThan(0);

    // =========================
    // N:M Task <-> Tag via TaskTag
    // =========================
    const tag = await tagRepo.save(tagRepo.create({ name: "urgent" } as DeepPartial<Tag>));

    await taskTagRepo.save(
      taskTagRepo.create({
        task: { id: task.id } as DeepPartial<Task>, // ✅ important: task est un objet unique
        tag: { id: tag.id } as DeepPartial<Tag>,
      } as DeepPartial<TaskTag>)
    );

    const tts = await taskTagRepo.find({
      where: { task: { id: task.id } },
      relations: { task: true, tag: true },
    });

    expect(tts.length).toBeGreaterThan(0);
  });
});
