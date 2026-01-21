import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import bcrypt from "bcrypt";
import { UserProfile } from "./UserProfile";

export type UserRole = "admin" | "student";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", unique: true })
  email!: string;

  @Column({ type: "varchar" })
  passwordHash!: string;

  @Column({ type: "varchar", default: "student" })
  role!: UserRole;

  @Column({ type: "varchar", nullable: true })
  refreshTokenHash?: string | null;

  @Column({ type: "varchar", nullable: true })
  resetPasswordTokenHash?: string | null;

  @Column({ type: "timestamp", nullable: true })
  resetPasswordExpiresAt?: Date | null;

  // ✅ 1:1 (ajouté maintenant pour satisfaire UserProfile)
  @OneToOne(() => UserProfile, (profile) => profile.user)
  profile?: UserProfile;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // ================================================================
  // 🔐 SÉCURITÉ : Auto-hash du mot de passe avant insertion/update
  // ================================================================
  
  /**
   * Champ temporaire pour stocker le plaintext password
   * Utilisé uniquement avant insertion, pas persisté en DB
   */
  plainPassword?: string;

  /**
   * Hook exécuté AVANT l'insertion en base
   * Hash automatiquement le mot de passe si fourni
   */
  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    if (this.plainPassword) {
      this.passwordHash = await bcrypt.hash(this.plainPassword, 10);
      // Nettoyage : on supprime le plaintext après hash
      delete this.plainPassword;
    }
  }

  /**
   * Hook exécuté AVANT la mise à jour en base
   * Hash le nouveau mot de passe si modifié
   */
  @BeforeUpdate()
  async hashPasswordBeforeUpdate() {
    if (this.plainPassword) {
      this.passwordHash = await bcrypt.hash(this.plainPassword, 10);
      delete this.plainPassword;
    }
  }
}

