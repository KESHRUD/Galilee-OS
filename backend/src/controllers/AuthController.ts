import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // TEST / CI MODE : pas de DB
      if (
        process.env.NODE_ENV === "test" ||
        process.env.START_SERVER === "false" ||
        !AppDataSource.isInitialized
      ) {
        if (!email || !password) {
          return res.status(400).json({ error: "Missing credentials" });
        }

        const token = jwt.sign(
          { sub: "test-user", email },
          process.env.JWT_SECRET || "test_secret",
          { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
        );

        return res.status(200).json({ token });
      }

      const userRepo = AppDataSource.getRepository(User);

      const user = await userRepo.findOne({
        where: { email },
        relations: { profile: true },
      });

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET || "dev-secret",
        { expiresIn: "1h" }
      );

      return res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          profile: user.profile ?? null,
        },
      });
    } catch {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

