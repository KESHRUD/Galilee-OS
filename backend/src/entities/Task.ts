import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { ColumnEntity } from "./Column";

@Entity("tasks")
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ default: false })
  completed!: boolean;

  //N tasks -> 1 column
  @ManyToOne(() => ColumnEntity, (column) => column.tasks, { onDelete: "CASCADE", nullable: true })
  column?: ColumnEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

