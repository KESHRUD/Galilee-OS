import { Router, Request, Response } from "express";
import type { Board as BoardDTO } from "../types";
import { Board } from "../entities/Board";
import { authMiddleware, type AuthenticatedRequest } from "../middleware/AuthContext";
import { v4 as uuidv4 } from "uuid";
import { BoardController } from "../controllers/BoardController";
import { AppDataSource } from "../config/data-source";
import { BoardMember } from "../entities/BoardMember";
import { User } from "../entities/User";


const router = Router();

//Apply auth middleware to all board routes
router.use(authMiddleware);

//In-memory storage (temporary, used for tests / fallback)
export const boards: BoardDTO[] = [
  {
    id: "1",
    name: "My Kanban Board",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

//GET /api/boards - Get all boards (DB via controller, fallback in-memory)
router.get("/", BoardController.list);

// POST /api/boards - Create new board (DB)
router.post("/", async (req: Request, res: Response): Promise<void> => {
  const title: string | undefined = req.body.title ?? req.body.name;

  if (!title) {
    res.status(400).json({ error: "title (or name) is required" });
    return;
  }

  try {
    // Fallback for tests
    if (!AppDataSource.isInitialized) {
      const newBoard: BoardDTO = {
        id: uuidv4(),
        name: title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      boards.push(newBoard);
      res.status(201).json({ data: newBoard });
      return;
    }

    // ✅ FIX : Récupérer le owner depuis le JWT (via authMiddleware)
    const authenticatedReq = req as AuthenticatedRequest;
    const userId = authenticatedReq.user?.id;

    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const boardRepo = AppDataSource.getRepository(Board);

    const board = boardRepo.create({
      title,
      owner: { id: userId } as User, // ✅ Assigner le owner
    });

    const saved = await boardRepo.save(board);

    res.status(201).json({ data: saved });
  } catch (err) {
    console.error("Error creating board:", err);
    res.status(500).json({ error: "Failed to create board" });
  }
});


// POST /api/boards/:id/members - Add member to board
router.post("/:id/members", async (req: Request, res: Response): Promise<void> => {
  const { userId, role = "member" } = req.body;

  if (!userId) {
    res.status(400).json({ error: "userId is required" });
    return;
  }

  try {
    // Fallback (tests)
    if (!AppDataSource.isInitialized) {
      res.status(201).json({ data: { boardId: req.params.id, userId, role } });
      return;
    }

    const boardMemberRepo = AppDataSource.getRepository(BoardMember);
    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOne({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const boardMember = boardMemberRepo.create({
      role,
      board: { id: req.params.id } as Board,
      user: { id: userId } as User,
    });


    const saved = await boardMemberRepo.save(boardMember);

    res.status(201).json({ data: saved });
  } catch {
    res.status(500).json({ error: "Failed to add board member" });
  }
});


export default router;
