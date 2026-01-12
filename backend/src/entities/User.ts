import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from "typeorm";
import { UserProfile } from "./UserProfile";

export type UserRole = "admin" | "student";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column({ type: "varchar", default: "student" })
  role!: UserRole;

  // ✅ 1:1 (ajouté maintenant pour satisfaire UserProfile)
  @OneToOne(() => UserProfile, (profile) => profile.user)
  profile?: UserProfile;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

