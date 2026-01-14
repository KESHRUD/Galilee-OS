import { Router, Request, Response } from "express";
import { Task, CreateTaskDTO, UpdateTaskDTO } from "../types";
import { v4 as uuidv4 } from "uuid";

import { AppDataSource } from "../config/data-source";
import { Task as TaskEntity } from "../entities/Task";

const router = Router();

// In-memory storage (will be replaced with database later)
const tasks: Task[] = [
  {
    id: "1",
    title: "Setup project",
    description: "Initialize backend and frontend",
    status: "done",
    priority: "high",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Create API routes",
    description: "Build RESTful API endpoints",
    status: "in-progress",
    priority: "high",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// GET /api/tasks - Get all tasks (DB if available, fallback to in-memory during tests)
router.get("/", async (_req: Request, res: Response) => {
  try {
    // If DB isn't initialized (ex: tests), fallback to in-memory
    if (!AppDataSource.isInitialized) {
      return res.json({ data: tasks });
    }

    const taskRepo = AppDataSource.getRepository(TaskEntity);

    const dbTasks = await taskRepo.find({
      relations: { column: true },
      order: { createdAt: "ASC" },
    });

    return res.json({ data: dbTasks });
  } catch {
    // Fallback to in-memory if DB fails
    return res.json({ data: tasks });
  }
});


// GET /api/tasks/:id - Get task by ID (still in-memory for now)
router.get("/:id", (req: Request, res: Response): void => {
  const task = tasks.find((t) => t.id === req.params.id);

  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  res.json({ data: task });
});

// POST /api/tasks - Create new task (DB if available, fallback to in-memory during tests)
router.post("/", async (req: Request, res: Response): Promise<void> => {
  const dto: CreateTaskDTO = req.body;

  if (!dto.title) {
    res.status(400).json({ error: "Title is required" });
    return;
  }

  try {
    //Fallback if DB not initialized (tests)
    if (!AppDataSource.isInitialized) {
      const newTask: Task = {
        id: uuidv4(),
        title: dto.title,
        description: dto.description,
        status: dto.status || "todo",
        priority: dto.priority,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      tasks.push(newTask);
      res.status(201).json({ data: newTask });
      return;
    }

    const taskRepo = AppDataSource.getRepository(TaskEntity);

    //TaskEntity needs a Column (ManyToOne, nullable false)
    //For now, we allow creating a task only if columnId is provided
    const { columnId } = dto as unknown as { columnId?: string };
    if (!columnId) {
      res.status(400).json({ error: "columnId is required" });
      return;
    }

    const created = taskRepo.create({
      title: dto.title,
      description: dto.description,
      completed: false,
      position: 0,
      column: { id: columnId } as any,
    });

    const saved = await taskRepo.save(created);

    res.status(201).json({ data: saved });
  } catch {
    res.status(500).json({ error: "Failed to create task" });
  }
});

// PUT /api/tasks/:id - Update task (still in-memory for now)
router.put("/:id", (req: Request, res: Response): void => {
  const taskIndex = tasks.findIndex((t) => t.id === req.params.id);

  if (taskIndex === -1) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  const dto: UpdateTaskDTO = req.body;

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...dto,
    updatedAt: new Date().toISOString(),
  };

  res.json({ data: tasks[taskIndex] });
});

// DELETE /api/tasks/:id - Delete task (still in-memory for now)
router.delete("/:id", (req: Request, res: Response): void => {
  const taskIndex = tasks.findIndex((t) => t.id === req.params.id);

  if (taskIndex === -1) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  tasks.splice(taskIndex, 1);

  res.status(204).send();
});

export default router;
