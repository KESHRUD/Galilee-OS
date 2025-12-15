import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { setupServer } from "msw/node";
import { handlers } from "../mocks/handlers";

const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("MSW API Mocks", () => {
  describe("GET /api/tasks", () => {
    it("should return list of tasks", async () => {
      const response = await fetch("/api/tasks");
      const tasks = await response.json();

      expect(response.ok).toBe(true);
      expect(Array.isArray(tasks)).toBe(true);
      expect(tasks.length).toBeGreaterThan(0);
    });

    it("should return tasks with correct structure", async () => {
      const response = await fetch("/api/tasks");
      const tasks = await response.json();

      const task = tasks[0];
      expect(task).toHaveProperty("id");
      expect(task).toHaveProperty("title");
      expect(task).toHaveProperty("columnId");
      expect(task).toHaveProperty("priority");
    });
  });

  describe("POST /api/tasks", () => {
    it("should create a new task", async () => {
      const newTask = {
        title: "New Test Task",
        description: "Test description",
        columnId: "todo",
        priority: "high",
      };

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });

      const createdTask = await response.json();

      expect(response.status).toBe(201);
      expect(createdTask.title).toBe("New Test Task");
      expect(createdTask.id).toBeDefined();
    });
  });

  describe("PATCH /api/tasks/:id", () => {
    it("should update an existing task", async () => {
      // First get existing tasks
      const getResponse = await fetch("/api/tasks");
      const tasks = await getResponse.json();
      const taskId = tasks[0].id;

      // Update the task
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Updated Title" }),
      });

      const updatedTask = await response.json();

      expect(response.ok).toBe(true);
      expect(updatedTask.title).toBe("Updated Title");
    });
  });

  describe("DELETE /api/tasks/:id", () => {
    it("should delete a task", async () => {
      // First get existing tasks
      const getResponse = await fetch("/api/tasks");
      const tasks = await getResponse.json();
      const taskId = tasks[0].id;

      // Delete the task
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      expect(response.status).toBe(204);
    });
  });

  describe("GET /api/columns", () => {
    it("should return list of columns", async () => {
      const response = await fetch("/api/columns");
      const columns = await response.json();

      expect(response.ok).toBe(true);
      expect(Array.isArray(columns)).toBe(true);
      expect(columns.length).toBeGreaterThan(0);
    });

    it("should return columns with correct structure", async () => {
      const response = await fetch("/api/columns");
      const columns = await response.json();

      const column = columns[0];
      expect(column).toHaveProperty("id");
      expect(column).toHaveProperty("title");
      expect(column).toHaveProperty("order");
    });
  });
});
