# 🖥️ COMMANDES LOCALES - GALILEE OS

Guide complet des commandes pour développer en local.

---

## 📋 TABLE DES MATIÈRES

1. [Installation Initiale](#1-installation-initiale)
2. [Docker & Docker Compose](#2-docker--docker-compose)
3. [Backend (sans Docker)](#3-backend-sans-docker)
4. [Frontend (sans Docker)](#4-frontend-sans-docker)
5. [Base de Données](#5-base-de-données)
6. [Tests](#6-tests)
7. [Linting & Formatage](#7-linting--formatage)
8. [Git & GitHub](#8-git--github)
9. [Scripts Utilitaires](#9-scripts-utilitaires)
10. [Debugging & Monitoring](#10-debugging--monitoring)
11. [Troubleshooting](#11-troubleshooting)

---

## 1. INSTALLATION INITIALE

### 1.1 Cloner le Projet

```bash
# Cloner le repository
git clone https://github.com/KESHRUD/Galilee-OS.git

# Entrer dans le dossier
cd Galilee-OS

# Vérifier les branches disponibles
git branch -a
```

### 1.2 Configuration Git

```bash
# Configurer votre identité
git config user.name "Votre Nom"
git config user.email "votre.email@galilee.com"

# Vérifier la configuration
git config --list
```

### 1.3 Installer les Dépendances

```bash
# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
cd ..
```

### 1.4 Créer les Fichiers .env

```bash
# Backend - Copier le template
cd backend
cp .env.example .env

# Éditer avec vos valeurs
nano .env  # ou code .env

# Frontend - Copier le template
cd ../frontend
cp .env.example .env

# Éditer avec vos valeurs
nano .env  # ou code .env
```

**Contenu minimal `.env` backend :**

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/galilee_os

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key

# Server
PORT=3000
NODE_ENV=development
```

**Contenu minimal `.env` frontend :**

```env
# API
VITE_API_URL=http://localhost:3000

# Gemini AI (optionnel)
VITE_GEMINI_API_KEY=your-gemini-api-key
```

---

## 2. DOCKER & DOCKER COMPOSE

### 2.1 Lancer Tout le Projet (Recommandé)

```bash
# Build et démarrer tous les services (backend + frontend + postgres)
docker-compose up --build

# En mode détaché (arrière-plan)
docker-compose up -d

# Voir les logs en temps réel
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### 2.2 Arrêter les Services

```bash
# Arrêter proprement (garde les données)
docker-compose down

# Arrêter et supprimer les volumes (⚠️ perte de données)
docker-compose down -v

# Arrêter et supprimer les images
docker-compose down --rmi all
```

### 2.3 Reconstruire les Images

```bash
# Rebuild complet sans cache
docker-compose build --no-cache

# Rebuild un service spécifique
docker-compose build backend
docker-compose build frontend

# Rebuild et redémarrer
docker-compose up --build -d
```

### 2.4 Exécuter des Commandes dans les Conteneurs

```bash
# Backend - Entrer dans le conteneur
docker-compose exec backend sh

# Frontend - Entrer dans le conteneur
docker-compose exec frontend sh

# PostgreSQL - Accéder à psql
docker-compose exec postgres psql -U postgres -d galilee_os

# Backend - Lancer les migrations
docker-compose exec backend npm run migration:run

# Backend - Seed la base de données
docker-compose exec backend npm run seed
```

### 2.5 Vérifier l'État des Services

```bash
# Liste des conteneurs actifs
docker-compose ps

# Vérifier les ressources utilisées
docker stats

# Inspecter un conteneur
docker-compose logs backend

# Health check
curl http://localhost:3000/api/health
curl http://localhost
```

### 2.6 Nettoyer Docker

```bash
# Supprimer tous les conteneurs arrêtés
docker container prune

# Supprimer toutes les images non utilisées
docker image prune -a

# Supprimer tous les volumes non utilisés
docker volume prune

# Nettoyage complet (⚠️ attention)
docker system prune -a --volumes
```

---

## 3. BACKEND (SANS DOCKER)

### 3.1 Prérequis

```bash
# Installer PostgreSQL localement
# Ubuntu/Debian:
sudo apt install postgresql postgresql-contrib

# macOS (Homebrew):
brew install postgresql

# Windows: Télécharger depuis https://www.postgresql.org/download/windows/

# Créer la base de données
psql -U postgres
CREATE DATABASE galilee_os;
\q
```

### 3.2 Développement

```bash
cd backend

# Lancer en mode développement (hot reload)
npm run dev

# Lancer en mode production
npm run build
npm start

# Lancer avec nodemon (redémarrage auto)
npm run dev
```

### 3.3 Migrations de Base de Données

```bash
cd backend

# Générer une nouvelle migration
npm run migration:generate -- -n NomDeLaMigration

# Lancer les migrations
npm run migration:run

# Annuler la dernière migration
npm run migration:revert

# Voir le statut des migrations
npm run migration:show
```

### 3.4 Seed (Données de Test)

```bash
cd backend

# Insérer des données de test
npm run seed

# Réinitialiser la DB (drop + migrations + seed)
npm run db:reset
```

---

## 4. FRONTEND (SANS DOCKER)

### 4.1 Développement

```bash
cd frontend

# Lancer le serveur de développement (Vite)
npm run dev

# Ouvrir automatiquement dans le navigateur
npm run dev -- --open

# Spécifier un port différent
npm run dev -- --port 5173

# Lancer sur le réseau local (accessible depuis autres devices)
npm run dev -- --host
```

### 4.2 Build de Production

```bash
cd frontend

# Build pour production
npm run build

# Prévisualiser le build de production
npm run preview

# Build et preview
npm run build && npm run preview
```

### 4.3 PWA & Service Worker

```bash
cd frontend

# Vérifier que le SW est généré
ls -la public/sw.js

# Tester le SW en local (nécessite HTTPS ou localhost)
npm run dev
# Ouvrir DevTools → Application → Service Workers
```

---

## 5. BASE DE DONNÉES

### 5.1 Accéder à PostgreSQL

```bash
# Via Docker
docker-compose exec postgres psql -U postgres -d galilee_os

# Local (sans Docker)
psql -U postgres -d galilee_os

# Avec mot de passe
psql -U postgres -h localhost -d galilee_os
```

### 5.2 Commandes SQL Utiles

```sql
-- Lister les tables
\dt

-- Décrire une table
\d users

-- Voir les données d'une table
SELECT * FROM users;

-- Compter les enregistrements
SELECT COUNT(*) FROM tasks;

-- Voir toutes les bases de données
\l

-- Quitter psql
\q
```

### 5.3 Backup & Restore

```bash
# Backup de la base de données
docker-compose exec postgres pg_dump -U postgres galilee_os > backup.sql

# Ou avec le script
./scripts/backup.sh

# Restore
docker-compose exec -T postgres psql -U postgres galilee_os < backup.sql

# Backup uniquement le schéma
docker-compose exec postgres pg_dump -U postgres --schema-only galilee_os > schema.sql

# Backup uniquement les données
docker-compose exec postgres pg_dump -U postgres --data-only galilee_os > data.sql
```

### 5.4 Réinitialiser la Base de Données

```bash
# Méthode 1 : Via Docker
docker-compose down -v
docker-compose up -d postgres
docker-compose exec backend npm run migration:run
docker-compose exec backend npm run seed

# Méthode 2 : Manuellement
psql -U postgres
DROP DATABASE galilee_os;
CREATE DATABASE galilee_os;
\q

cd backend
npm run migration:run
npm run seed
```

---

## 6. TESTS

### 6.1 Backend Tests

```bash
cd backend

# Lancer tous les tests
npm test

# Tests avec coverage
npm run test:coverage

# Tests en mode watch (re-run auto)
npm run test:watch

# Tester un fichier spécifique
npm test -- auth.test.ts

# Tests unitaires uniquement
npm run test:unit

# Tests d'intégration
npm run test:integration
```

### 6.2 Frontend Tests

```bash
cd frontend

# Tests unitaires (Vitest)
npm test

# Tests avec coverage
npm run test:coverage

# Tests en mode UI (interface graphique)
npm run test:ui

# Tests E2E (Playwright)
npx playwright test

# Tests E2E en mode interactif
npx playwright test --ui

# Tests E2E sur un navigateur spécifique
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Générer le rapport des tests E2E
npx playwright show-report
```

### 6.3 Tests Complets

```bash
# Tester backend + frontend
cd backend && npm test && cd ../frontend && npm test

# Ou avec un script
npm run test:all  # (si configuré dans package.json racine)
```

---

## 7. LINTING & FORMATAGE

### 7.1 ESLint

```bash
# Backend
cd backend
npm run lint               # Vérifier les erreurs
npm run lint:fix           # Corriger automatiquement

# Frontend
cd frontend
npm run lint               # Vérifier les erreurs
npm run lint:fix           # Corriger automatiquement
```

### 7.2 Prettier (si configuré)

```bash
# Formater tous les fichiers
npx prettier --write .

# Vérifier le formatage
npx prettier --check .

# Formater uniquement backend
npx prettier --write "backend/**/*.ts"

# Formater uniquement frontend
npx prettier --write "frontend/**/*.{ts,tsx}"
```

### 7.3 TypeScript

```bash
# Backend - Vérifier les types
cd backend
npx tsc --noEmit

# Frontend - Vérifier les types
cd frontend
npx tsc --noEmit

# Build TypeScript
cd backend
npm run build
```

---

## 8. GIT & GITHUB

### 8.1 Workflow de Développement

```bash
# 1. Se mettre sur develop
git checkout develop
git pull origin develop

# 2. Créer une branche feature
git checkout -b feature/ma-nouvelle-feature

# 3. Développer et commiter régulièrement
git add .
git commit -m "feat: ajouter nouvelle fonctionnalité"

# 4. Pousser la branche
git push -u origin feature/ma-nouvelle-feature

# 5. Créer une Pull Request sur GitHub
# Aller sur https://github.com/KESHRUD/Galilee-OS/pulls
```

### 8.2 Commandes Git Courantes

```bash
# Voir le statut
git status

# Voir les différences
git diff
git diff --staged

# Historique des commits
git log --oneline
git log --graph --oneline --all

# Annuler des modifications
git restore <fichier>              # Fichier non stagé
git restore --staged <fichier>     # Fichier stagé
git reset HEAD~1                   # Annuler dernier commit (garde modifs)
git reset --hard HEAD~1            # Annuler dernier commit (⚠️ perd modifs)

# Stash (mettre de côté)
git stash                          # Sauvegarder temporairement
git stash list                     # Voir les stash
git stash pop                      # Récupérer le dernier stash
git stash drop                     # Supprimer le dernier stash

# Branches
git branch                         # Liste locales
git branch -a                      # Liste toutes (locales + remote)
git branch -d feature/ma-branch    # Supprimer locale
git push origin --delete feature/ma-branch  # Supprimer remote

# Merge
git checkout develop
git merge feature/ma-branch

# Rebase (à utiliser avec prudence)
git rebase develop
```

### 8.3 Tags & Releases

```bash
# Créer un tag
git tag -a v1.0.0 -m "Release v1.0.0"

# Pousser le tag
git push origin v1.0.0

# Pousser tous les tags
git push --tags

# Lister les tags
git tag -l

# Supprimer un tag local
git tag -d v1.0.0

# Supprimer un tag remote
git push origin --delete v1.0.0
```

### 8.4 GitHub Actions (CI/CD)

```bash
# Voir les workflows en ligne de commande (si gh installé)
gh workflow list
gh workflow view ci.yml
gh run list
gh run view <run-id>

# Re-run un workflow
gh run rerun <run-id>

# Voir les logs d'un job
gh run view <run-id> --log
```

---

## 9. SCRIPTS UTILITAIRES

### 9.1 Scripts Docker

```bash
# Build des images
./scripts/docker-build.sh

# Push vers Docker Hub
./scripts/docker-push.sh 1.0.0

# Test de build local
./scripts/test-docker-build.sh

# Health check des services
./scripts/health-check.sh
```

### 9.2 Scripts de Déploiement

```bash
# Déploiement complet
./scripts/deploy.sh production

# Backup de la base de données
./scripts/backup.sh

# Restore d'un backup
./scripts/restore.sh backup.sql
```

### 9.3 Rendre les Scripts Exécutables

```bash
# Si les scripts ne s'exécutent pas
chmod +x scripts/*.sh

# Vérifier les permissions
ls -la scripts/
```

---

## 10. DEBUGGING & MONITORING

### 10.1 Logs en Temps Réel

```bash
# Docker Compose logs
docker-compose logs -f --tail=100

# Logs backend uniquement
docker-compose logs -f backend

# Logs avec timestamps
docker-compose logs -f -t

# Logs depuis un certain temps
docker-compose logs --since 30m
```

### 10.2 Debugging Backend (Node.js)

```bash
# Lancer avec debugger
cd backend
node --inspect src/index.ts

# Avec nodemon
npm run dev:debug

# Attacher Chrome DevTools
# Ouvrir chrome://inspect dans Chrome
```

### 10.3 Monitoring des Ressources

```bash
# Ressources Docker
docker stats

# Ressources système
htop  # ou top
df -h  # Espace disque
free -h  # Mémoire

# Connexions PostgreSQL
docker-compose exec postgres psql -U postgres -d galilee_os -c "SELECT * FROM pg_stat_activity;"
```

### 10.4 Health Checks

```bash
# Backend API
curl http://localhost:3000/api/health

# Frontend
curl http://localhost

# PostgreSQL
docker-compose exec postgres pg_isready -U postgres

# Tous les services
./scripts/health-check.sh
```

---

## 11. TROUBLESHOOTING

### 11.1 Port Déjà Utilisé

```bash
# Voir quel processus utilise le port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Tuer le processus
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Ou changer le port dans .env
PORT=3001
```

### 11.2 Docker Issues

```bash
# Restart Docker Desktop
# macOS/Windows: Redémarrer l'application

# Problème de réseau Docker
docker network prune

# Problème de cache
docker-compose build --no-cache

# Volumes corrompus
docker-compose down -v
docker volume prune
```

### 11.3 Base de Données

```bash
# Erreur de connexion
# Vérifier que PostgreSQL tourne
docker-compose ps postgres

# Vérifier DATABASE_URL dans .env
echo $DATABASE_URL

# Reset complet de la DB
docker-compose down -v
docker-compose up -d postgres
sleep 5
docker-compose exec backend npm run migration:run
```

### 11.4 Node Modules

```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install

# Nettoyer le cache npm
npm cache clean --force
npm install

# Problème de version Node
nvm use 20  # ou la version requise
node --version
```

### 11.5 Vite / Frontend

```bash
# Nettoyer le cache Vite
rm -rf frontend/.vite
rm -rf frontend/node_modules/.vite

# Erreur de build
cd frontend
rm -rf dist
npm run build

# CORS errors
# Vérifier VITE_API_URL dans .env
# Vérifier que le backend accepte les CORS
```

---

## 📋 CHECKLIST DÉMARRAGE RAPIDE

### Pour démarrer en 5 minutes :

```bash
# 1. Cloner le projet
git clone https://github.com/KESHRUD/Galilee-OS.git
cd Galilee-OS

# 2. Configurer les .env (backend + frontend)
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Lancer avec Docker (recommandé)
docker-compose up -d

# 4. Attendre 30 secondes, puis vérifier
curl http://localhost:3000/api/health
curl http://localhost

# 5. Accéder à l'app
# Frontend: http://localhost
# Backend API: http://localhost:3000
# PostgreSQL: localhost:5432
```

### Sans Docker (développement natif) :

```bash
# 1. Installer PostgreSQL
# Suivre les instructions de votre OS

# 2. Créer la base de données
psql -U postgres
CREATE DATABASE galilee_os;
\q

# 3. Installer les dépendances
cd backend && npm install
cd ../frontend && npm install

# 4. Configurer les .env
# Éditer backend/.env et frontend/.env

# 5. Lancer les migrations
cd backend
npm run migration:run
npm run seed

# 6. Lancer backend et frontend (2 terminaux)
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
cd frontend && npm run dev
```

---

## 🔗 URLS IMPORTANTES

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost | Application React PWA |
| **Backend API** | http://localhost:3000 | Express API REST |
| **API Health** | http://localhost:3000/api/health | Vérifier que l'API fonctionne |
| **PostgreSQL** | localhost:5432 | Base de données |
| **Swagger** | http://localhost:3000/api-docs | Documentation API (si configuré) |
| **GitHub Actions** | https://github.com/KESHRUD/Galilee-OS/actions | CI/CD workflows |
| **Docker Hub** | https://hub.docker.com/r/mouenis/galilee-os-backend | Images Docker |

---

## 📚 RESSOURCES ADDITIONNELLES

### Documentation Projet

- `README.md` : Vue d'ensemble du projet
- `docs/DEPLOYMENT.md` : Guide de déploiement
- `docs/DOCKER.md` : Architecture Docker détaillée
- `.env.example` : Template des variables d'environnement

### Documentation Externe

- **TypeORM** : https://typeorm.io
- **Express** : https://expressjs.com
- **React** : https://react.dev
- **Vite** : https://vitejs.dev
- **Docker** : https://docs.docker.com
- **PostgreSQL** : https://www.postgresql.org/docs

---

## 🆘 AIDE & SUPPORT

### En cas de problème :

1. **Vérifier les logs** : `docker-compose logs -f`
2. **Vérifier les issues GitHub** : https://github.com/KESHRUD/Galilee-OS/issues
3. **Relire cette documentation** 📖
4. **Demander à l'équipe** (Amine, Sarah, Mouenis)

---

**Dernière mise à jour :** 30 janvier 2026  
**Version :** 1.0.0
