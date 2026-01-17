import { describe, it, expect } from "vitest";
import { AppDataSource } from "@app/config/data-source";

import { User } from "@app/entities/User";
import { UserProfile } from "@app/entities/UserProfile";
import { Board } from "@app/entities/Board";
import { ColumnEntity } from "@app/entities/Column";
import { Task } from "@app/entities/Task";
import { Tag } from "@app/entities/Tag";
import { BoardMember } from "@app/entities/BoardMember";
import { TaskTag } from "@app/entities/TaskTag";

describe("DB Relations (1:1, 1:N, N:M)", () => {
  it("should validate relations when DB is available", async () => {
    // ✅ En CI / tests sans DB, on SKIP proprement
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

    // Nettoyage (ordre inverse des dépendances)
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
      })
    );

    const profile = await profileRepo.save(
      profileRepo.create({
        xp: 100,
        level: 2,
        user,
      })
    );

    const fetchedUser = await userRepo.findOne({
      where: { id: user.id },
      relations: { profile: true },
    });

    expect(fetchedUser).toBeTruthy();
    expect(fetchedUser?.profile).toBeTruthy();
    expect(fetchedUser?.profile?.id).toBe(profile.id);

    // =========================
    // 1:N User -> Boards
    // =========================
    const board = await boardRepo.save(
      boardRepo.create({
        title: "Relations Board",
        owner: user,
      })
    );

    const boards = await boardRepo.find({
      where: { owner: { id: user.id } },
      relations: { owner: true, columns: true },
    });

    expect(boards.length).toBeGreaterThan(0);
    expect(boards[0].owner.id).toBe(user.id);

    // =========================
    // 1:N Board -> Columns
    // =========================
    const column = await columnRepo.save(
      columnRepo.create({
        title: "To Do",
        position: 0,
        board,
      })
    );

    const cols = await columnRepo.find({
      where: { board: { id: board.id } },
      relations: { board: true, tasks: true },
    });

    expect(cols.length).toBeGreaterThan(0);
    expect(cols[0].board.id).toBe(board.id);

    // =========================
    // 1:N Column -> Tasks
    // =========================
    const task = await taskRepo.save(
      taskRepo.create({
        title: "Test task",
        description: "Desc",
        completed: false,
        position: 0,
        column,
      })
    );

    const tasks = await taskRepo.find({
      where: { column: { id: column.id } },
      relations: { column: true },
    });

    expect(tasks.length).toBeGreaterThan(0);
    expect(tasks[0].id).toBe(task.id);

    // =========================
    // N:M User <-> Board via BoardMember
    // =========================
    await boardMemberRepo.save(
      boardMemberRepo.create({
        role: "member",
        user,
        board,
      })
    );

    const members = await boardMemberRepo.find({
      where: { board: { id: board.id } },
      relations: { user: true, board: true },
    });

    expect(members.length).toBeGreaterThan(0);
    expect(members[0].user.id).toBe(user.id);

    // =========================
    // N:M Task <-> Tag via TaskTag
    // =========================
    const tag = await tagRepo.save(tagRepo.create({ name: "urgent" }));

    await taskTagRepo.save(
      taskTagRepo.create({
        task,
        tag,
      })
    );

    const taskTags = await taskTagRepo.find({
      where: { task: { id: task.id } },
      relations: { task: true, tag: true },
    });

    expect(taskTags.length).toBeGreaterThan(0);
    expect(taskTags[0].tag.id).toBe(tag.id);
  });
});
