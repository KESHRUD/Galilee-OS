import { Router, Request, Response } from "express";
import { Task, CreateTaskDTO, UpdateTaskDTO } from "../types";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// In-memory storage (will be replaced with database later)
const tasks: Task[] = [
  {
    id: "t-1",
    title: "Setup project structure",
    description: "Initialize the Kanban PWA with Vite and React",
    columnId: "todo",
    tags: ["setup", "frontend"],
    priority: "high",
    createdAt: Date.now() - 86400000,
    subtasks: [],
    comments: [],
  },
  {
    id: "t-2",
    title: "Implement drag and drop",
    description: "Add HTML5 drag and drop functionality",
    columnId: "in-progress",
    tags: ["feature", "ux"],
    priority: "medium",
    createdAt: Date.now() - 43200000,
    subtasks: [],
    comments: [],
  },
  {
    id: "t-3",
    title: "Configure Service Worker",
    description: "Setup PWA offline capabilities",
    columnId: "done",
    tags: ["pwa", "offline"],
    priority: "high",
    createdAt: Date.now() - 172800000,
    subtasks: [],
    comments: [],
  },
];

// GET /api/tasks - Get all tasks
router.get("/", (_req: Request, res: Response) => {
  res.json(tasks);
});

// GET /api/tasks/:id - Get task by ID
router.get("/:id", (req: Request, res: Response): void => {
  const task = tasks.find((t) => t.id === req.params.id);

  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  res.json(task);
});

// POST /api/tasks - Create new task
router.post("/", (req: Request, res: Response): void => {
  const dto: CreateTaskDTO = req.body;

  if (!dto.title) {
    res.status(400).json({ error: "Title is required" });
    return;
  }

  const newTask: Task = {
    id: `t-${uuidv4()}`,
    title: dto.title,
    description: dto.description || "",
    columnId: dto.columnId || "todo",
    tags: dto.tags || [],
    priority: dto.priority || "medium",
    createdAt: Date.now(),
    dueDate: dto.dueDate,
    subtasks: dto.subtasks || [],
    comments: [],
    diagramCode: dto.diagramCode,
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});

// PATCH /api/tasks/:id - Update task (partial update)
router.patch("/:id", (req: Request, res: Response): void => {
  const taskIndex = tasks.findIndex((t) => t.id === req.params.id);

  if (taskIndex === -1) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  const dto: UpdateTaskDTO = req.body;

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...dto,
  };

  res.json(tasks[taskIndex]);
});

// PUT /api/tasks/:id - Update task (full replace)
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
  };

  res.json(tasks[taskIndex]);
});

// DELETE /api/tasks/:id - Delete task
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
