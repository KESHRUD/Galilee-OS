import { Router, Request, Response } from "express";
import { Task } from "../types";

const router = Router();

// POST /api/sync - Sync offline changes
router.post("/", (req: Request, res: Response): void => {
  const { pendingTasks, pendingColumns } = req.body as {
    pendingTasks?: Task[];
    pendingColumns?: { id: string; title: string; order: number }[];
  };

  const syncedTasks: string[] = [];
  const syncedColumns: string[] = [];

  // In a real app, this would merge with database
  // For now, just acknowledge the sync request
  if (pendingTasks && Array.isArray(pendingTasks)) {
    pendingTasks.forEach((task) => {
      syncedTasks.push(task.id);
    });
  }

  if (pendingColumns && Array.isArray(pendingColumns)) {
    pendingColumns.forEach((column) => {
      syncedColumns.push(column.id);
    });
  }

  res.json({
    success: true,
    synced: {
      tasks: syncedTasks.length,
      columns: syncedColumns.length,
    },
    timestamp: Date.now(),
  });
});

// GET /api/sync/status - Get sync status
router.get("/status", (_req: Request, res: Response) => {
  res.json({
    online: true,
    lastSync: Date.now(),
    serverTime: new Date().toISOString(),
  });
});

export default router;
