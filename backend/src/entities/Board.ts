import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { ColumnEntity } from "./Column";

@Entity("boards")
export class Board {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  owner!: User;

  //1 board -> N columns (maintenant que ColumnEntity existe)
  @OneToMany(() => ColumnEntity, (col) => col.board)
  columns?: ColumnEntity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

