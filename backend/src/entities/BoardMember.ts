import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  Unique,
} from "typeorm";
import { User } from "./User";
import { Board } from "./Board";

@Entity("board_members")
@Unique(["user", "board"]) // empêche un doublon user+board
export class BoardMember {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, { onDelete: "CASCADE", nullable: false })
  user!: User;

  @ManyToOne(() => Board, { onDelete: "CASCADE", nullable: false })
  board!: Board;

  @Column({ type: "varchar", default: "member" })
  role!: "owner" | "member";

  @CreateDateColumn()
  joinedAt!: Date;
}

