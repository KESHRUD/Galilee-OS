import { Router, Request, Response } from "express";
import { Column, CreateColumnDTO } from "../types";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// In-memory storage
const columns: Column[] = [
  { id: "todo", title: "To Do", order: 0 },
  { id: "in-progress", title: "In Progress", order: 1 },
  { id: "done", title: "Done", order: 2 },
];

// GET /api/columns - Get all columns
router.get("/", (_req: Request, res: Response) => {
  res.json(columns.sort((a, b) => a.order - b.order));
});

// POST /api/columns - Create new column
router.post("/", (req: Request, res: Response): void => {
  const dto: CreateColumnDTO = req.body;

  if (!dto.title) {
    res.status(400).json({ error: "Title is required" });
    return;
  }

  const newColumn: Column = {
    id: `col-${uuidv4()}`,
    title: dto.title,
    order: columns.length,
  };

  columns.push(newColumn);

  res.status(201).json(newColumn);
});

// PATCH /api/columns/:id - Update column
router.patch("/:id", (req: Request, res: Response): void => {
  const columnIndex = columns.findIndex((c) => c.id === req.params.id);

  if (columnIndex === -1) {
    res.status(404).json({ error: "Column not found" });
    return;
  }

  columns[columnIndex] = {
    ...columns[columnIndex],
    ...req.body,
  };

  res.json(columns[columnIndex]);
});

// DELETE /api/columns/:id - Delete column
router.delete("/:id", (req: Request, res: Response): void => {
  const columnIndex = columns.findIndex((c) => c.id === req.params.id);

  if (columnIndex === -1) {
    res.status(404).json({ error: "Column not found" });
    return;
  }

  columns.splice(columnIndex, 1);

  res.status(204).send();
});

export default router;
