import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TaskCard } from "../../components/TaskCard";
import { Task } from "../../types";

// Mock the theme context
vi.mock("../../components/ThemeContext", () => ({
  useTheme: () => ({
    theme: "light",
    t: (key: string) => key,
  }),
}));

// Mock audio service
vi.mock("../../services/audioService", () => ({
  audioManager: {
    play: vi.fn(),
  },
}));

describe("TaskCard Component", () => {
  const mockTask: Task = {
    id: "t-1",
    title: "Test Task",
    description: "Test description",
    columnId: "todo",
    tags: ["test", "frontend"],
    priority: "high",
    createdAt: Date.now(),
    subtasks: [],
    comments: [],
  };

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnDragStart = vi.fn();

  it("renders task title correctly", () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onDragStart={mockOnDragStart}
      />
    );

    expect(screen.getByText("Test Task")).toBeInTheDocument();
  });

  it("displays priority badge", () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onDragStart={mockOnDragStart}
      />
    );

    // High priority should be visible
    const priorityBadge = screen.getByText(/high/i);
    expect(priorityBadge).toBeInTheDocument();
  });

  it("renders tags", () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onDragStart={mockOnDragStart}
      />
    );

    expect(screen.getByText("test")).toBeInTheDocument();
    expect(screen.getByText("frontend")).toBeInTheDocument();
  });

  it("calls onEdit when edit button is clicked", () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onDragStart={mockOnDragStart}
      />
    );

    const editButton = screen.getByRole("button", { name: /edit/i });
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
  });

  it("calls onDelete when delete button is clicked", () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onDragStart={mockOnDragStart}
      />
    );

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id);
  });

  it("is draggable", () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onDragStart={mockOnDragStart}
      />
    );

    const card = screen.getByTestId("task-card");
    expect(card).toHaveAttribute("draggable", "true");
  });
});
