import type { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Board } from "../entities/Board";
import { boards as inMemoryBoards } from "../routes/boards";

export class BoardController {
  // GET /api/boards
  static async list(_req: Request, res: Response) {
    try {
      // Fallback if DB not initialized (tests)
      if (!AppDataSource.isInitialized) {
        return res.json({ data: inMemoryBoards });
      }

      const boardRepo = AppDataSource.getRepository(Board);

      const boards = await boardRepo.find({
        relations: {
          owner: true,
          columns: true,
        },
        order: { createdAt: "ASC" },
      });

      return res.json({ data: boards });
    } catch {
      return res.status(500).json({ error: "Failed to fetch boards" });
    }
  }
}
