import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Board } from "./Board";
import { Task } from "./Task";

//On évite d'appeler la classe "Column" pour ne pas confondre avec le décorateur @Column() de TypeORM.

@Entity("columns")
export class ColumnEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column({ type: "int", default: 0 })
  position!: number;

  //1 board -> N columns
  @ManyToOne(() => Board, (board) => board.columns, { onDelete: "CASCADE" })
  board!: Board;

  //1 column -> N tasks 
  @OneToMany(() => Task, (task) => task.column)
  tasks?: Task[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

