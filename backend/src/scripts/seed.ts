import "reflect-metadata";
import "dotenv/config";
import bcrypt from "bcrypt";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { UserProfile } from "../entities/UserProfile";
import { Board } from "../entities/Board";
import { ColumnEntity } from "../entities/Column";
import { Task } from "../entities/Task";
import { Tag } from "../entities/Tag";
import { BoardMember } from "../entities/BoardMember";
import { TaskTag } from "../entities/TaskTag";

/**
 * ================================================================
 * 🌱 SEED SCRIPT - Galilée OS Database
 * ================================================================
 * Peuple la base avec des données de test :
 * - 3 utilisateurs (admin, Sarah, Mouenis)
 * - Profils utilisateurs (relation 1:1)
 * - 2 boards
 * - 5 colonnes
 * - 15 tâches
 * - 8 tags
 * - Relations Many-to-Many (BoardMember, TaskTag)
 * ================================================================
 */

async function seed() {
  console.log("🌱 Starting database seed...\n");
  
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);
  const profileRepo = AppDataSource.getRepository(UserProfile);
  const boardRepo = AppDataSource.getRepository(Board);
  const columnRepo = AppDataSource.getRepository(ColumnEntity);
  const taskRepo = AppDataSource.getRepository(Task);
  const tagRepo = AppDataSource.getRepository(Tag);
  const boardMemberRepo = AppDataSource.getRepository(BoardMember);
  const taskTagRepo = AppDataSource.getRepository(TaskTag);

  // ================================================================
  // 1. 👥 USERS (3 users avec mots de passe hashés manuellement)
  // ================================================================
  console.log("👥 Creating users...");
  
  // ✅ Hash des mots de passe AVANT création (car @BeforeInsert ne marche pas en batch save)
  const adminPasswordHash = await bcrypt.hash("Admin123!", 10);
  const userPasswordHash = await bcrypt.hash("User123!", 10);
  
  const admin = userRepo.create({
    email: "admin@galilee.com",
    passwordHash: adminPasswordHash,
    role: "admin",
  });

  const sarah = userRepo.create({
    email: "sarah.kafiz@galilee.com",
    passwordHash: userPasswordHash,
    role: "student",
  });

  const mouenis = userRepo.create({
    email: "mouenis.amira@galilee.com",
    passwordHash: userPasswordHash,
    role: "student",
  });

  await userRepo.save([admin, sarah, mouenis]);
  console.log(`  ✅ Created ${await userRepo.count()} users`);

  // ================================================================
  // 2. 👤 USER PROFILES (relation 1:1)
  // ================================================================
  console.log("👤 Creating user profiles...");
  
  const adminProfile = profileRepo.create({
    user: admin,
    xp: 5000,
    level: 15,
  });

  const sarahProfile = profileRepo.create({
    user: sarah,
    xp: 500,
    level: 5,
  });

  const mouenisProfile = profileRepo.create({
    user: mouenis,
    xp: 300,
    level: 3,
  });

  await profileRepo.save([adminProfile, sarahProfile, mouenisProfile]);
  console.log(`  ✅ Created ${await profileRepo.count()} profiles`);

  // ================================================================
  // 3. 📋 BOARDS (2 boards)
  // ================================================================
  console.log("📋 Creating boards...");
  
  const board1 = boardRepo.create({
    title: "SAE - Application RESTful",
    owner: admin,
  });

  const board2 = boardRepo.create({
    title: "Projet PWA - Galilée OS",
    owner: sarah,
  });

  await boardRepo.save([board1, board2]);
  console.log(`  ✅ Created ${await boardRepo.count()} boards`);

  // ================================================================
  // 4. 📂 COLUMNS (5 colonnes au total)
  // ================================================================
  console.log("📂 Creating columns...");
  
  // Board 1 columns
  const col1 = columnRepo.create({ title: "To Do", position: 0, board: board1 });
  const col2 = columnRepo.create({ title: "In Progress", position: 1, board: board1 });
  const col3 = columnRepo.create({ title: "Done", position: 2, board: board1 });

  // Board 2 columns
  const col4 = columnRepo.create({ title: "Backlog", position: 0, board: board2 });
  const col5 = columnRepo.create({ title: "Testing", position: 1, board: board2 });

  await columnRepo.save([col1, col2, col3, col4, col5]);
  console.log(`  ✅ Created ${await columnRepo.count()} columns`);

  // ================================================================
  // 5. 🏷️ TAGS (8 tags)
  // ================================================================
  console.log("🏷️  Creating tags...");
  
  const tagBug = tagRepo.create({ name: "bug" });
  const tagUrgent = tagRepo.create({ name: "urgent" });
  const tagBackend = tagRepo.create({ name: "backend" });
  const tagFrontend = tagRepo.create({ name: "frontend" });
  const tagDocker = tagRepo.create({ name: "docker" });
  const tagDB = tagRepo.create({ name: "database" });
  const tagTests = tagRepo.create({ name: "tests" });
  const tagDoc = tagRepo.create({ name: "documentation" });

  await tagRepo.save([tagBug, tagUrgent, tagBackend, tagFrontend, tagDocker, tagDB, tagTests, tagDoc]);
  console.log(`  ✅ Created ${await tagRepo.count()} tags`);

  // ================================================================
  // 6. ✅ TASKS (15 tâches)
  // ================================================================
  console.log("✅ Creating tasks...");
  
  // Board 1 tasks
  const tasks1 = [
    taskRepo.create({ title: "Setup PostgreSQL", description: "Installer et configurer PostgreSQL dans Docker", column: col1, position: 0 }),
    taskRepo.create({ title: "Créer entités TypeORM", description: "User, Board, Task, Column", column: col1, position: 1 }),
    taskRepo.create({ title: "Migrations DB", description: "Générer et exécuter les migrations", column: col2, position: 0 }),
    taskRepo.create({ title: "Script de seed", description: "Peupler la DB avec données de test", column: col2, position: 1 }),
    taskRepo.create({ title: "Tests intégration", description: "Tester les routes avec Vitest", column: col3, position: 0, completed: true }),
    taskRepo.create({ title: "Documentation API", description: "README + collection Postman", column: col3, position: 1, completed: true }),
  ];

  // Board 2 tasks
  const tasks2 = [
    taskRepo.create({ title: "Tableau Kanban drag & drop", description: "Implémenter @dnd-kit", column: col4, position: 0 }),
    taskRepo.create({ title: "Flashcards IA Gemini", description: "Intégration API Gemini 2.5", column: col4, position: 1 }),
    taskRepo.create({ title: "Système gamification", description: "XP, niveaux, badges", column: col4, position: 2 }),
    taskRepo.create({ title: "Focus Timer Pomodoro", description: "Timer + sons ambiants", column: col5, position: 0 }),
    taskRepo.create({ title: "Thèmes Galilée/Pro", description: "Toggle theme avec animations", column: col5, position: 1 }),
    taskRepo.create({ title: "PWA offline", description: "Service Worker + IndexedDB", column: col5, position: 2 }),
    taskRepo.create({ title: "Tests E2E Playwright", description: "Scénarios utilisateur complets", column: col5, position: 3 }),
    taskRepo.create({ title: "CI/CD GitHub Actions", description: "Pipeline automatisé", column: col5, position: 4 }),
    taskRepo.create({ title: "Déploiement Netlify", description: "Prod sur galilee-os.netlify.app", column: col5, position: 5 }),
  ];

  await taskRepo.save([...tasks1, ...tasks2]);
  console.log(`  ✅ Created ${await taskRepo.count()} tasks`);

  // ================================================================
  // 7. 🤝 BOARD MEMBERS (relation N:M User ↔ Board)
  // ================================================================
  console.log("🤝 Creating board members (Many-to-Many User-Board)...");
  
  const members = [
    boardMemberRepo.create({ user: admin, board: board1, role: "owner" }),
    boardMemberRepo.create({ user: sarah, board: board1, role: "member" }),
    boardMemberRepo.create({ user: sarah, board: board2, role: "owner" }),
    boardMemberRepo.create({ user: mouenis, board: board2, role: "member" }),
    boardMemberRepo.create({ user: admin, board: board2, role: "member" }),
  ];

  await boardMemberRepo.save(members);
  console.log(`  ✅ Created ${await boardMemberRepo.count()} board memberships`);

  // ================================================================
  // 8. 🏷️ TASK TAGS (relation N:M Task ↔ Tag)
  // ================================================================
  console.log("🏷️  Assigning tags to tasks (Many-to-Many Task-Tag)...");
  
  const taskTags = [
    // Board 1 tasks
    taskTagRepo.create({ task: tasks1[0], tag: tagDB }),
    taskTagRepo.create({ task: tasks1[0], tag: tagDocker }),
    taskTagRepo.create({ task: tasks1[1], tag: tagBackend }),
    taskTagRepo.create({ task: tasks1[2], tag: tagDB }),
    taskTagRepo.create({ task: tasks1[2], tag: tagUrgent }),
    taskTagRepo.create({ task: tasks1[3], tag: tagBackend }),
    taskTagRepo.create({ task: tasks1[4], tag: tagTests }),
    taskTagRepo.create({ task: tasks1[5], tag: tagDoc }),

    // Board 2 tasks
    taskTagRepo.create({ task: tasks2[0], tag: tagFrontend }),
    taskTagRepo.create({ task: tasks2[1], tag: tagFrontend }),
    taskTagRepo.create({ task: tasks2[1], tag: tagBackend }),
    taskTagRepo.create({ task: tasks2[2], tag: tagFrontend }),
    taskTagRepo.create({ task: tasks2[3], tag: tagFrontend }),
    taskTagRepo.create({ task: tasks2[5], tag: tagFrontend }),
    taskTagRepo.create({ task: tasks2[5], tag: tagUrgent }),
    taskTagRepo.create({ task: tasks2[6], tag: tagTests }),
    taskTagRepo.create({ task: tasks2[7], tag: tagDocker }),
    taskTagRepo.create({ task: tasks2[8], tag: tagDoc }),
    taskTagRepo.create({ task: tasks2[8], tag: tagUrgent }),
    taskTagRepo.create({ task: tasks2[4], tag: tagBug }),
  ];

  await taskTagRepo.save(taskTags);
  console.log(`  ✅ Created ${await taskTagRepo.count()} task-tag associations`);

  // ================================================================
  // 9. 📊 SUMMARY
  // ================================================================
  console.log("\n📊 Seed Summary:");
  console.log("═══════════════════════════════════════");
  console.log(`  👥 Users:           ${await userRepo.count()}`);
  console.log(`  👤 Profiles:        ${await profileRepo.count()}`);
  console.log(`  📋 Boards:          ${await boardRepo.count()}`);
  console.log(`  📂 Columns:         ${await columnRepo.count()}`);
  console.log(`  ✅ Tasks:           ${await taskRepo.count()}`);
  console.log(`  🏷️  Tags:            ${await tagRepo.count()}`);
  console.log(`  🤝 Board Members:   ${await boardMemberRepo.count()}`);
  console.log(`  🏷️  Task Tags:       ${await taskTagRepo.count()}`);
  console.log("═══════════════════════════════════════");
  console.log("\n✅ Database seeded successfully!\n");
  
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
