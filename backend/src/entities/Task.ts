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

  @Column({ type: "int", default: 0 })
  position!: number;

  /**
   * ONE-TO-MANY (côté ManyToOne ici)
   * - Une colonne contient plusieurs tâches
   * - Une tâche appartient à une colonne
   */
  @ManyToOne(() => ColumnEntity, (column) => column.tasks, {
    onDelete: "CASCADE",
    nullable: false,
  })
  column!: ColumnEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

