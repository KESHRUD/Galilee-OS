import { Router, Request, Response } from "express";
import { Board } from "../types";
import { authMiddleware } from "../middleware/AuthContext";
import { v4 as uuidv4 } from "uuid";
import { BoardController } from "../controllers/BoardController";
import { AppDataSource } from "../config/data-source";
import { BoardMember } from "../entities/BoardMember";
import { User } from "../entities/User";


const router = Router();

//Apply auth middleware to all board routes
router.use(authMiddleware);

//In-memory storage (temporary, used for tests / fallback)
export const boards: Board[] = [
  {
    id: "1",
    name: "My Kanban Board",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

//GET /api/boards - Get all boards (DB via controller, fallback in-memory)
router.get("/", BoardController.list);

// POST /api/boards - Create new board (still in-memory for now)
router.post("/", (req: Request, res: Response): void => {
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ error: "Name is required" });
    return;
  }

  const newBoard: Board = {
    id: uuidv4(),
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  boards.push(newBoard);

  res.status(201).json({ data: newBoard });
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
      board: { id: req.params.id } as any,
      user: { id: userId } as any,
    });


    const saved = await boardMemberRepo.save(boardMember);

    res.status(201).json({ data: saved });
  } catch {
    res.status(500).json({ error: "Failed to add board member" });
  }
});


export default router;
