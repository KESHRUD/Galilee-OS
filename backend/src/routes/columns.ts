import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { AppDataSource } from "../config/data-source";
import { ColumnEntity } from "../entities/Column";
import { Board } from "../entities/Board";
import { User } from "../entities/User";
import type { Column as ColumnDTO, CreateColumnDTO } from "../types";

const router = Router();

/**
 * In-memory fallback (tests)
 * Shape attendu par les tests / front : { id, title, order }
 */
export const columns: ColumnDTO[] = [
  { id: "todo", title: "To Do", order: 0 },
  { id: "in-progress", title: "In Progress", order: 1 },
  { id: "done", title: "Done", order: 2 },
];

/**
 * GET /api/columns
 * (fallback: renvoie les colonnes in-memory)
 * (DB: renvoie les colonnes DB, mappées en { id, title, order })
 */
router.get("/", async (_req: Request, res: Response): Promise<void> => {
  try {
    if (!AppDataSource.isInitialized) {
      res.json({ data: columns.sort((a, b) => a.order - b.order) });
      return;
    }

    const columnRepo = AppDataSource.getRepository(ColumnEntity);

    const dbColumns = await columnRepo.find({
      order: { position: "ASC" },
    });

    // Map DB -> DTO
    const data: ColumnDTO[] = dbColumns.map((c) => ({
      id: c.id,
      title: c.title,
      order: c.position,
    }));

    res.json({ data });
  } catch {
    res.status(500).json({ error: "Failed to fetch columns" });
  }
});

/**
 * POST /api/columns
 */
router.post("/", async (req: Request, res: Response): Promise<void> => {
  const dto: CreateColumnDTO = req.body;
  const boardId = (req.query.boardId as string) || "";

  if (!dto.title) {
    res.status(400).json({ error: "title is required" });
    return;
  }

  try {
    // Fallback tests
    if (!AppDataSource.isInitialized) {
      const newColumn: ColumnDTO = {
        id: `col-${uuidv4()}`,
        title: dto.title,
        order: typeof dto.order === "number" ? dto.order : columns.length,
      };

      columns.push(newColumn);
      res.status(201).json({ data: newColumn });
      return;
    }

    const boardRepo = AppDataSource.getRepository(Board);
    const userRepo = AppDataSource.getRepository(User);
    const columnRepo = AppDataSource.getRepository(ColumnEntity);

    let board: Board | null = null;
    if (boardId) {
      board = await boardRepo.findOne({ where: { id: boardId } });
    }

    if (!board) {
      // Fallback: use first available board
      board = await boardRepo.findOne({ order: { createdAt: "ASC" } });
    }

    if (!board) {
      // Create a default board if none exist
      const owner = await userRepo.findOne({ order: { createdAt: "ASC" } });
      if (!owner) {
        res.status(400).json({ error: "No users found to create a default board" });
        return;
      }
      board = await boardRepo.save(
        boardRepo.create({ title: "Default Board", owner })
      );
    }

    const position = typeof dto.order === "number" ? dto.order : 0;

    const column = columnRepo.create({
      title: dto.title,
      position,
      board,
    });

    const saved = await columnRepo.save(column);

    // Map DB -> DTO
    const data: ColumnDTO = {
      id: saved.id,
      title: saved.title,
      order: saved.position,
    };

    res.status(201).json({ data });
  } catch (err) {
    console.error("❌ create column error:", err);
    res.status(500).json({ error: "Failed to create column" });
  }

});

export default router;
