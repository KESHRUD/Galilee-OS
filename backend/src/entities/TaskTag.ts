import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from "typeorm";
import { Task } from "./Task";
import { Tag } from "./Tag";

@Entity("task_tags")
@Unique(["task", "tag"]) //empêche le même tag 2x sur une tâche
export class TaskTag {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Task, { onDelete: "CASCADE", nullable: false })
  task!: Task;

  @ManyToOne(() => Tag, { onDelete: "CASCADE", nullable: false })
  tag!: Tag;

  @CreateDateColumn()
  createdAt!: Date;
}

