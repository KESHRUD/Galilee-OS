# 🎓 SOUTENANCE SAE - GALILEE OS
## Développement & Déploiement d'une Application Web RESTful Conteneurisée

**Équipe :**
- 👨‍💼 **BENHAMMADA Ahmed Amine** - Scrum Master & DevOps
- 👩‍💻 **KAFIZ Sarah** - Full Stack Developer
- 👨‍💻 **AMIRA Mouenis** - DevOps & Docker Specialist

**Projet :** Galilee OS - Système de Productivité Étudiant  
**Durée :** 15 minutes + 5 minutes de questions  
**Date :** [À compléter]  
**Repository :** https://github.com/KESHRUD/Galilee-OS


---

## 📊 TIMING DE LA PRÉSENTATION (15 minutes)

| Section | Responsable | Durée | Contenu |
|---------|-------------|-------|---------|
| **1. Intro & Démo Live** | Sarah | 3 min | Contexte + démo application |
| **2. Architecture & ORM** | Sarah | 2 min | Schéma + 3 types de relations |
| **3. API REST** | Amine | 4 min | Démo API avec DevTools |
| **4. DevOps & CI/CD** | Amine | 3 min | GitHub Actions, secrets, pipelines |
| **5. Docker** | Mouenis | 3 min | Conteneurisation, optimisations, Docker Hub |
| **Questions** | Tous | 5 min | Réponses aux questions |

---

# 📝 PLAN DÉTAILLÉ PAR INTERVENANT

---

## 🎤 PARTIE 1 : INTRO & DÉMO LIVE (Sarah - 3 min)

### 1.1 Introduction (30 secondes)

**Script :**

> "Bonjour, nous sommes l'équipe Galilee OS. Je suis Sarah, accompagnée d'Amine et Mouenis.
>
> Nous allons vous présenter **Galilee OS**, une Progressive Web Application complète pour la productivité étudiante, développée dans le cadre de la SAE DDAW."

---

### 1.2 Contexte du Projet (1 minute)

**Slide 1 : Problématique**

```
┌─────────────────────────────────────────────┐
│     PROBLÈMES DES ÉTUDIANTS EN ING2         │
├─────────────────────────────────────────────┤
│ ❌ Gestion chaotique de multiples projets   │
│ ❌ Révisions stressantes avant examens      │
│ ❌ Perte de motivation et procrastination   │
│ ❌ Difficulté à se concentrer (focus)       │
│ ❌ Besoin de travailler hors connexion      │
└─────────────────────────────────────────────┘
```

**Script :**

> "Comme tous les étudiants en ingénierie, nous jonglons avec de nombreux projets, des révisions, et la difficulté à rester concentré.
>
> Galilee OS répond à ces problèmes en offrant un système tout-en-un : gestion de projets, révisions IA, gamification pour la motivation, et mode hors-ligne."

---

**Slide 2 : Solution Galilee OS**

```
┌─────────────────────────────────────────────┐
│         GALILEE OS - LA SOLUTION            │
├─────────────────────────────────────────────┤
│ ✅ Tableau Kanban avec drag & drop          │
│ ✅ Flashcards générées par IA (Gemini)      │
│ ✅ Gamification : XP, niveaux, rangs        │
│ ✅ Focus Timer Pomodoro avec sons           │
│ ✅ PWA installable fonctionnant offline     │
│ ✅ Backend REST avec PostgreSQL             │
└─────────────────────────────────────────────┘
```

---

### 1.3 Démo Live de l'Application (1 min 30)

**🌐 Ouvrir l'app en production :** https://galilee-os.netlify.app

**Parcours de démo :**

#### Étape 1 : Landing Page (10 secondes)
> "Voici la landing page de Galilee OS. Elle présente les fonctionnalités principales et permet de s'inscrire ou se connecter."

**Actions :**
- Scroller rapidement la landing page
- Montrer les sections : Kanban, Flashcards, Gamification, Focus

---

#### Étape 2 : Connexion (10 secondes)
> "Je vais me connecter avec un compte de test."

**Credentials à utiliser :**
```
Email: demo@galilee.com
Password: Demo1234!
```

**Actions :**
- Cliquer sur "Connexion"
- Entrer les identifiants
- Se connecter

---

#### Étape 3 : Dashboard Kanban (30 secondes)
> "Nous arrivons sur le tableau Kanban. Je peux créer des colonnes, des tâches, et les déplacer par drag & drop."

**Actions :**
1. Montrer les colonnes existantes (To Do, In Progress, Done)
2. **Drag & drop une tâche** d'une colonne à l'autre
3. Cliquer sur une tâche pour ouvrir le modal d'édition
4. Montrer : priorités, sous-tâches, tags, commentaires

---

#### Étape 4 : Gamification HUD (10 secondes)
> "En haut à droite, le système de gamification affiche mon niveau, mon XP, et mon rang actuel."

**Actions :**
- Pointer le HUD (niveau, barre XP, badge rang)
- Mentionner : "Je gagne de l'XP en complétant des tâches"

---

#### Étape 5 : Flashcards IA (15 secondes)
> "Le module Flashcards utilise l'API Gemini AI pour générer automatiquement des cartes de révision."

**Actions :**
1. Cliquer sur l'icône Flashcards (dans la sidebar ou cmd+K → F)
2. Montrer un deck existant
3. Lancer une session de révision (flip 1-2 cartes)

---

#### Étape 6 : Focus Timer (10 secondes)
> "Le Focus Timer Pomodoro aide à rester concentré avec des sessions de 25 minutes."

**Actions :**
1. Ouvrir le Timer (cmd+K → T)
2. Montrer : durée personnalisable, sons ambiants, statistiques

---

#### Étape 7 : Mode Offline (5 secondes)
> "L'application fonctionne entièrement hors-ligne grâce au Service Worker et IndexedDB."

**Actions :**
- Ouvrir DevTools (F12)
- Onglet Network → Cocher "Offline"
- Créer une tâche → fonctionne !
- Rétablir la connexion

---

**Transition vers Architecture :**

> "Maintenant que vous avez vu l'application en action, voyons comment elle est architecturée techniquement."

---

## 🏗️ PARTIE 2 : ARCHITECTURE & ORM (Sarah - 2 min)

### 2.1 Stack Technologique (30 secondes)

**Slide 3 : Architecture Globale**

```
┌───────────────────────────────────────────────────────┐
│                   GALILEE OS                          │
│              Architecture 3-Tiers                     │
└───────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  FRONTEND (PWA)                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │  React 19 + TypeScript + Vite                   │   │
│  │  - Kanban (Drag & Drop avec @dnd-kit)           │   │
│  │  - Flashcards IA (Gemini API)                   │   │
│  │  │  - Gamification (XP/Niveaux)                  │   │
│  │  - Focus Timer Pomodoro                         │   │
│  │  - Service Worker (Workbox) + IndexedDB         │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          ⬇ HTTP/HTTPS
┌─────────────────────────────────────────────────────────┐
│  BACKEND (API REST)                                     │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Node.js + Express + TypeScript                  │   │
│  │  - Routes REST : /api/auth, /boards, /tasks     │   │
│  │  - Controllers & Services                        │   │
│  │  - TypeORM (ORM)                                 │   │
│  │  - JWT Authentication                            │   │
│  │  - Bcrypt (hashing passwords)                    │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          ⬇ PostgreSQL Protocol
┌─────────────────────────────────────────────────────────┐
│  BASE DE DONNÉES                                        │
│  ┌──────────────────────────────────────────────────┐   │
│  │  PostgreSQL 15                                   │   │
│  │  - 8 tables relationnelles                      │   │
│  │  - Migrations TypeORM                           │   │
│  │  - Volumes Docker persistants                   │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Script :**

> "Galilee OS suit une architecture 3-tiers classique :
> 
> - **Frontend** : PWA React avec offline-first
> - **Backend** : API REST Express avec TypeScript
> - **Base de données** : PostgreSQL 15
>
> Tout communique via HTTP/HTTPS et le protocole PostgreSQL."

---

### 2.2 Modèle ORM - TypeORM (1 min 30)

**Slide 4 : Les 3 Types de Relations (REQUIS PAR LE PROF)**

```
┌──────────────────────────────────────────────────────────┐
│       RELATIONS ORM - TypeORM (8 Entités)                │
└──────────────────────────────────────────────────────────┘

1️⃣ ONE-TO-ONE : User ↔ UserProfile
┌─────────────┐         ┌─────────────────┐
│    User     │◄───1:1──┤  UserProfile    │
│ - id        │         │ - id            │
│ - email     │         │ - xp            │
│ - password  │         │ - level         │
│ - role      │         │ - user_id (FK)  │
└─────────────┘         └─────────────────┘

2️⃣ ONE-TO-MANY : Board → Column → Task
┌─────────────┐
│    Board    │  1 Board → N Columns
│ - id        │
│ - title     │
│ - owner_id  │
└──────┬──────┘
       │ 1:N
┌──────▼──────┐
│   Column    │  1 Column → N Tasks
│ - id        │
│ - title     │
│ - board_id  │
└──────┬──────┘
       │ 1:N
┌──────▼──────┐
│    Task     │
│ - id        │
│ - title     │
│ - column_id │
│ - completed │
└─────────────┘

3️⃣ MANY-TO-MANY : Task ↔ Tag (via TaskTag)
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│    Task     │◄──N:M─┤   TaskTag    │─N:M──►│     Tag     │
│ - id        │       │ - task_id    │       │ - id        │
│ - title     │       │ - tag_id     │       │ - name      │
└─────────────┘       └──────────────┘       └─────────────┘
                      (Table pivot)

3️⃣ bis MANY-TO-MANY : User ↔ Board (via BoardMember)
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│    User     │◄──N:M─┤ BoardMember  │─N:M──►│    Board    │
│ - id        │       │ - user_id    │       │ - id        │
│ - email     │       │ - board_id   │       │ - title     │
└─────────────┘       │ - role       │       └─────────────┘
                      └──────────────┘
```

**Script :**

> "Notre modèle ORM respecte les 3 types de relations demandés :
>
> **1. ONE-TO-ONE** : Un User a un seul UserProfile pour stocker son XP et niveau. C'est implémenté avec `@OneToOne` et `@JoinColumn` dans TypeORM.
>
> **2. ONE-TO-MANY** : Un Board contient plusieurs Columns, et une Column contient plusieurs Tasks. C'est une cascade de relations parent-enfant avec `@ManyToOne` et `@OneToMany`.
>
> **3. MANY-TO-MANY** : Une Task peut avoir plusieurs Tags, et un Tag peut être sur plusieurs Tasks. On utilise une table pivot `TaskTag` avec des `@ManyToOne` des deux côtés.
>
> Pareil pour User ↔ Board via BoardMember : un utilisateur peut être membre de plusieurs boards, et un board peut avoir plusieurs membres."

---

**Transition vers API :**

> "Maintenant qu'on a vu l'architecture, Amine va vous démontrer l'API REST et le DevOps."

---

## 🔌 PARTIE 3 : DÉMO API REST (Amine - 4 min)

### 3.1 Introduction API (15 secondes)

**Script :**

> "Je vais maintenant vous montrer notre API REST en action. Elle expose 20 routes conformes aux standards HTTP avec GET, POST, PUT/PATCH, DELETE.
>
> Je vais utiliser les DevTools du navigateur pour tester l'API en direct."

---

### 3.2 Démonstration avec DevTools (3 min 45)

**🌐 Ouvrir :** https://galilee-os.netlify.app  
**Ouvrir DevTools :** F12 → Onglet Console

---

#### Test 1 : Register (30 secondes)

**Script :**

> "Commençons par créer un nouvel utilisateur avec l'endpoint POST /api/auth/register."

**Dans la Console DevTools :**

```javascript
// Register a new user
fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'soutenance@galilee.com',
    password: 'SoutenanceSAE2025!'
  })
})
.then(res => res.json())
.then(data => {
  console.log('✅ User registered:', data);
  window.token = data.accessToken; // Sauvegarder le token
});
```

**Montrer la réponse :**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid-123...",
    "email": "soutenance@galilee.com",
    "role": "student"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Script :**
> "L'utilisateur est créé avec succès. On reçoit un JWT token qu'on va utiliser pour les requêtes authentifiées."

---

#### Test 2 : Login (30 secondes)

**Script :**

> "Testons maintenant la connexion avec POST /api/auth/login."

```javascript
// Login
fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'soutenance@galilee.com',
    password: 'SoutenanceSAE2025!'
  })
})
.then(res => res.json())
.then(data => {
  console.log('✅ Login successful:', data);
  window.token = data.accessToken; // Mettre à jour le token
});
```

---

#### Test 3 : Create Board (30 secondes)

**Script :**

> "Créons un board avec POST /api/boards, en utilisant le token dans le header Authorization."

```javascript
// Create a board
fetch('http://localhost:3000/api/boards', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${window.token}`
  },
  body: JSON.stringify({
    title: 'SAE DDAW - Soutenance'
  })
})
.then(res => res.json())
.then(data => {
  console.log('✅ Board created:', data);
  window.boardId = data.id; // Sauvegarder l'ID
});
```

**Réponse attendue :**
```json
{
  "id": "board-uuid-456",
  "title": "SAE DDAW - Soutenance",
  "ownerId": "uuid-123",
  "createdAt": "2025-01-23T..."
}
```

---

#### Test 4 : Get All Boards (20 secondes)

**Script :**

> "Récupérons tous nos boards avec GET /api/boards."

```javascript
// Get all boards
fetch('http://localhost:3000/api/boards', {
  headers: {
    'Authorization': `Bearer ${window.token}`
  }
})
.then(res => res.json())
.then(data => console.log('✅ All boards:', data));
```

---

#### Test 5 : Create Column (30 secondes)

**Script :**

> "Ajoutons une colonne 'To Do' au board avec POST /api/boards/:id/columns."

```javascript
// Create a column
fetch(`http://localhost:3000/api/boards/${window.boardId}/columns`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${window.token}`
  },
  body: JSON.stringify({
    title: 'To Do',
    position: 0
  })
})
.then(res => res.json())
.then(data => {
  console.log('✅ Column created:', data);
  window.columnId = data.id;
});
```

---

#### Test 6 : Create Task (30 secondes)

**Script :**

> "Créons une tâche dans la colonne avec POST /api/columns/:id/tasks."

```javascript
// Create a task
fetch(`http://localhost:3000/api/columns/${window.columnId}/tasks`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${window.token}`
  },
  body: JSON.stringify({
    title: 'Préparer la démo API',
    description: 'Tester tous les endpoints REST',
    position: 0
  })
})
.then(res => res.json())
.then(data => {
  console.log('✅ Task created:', data);
  window.taskId = data.id;
});
```

---

#### Test 7 : Update Task (PATCH) (20 secondes)

**Script :**

> "Marquons la tâche comme complétée avec PATCH /api/tasks/:id."

```javascript
// Mark task as completed
fetch(`http://localhost:3000/api/tasks/${window.taskId}`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${window.token}`
  },
  body: JSON.stringify({
    completed: true
  })
})
.then(res => res.json())
.then(data => console.log('✅ Task updated:', data));
```

---

#### Test 8 : Gestion d'Erreurs (15 secondes)

**Script :**

> "Testons la gestion d'erreurs : que se passe-t-il sans token ?"

```javascript
// Test error: No token
fetch('http://localhost:3000/api/boards', {
  headers: { 'Authorization': 'Bearer invalid-token' }
})
.then(res => res.json())
.then(data => console.log('❌ Error:', data));
```

**Réponse attendue :**
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token",
  "statusCode": 401
}
```

**Script :**
> "L'API retourne une erreur 401 avec un message clair. Toutes nos erreurs suivent ce format standard."

---

### 3.3 Résumé API (15 secondes)

**Script :**

> "Voilà ! Nous avons testé 8 endpoints couvrant toutes les opérations CRUD :
> - **POST** : Register, Login, Create Board/Column/Task
> - **GET** : Read Boards
> - **PATCH** : Update Task
> - **DELETE** : (disponible mais pas montré par manque de temps)
>
> L'API est entièrement conforme aux standards REST avec gestion d'erreurs robuste."

---

**Transition vers DevOps :**

> "Maintenant, je vais vous montrer comment nous avons automatisé le déploiement avec DevOps."

---

## 🚀 PARTIE 4 : DEVOPS & CI/CD (Amine - 3 min)

### 4.1 Présentation DevOps (30 secondes)

**Slide 5 : Pipeline CI/CD**

```
┌────────────────────────────────────────────────────────┐
│         PIPELINE CI/CD - GITHUB ACTIONS                │
└────────────────────────────────────────────────────────┘

    git push origin main
           │
           ▼
    ┌──────────────┐
    │  GitHub      │
    │  Actions     │
    └──────┬───────┘
           │
    ┌──────▼───────────────────────────┐
    │   WORKFLOW 1: CI (Tests)         │
    │   ✅ npm run lint                │
    │   ✅ npm run test                │
    │   ✅ npm run build               │
    └──────┬───────────────────────────┘
           │
    ┌──────▼───────────────────────────┐
    │   WORKFLOW 2: Docker Build       │
    │   ✅ Build backend image         │
    │   ✅ Build frontend image        │
    │   ✅ Cache layers (GitHub)       │
    └──────┬───────────────────────────┘
           │
    ┌──────▼───────────────────────────┐
    │   WORKFLOW 3: Docker Publish     │
    │   (déclenché sur tag v*.*.*)     │
    │   ✅ Build avec version          │
    │   ✅ Push vers Docker Hub        │
    │   ✅ Create GitHub Release       │
    └──────────────────────────────────┘
```

**Script :**

> "Notre pipeline CI/CD est entièrement automatisé avec GitHub Actions. À chaque push, 3 workflows se déclenchent automatiquement :
> 
> 1. **CI** : Tests, linting, build
> 2. **Docker Build** : Construction des images
> 3. **Docker Publish** : Publication sur Docker Hub (sur tag uniquement)"

---

### 4.2 Démo GitHub Actions (1 min 30)

**🌐 Ouvrir :** https://github.com/KESHRUD/Galilee-OS/actions

**Actions à montrer :**

#### Vue d'ensemble (15 secondes)
> "Vous voyez ici l'historique de tous nos workflows. Tous sont verts, ce qui signifie que nos builds et tests passent."

**Pointer :**
- Nombre total de workflows runs : 186
- Statut : ✅ Success

---

#### Workflow CI (30 secondes)

**Cliquer sur un workflow "CI - Continuous Integration"**

**Script :**

> "Le workflow CI s'exécute à chaque push et pull request. Il comporte 3 jobs en parallèle :
>
> 1. **Backend Tests & Lint** : ESLint + tests unitaires
> 2. **Frontend Tests & Lint** : ESLint + tests E2E Playwright
> 3. **Security Audit** : npm audit pour détecter les vulnérabilités
>
> Regardez, tout est vert. Le build a pris 36 secondes."

---

#### Workflow Docker Publish (45 secondes)

**Cliquer sur "Docker Publish to Hub #3" (le dernier succès)**

**Script :**

> "Ce workflow se déclenche quand on crée un tag de version, par exemple v1.0.0.
>
> Il exécute plusieurs étapes :
> 1. **Build** des images backend et frontend avec Docker Buildx
> 2. **Login** sur Docker Hub avec des secrets sécurisés
> 3. **Push** des images avec 2 tags : version (1.0.0) et latest
> 4. **Create Release** : Génération automatique d'une GitHub Release
>
> Regardez, le workflow a réussi en 44 secondes. Les images sont maintenant sur Docker Hub."

---

### 4.3 GitHub Secrets (30 secondes)

**🌐 Ouvrir :** https://github.com/KESHRUD/Galilee-OS/settings/secrets/actions

**Script :**

> "Pour que le workflow puisse pousser sur Docker Hub, nous utilisons des **GitHub Secrets** qui sont chiffrés et sécurisés.
>
> Nous avons configuré 2 secrets :
> - **DOCKER_HUB_USERNAME** : Le nom d'utilisateur Docker Hub
> - **DOCKER_HUB_TOKEN** : Un token d'accès personnel (pas le mot de passe !)
>
> Ces secrets ne sont jamais exposés dans les logs. C'est une bonne pratique DevOps pour éviter les fuites de credentials."

**Montrer (sans révéler les valeurs) :**
- Liste des secrets configurés
- Dernière modification

---

### 4.4 Résumé DevOps (30 secondes)

**Script :**

> "En résumé, notre infrastructure DevOps comprend :
> 
> ✅ **3 workflows GitHub Actions** automatisés  
> ✅ **Tests automatiques** à chaque commit  
> ✅ **Déploiement continu** sur tag  
> ✅ **Secrets sécurisés** pour Docker Hub  
> ✅ **Cache intelligent** pour builds rapides  
> ✅ **Badges de statut** dans le README  
>
> Tout est versionné, testé, et déployé automatiquement sans intervention manuelle."

---

## 🌐 PARTIE 4bis : DÉPLOIEMENT EN PRODUCTION (Amine - 2 min)

### 4.5 Architecture de Déploiement (30 secondes)

**Slide : Infrastructure Cloud**

```
┌────────────────────────────────────────────────────────┐
│         INFRASTRUCTURE DE PRODUCTION                   │
└────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐
│   NETLIFY    │         │    RENDER    │
│  (Frontend)  │────────▶│  (Backend)   │
│              │  HTTPS  │              │
│ React PWA    │         │ Express API  │
│ Service      │         │ + PostgreSQL │
│ Worker       │         │              │
└──────────────┘         └──────────────┘
      │                        │
      │                        │
   Utilisateur          ┌──────▼──────┐
      │                │  Docker Hub  │
      │                │  (Images)    │
      └────────────────┤  mouenis/    │
                       └──────────────┘
```

**Script :**

> "Notre application est déployée sur 2 plateformes cloud complémentaires :
>
> 1. **Netlify** : Héberge le frontend PWA (React) avec CDN global
> 2. **Render** : Héberge le backend API + PostgreSQL
>
> Les deux communiquent via HTTPS. Le frontend peut aussi fonctionner 100% offline grâce au Service Worker."

---

### 4.6 Déploiement Frontend - Netlify (30 secondes)

**🌐 Ouvrir :** https://app.netlify.com/sites/galilee-os/overview

**Script :**

> "Le frontend est déployé sur Netlify avec ces avantages :
>
> ✅ **Déploiement automatique** : Chaque push sur `main` déclenche un build
> ✅ **CDN global** : L'app est servie depuis des serveurs proches de l'utilisateur
> ✅ **HTTPS automatique** : Certificat SSL gratuit
> ✅ **Preview deployments** : Chaque Pull Request a une URL de preview
> ✅ **Rollback** : Retour à une version précédente en 1 clic"

**Montrer :**
- Historique des déploiements
- Variables d'environnement configurées
- URL de production : https://galilee-os.netlify.app

---

### 4.7 Variables d'Environnement & Secrets (40 secondes)

**Slide : Gestion des Secrets**

```
┌────────────────────────────────────────────────────────┐
│         GESTION DES SECRETS & VARIABLES                │
└────────────────────────────────────────────────────────┘

🔐 GITHUB SECRETS (CI/CD):
   ├─ DOCKER_HUB_USERNAME  = mouenis
   └─ DOCKER_HUB_TOKEN     = [encrypted]

🌐 NETLIFY ENV (Frontend):
   ├─ VITE_GEMINI_API_KEY  = [encrypted]
   └─ VITE_API_URL         = https://api.galilee-os.com

☁️  RENDER ENV (Backend):
   ├─ DATABASE_URL         = postgresql://[encrypted]
   ├─ JWT_SECRET           = [encrypted]
   ├─ JWT_REFRESH_SECRET   = [encrypted]
   └─ NODE_ENV             = production

✅ Aucun secret dans le code source
✅ Secrets différents par environnement (dev/prod)
✅ Rotation des tokens possible sans redéployer
```

**Script :**

> "La sécurité est primordiale. Nous gérons les secrets sur 3 niveaux :
>
> **1. GitHub Secrets** : Pour le CI/CD (Docker Hub credentials)
> 
> **2. Netlify Environment Variables** : 
> - Clé API Gemini pour les flashcards
> - URL du backend API
>
> **3. Render Environment Variables** :
> - Credentials PostgreSQL
> - Secrets JWT pour l'authentification
>
> Aucun secret n'est commité dans le code. Tout est chiffré et injectable au runtime."

---

### 4.8 GitHub Releases & Versioning (30 secondes)

**🌐 Ouvrir :** https://github.com/KESHRUD/Galilee-OS/releases

**Script :**

> "Nous utilisons le versioning sémantique avec GitHub Releases :
>
> **Comment ça fonctionne :**
> 
> 1. On crée un tag git : `git tag -a v1.0.0 -m "Release message"`
> 2. On push le tag : `git push origin v1.0.0`
> 3. **GitHub Actions** s'exécute automatiquement :
>    - Build les images Docker avec tag `1.0.0`
>    - Push sur Docker Hub
>    - **Crée une GitHub Release** avec changelog
>
> Regardez, on a notre release v1.0.0 avec :
> - Description des features
> - Commandes Docker pour déployer
> - Assets (si besoin)
> - Stats (downloads, date, etc.)"

**Montrer :**
- Release v1.0.0
- Notes de release générées automatiquement
- Liens vers images Docker Hub

---

### 4.9 Monitoring & Logs (20 secondes)

**Script :**

> "En production, nous avons accès aux logs en temps réel :
>
> **Netlify** :
> - Logs de build
> - Analytics de trafic
> - Core Web Vitals (performance)
>
> **Render** :
> - Logs applicatifs (console.log)
> - Métriques CPU/RAM
> - Health checks automatiques
>
> Si l'API tombe, Render la redémarre automatiquement en <30 secondes."

---

### 4.10 Résumé Déploiement (10 secondes)

**Script :**

> "En résumé :
>
> ✅ **Frontend** : Netlify (CDN global, HTTPS, auto-deploy)  
> ✅ **Backend** : Render (API + PostgreSQL, auto-scaling)  
> ✅ **Secrets** : Chiffrés sur 3 niveaux  
> ✅ **Releases** : Automatisées avec GitHub Actions  
> ✅ **Monitoring** : Logs et métriques en temps réel  
>
> Déploiement 100% automatisé, sécurisé, et scalable !"

---

**Transition vers Docker :**

> "Mouenis va maintenant vous présenter la partie Docker et l'optimisation des images."

---

## 🐳 PARTIE 5 : DOCKER (Mouenis - 3 min)

### 5.1 Introduction Docker (20 secondes)

**Script :**

> "Bonjour, je vais vous présenter notre stratégie de conteneurisation Docker.
>
> L'objectif était triple :
> 1. Conteneuriser l'application complète (backend, frontend, database)
> 2. Optimiser la taille des images
> 3. Publier sur Docker Hub pour un déploiement facile"

---

### 5.2 Architecture Docker Compose (1 minute)

**Slide 6 : Docker Compose**

```
┌──────────────────────────────────────────────────────┐
│           docker-compose.yml (Dev)                   │
└──────────────────────────────────────────────────────┘

services:
  
  postgres:
    image: postgres:15
    volumes: postgres_data:/var/lib/postgresql/data
    ports: 5433:5432
    environment:
      - POSTGRES_USER=galilee_admin
      - POSTGRES_DB=galilee_os
      - POSTGRES_PASSWORD=***
    healthcheck: pg_isready -U galilee_admin
  
  backend:
    build: ./docker/Dockerfile.backend
    depends_on: postgres
    ports: 3000:3000
    environment:
      - DB_HOST=postgres
      - DB_PORT=5432
      - JWT_SECRET=***
    healthcheck: wget --spider http://localhost:3000/api/health
  
  frontend:
    build: ./docker/Dockerfile.frontend
    depends_on: backend (healthy)
    ports: 80:80
    healthcheck: wget --spider http://localhost/

volumes:
  postgres_data:
  kanban-data:

networks:
  kanban-network:
```

**Script :**

> "Notre `docker-compose.yml` orchestre 3 services :
>
> 1. **PostgreSQL 15** : Base de données avec volume persistant
> 2. **Backend** : API Express qui attend que postgres soit prêt
> 3. **Frontend** : React servi par Nginx qui attend que backend soit healthy
>
> Chaque service a des **health checks** pour s'assurer qu'il est opérationnel avant de démarrer le suivant.
>
> Les données de la base sont persistées dans un volume Docker nommé `postgres_data`."

---

### 5.3 Optimisation des Images (1 min 20)

**Slide 7 : Multi-Stage Builds**

```
┌──────────────────────────────────────────────────────┐
│        Dockerfile.backend (Multi-stage)              │
└──────────────────────────────────────────────────────┘

# ================== STAGE 1: Builder ==================
FROM node:20-alpine AS builder
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npm run build
# Résultat : /app/dist/ (code compilé)

# ================== STAGE 2: Production ==============
FROM node:20-alpine AS production
WORKDIR /app

# Installer seulement les dépendances de production
COPY backend/package*.json ./
RUN npm ci --only=production

# Copier uniquement le code compilé (pas le src/)
COPY --from=builder /app/dist ./dist

# Utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3000
CMD ["node", "dist/index.js"]
```

**Script :**

> "Nous utilisons des **multi-stage builds** pour optimiser la taille.
>
> **Stage 1 - Builder** : On installe toutes les dépendances et on compile le TypeScript.
>
> **Stage 2 - Production** : On prend seulement :
> - Les dépendances de production (pas les dev)
> - Le code compilé (pas le source TypeScript)
> - Une image Alpine ultra-légère
>
> On ajoute aussi un utilisateur non-root pour la sécurité.
>
> Le frontend suit la même stratégie mais utilise Nginx pour servir les fichiers statiques."

---

**Slide 8 : Résultats d'Optimisation**

```
┌──────────────────────────────────────────────────────┐
│            OPTIMISATION DOCKER                       │
└──────────────────────────────────────────────────────┘

AVANT Optimisation:
┌─────────────────────────────────────────────────┐
│ Backend:  ~800MB  [████████████████████████]   │
│ Frontend: ~1.2GB  [████████████████████████]   │
│ TOTAL:    ~2GB                                  │
└─────────────────────────────────────────────────┘

APRÈS Optimisation:
┌─────────────────────────────────────────────────┐
│ Backend:  543MB (-32%)  [████████]              │
│ Frontend: 75MB  (-94%)  [█]                     │
│ TOTAL:    618MB (-69%) 🎉                       │
└─────────────────────────────────────────────────┘

Temps de Build:
- Backend:  5min 20s → 1min 45s  (-67%)
- Frontend: 8min 10s → 2min 30s  (-69%)
```

**Script :**

> "Les résultats parlent d'eux-mêmes :
>
> - **Backend** : de 800MB à 543MB, soit **-32%**
> - **Frontend** : de 1.2GB à 75MB, soit **-94%** !
> - **Total** : réduction de **-69%** de la taille
>
> Les temps de build sont aussi divisés par 3.
>
> Ces optimisations rendent l'application beaucoup plus rapide à déployer et moins coûteuse en bande passante."

---

### 5.4 Docker Hub (40 secondes)

**🌐 Ouvrir :** https://hub.docker.com/r/mouenis/galilee-os-backend

**Script :**

> "Les images sont publiées sur Docker Hub sous le compte `mouenis`.
>
> Nous avons 2 repositories publics :
> - **galilee-os-backend** : L'API Express
> - **galilee-os-frontend** : Le React PWA
>
> Chaque image a 2 tags :
> - **latest** : Dernière version stable
> - **1.0.0** : Version spécifique
>
> Pour déployer l'application, il suffit de 2 commandes :"

**Montrer sur le slide ou dans un terminal :**

```bash
# Pull les images depuis Docker Hub
docker pull mouenis/galilee-os-backend:1.0.0
docker pull mouenis/galilee-os-frontend:1.0.0

# Démarrer avec docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

**Script :**

> "En moins de 2 minutes, l'application complète est déployée sur n'importe quelle machine avec Docker. C'est l'avantage de la conteneurisation !"

---

### 5.5 Résumé Docker (20 secondes)

**Script :**

> "En résumé :
>
> ✅ **3 services** orchestrés avec Docker Compose  
> ✅ **Multi-stage builds** pour optimiser la taille  
> ✅ **Images Alpine** ultra-légères  
> ✅ **Volumes persistants** pour les données  
> ✅ **Health checks** pour la robustesse  
> ✅ **Docker Hub** public pour déploiement facile  
> ✅ **Réduction de 69%** de la taille totale  
>
> Notre infrastructure Docker est production-ready !"

---

## ❓ PARTIE 6 : QUESTIONS (Tous - 5 min)

### Préparation aux Questions Possibles

#### Questions Techniques

**Q1 : Pourquoi TypeORM et pas Prisma/Sequelize ?**

**Réponse (Sarah) :**
> "Nous avons choisi TypeORM car :
> 1. Excellent support TypeScript avec decorators
> 2. Migrations intégrées et faciles à gérer
> 3. Support complet des 3 types de relations requises
> 4. Communauté active et documentation complète
> 5. Compatible avec notre stack Node.js/Express"

---

**Q2 : Comment gérez-vous la sécurité des mots de passe ?**

**Réponse (Amine) :**
> "Nous utilisons **bcrypt** avec un salt de 10 rounds pour hasher les mots de passe.
>
> Les mots de passe ne sont jamais stockés en clair. TypeORM a des hooks `@BeforeInsert` et `@BeforeUpdate` qui hashent automatiquement le mot de passe avant de l'enregistrer en base.
>
> Pour l'authentification, nous utilisons des **JWT tokens** avec expiration (1h pour l'access token, 7 jours pour le refresh token)."

---

**Q3 : Pourquoi une PWA et pas une app mobile native ?**

**Réponse (Sarah) :**
> "Une PWA offre plusieurs avantages pour notre cas d'usage :
> 1. **Une seule codebase** pour tous les devices (desktop, mobile, tablet)
> 2. **Installable** comme une app native
> 3. **Fonctionne offline** avec Service Worker
> 4. **Mises à jour instantanées** sans passer par les stores
> 5. **Coût de développement réduit**
>
> Pour un projet étudiant avec des ressources limitées, c'était le choix optimal."

---

**Q4 : Comment gérez-vous les migrations de base de données ?**

**Réponse (Mouenis) :**
> "TypeORM génère automatiquement les migrations quand on modifie les entités.
>
> Commandes utilisées :
> ```bash
> npm run migration:generate -- -n NomMigration
> npm run migration:run
> ```
>
> Les migrations sont versionnées dans `backend/src/migrations/` et appliquées dans l'ordre chronologique. Cela garantit que la structure de la DB est toujours synchronisée avec le code."

---

**Q5 : Pourquoi PostgreSQL et pas MongoDB ?**

**Réponse (Amine) :**
> "Le sujet impose une base **relationnelle** avec un ORM, donc MongoDB (NoSQL) n'était pas éligible.
>
> PostgreSQL est un excellent choix car :
> 1. Open-source et gratuit
> 2. Support robuste des relations complexes
> 3. ACID compliance (transactions fiables)
> 4. Excellent écosystème d'outils
> 5. Image Docker officielle et stable"

---

#### Questions DevOps

**Q6 : Que se passe-t-il si un test échoue dans la CI ?**

**Réponse (Amine) :**
> "Si un test échoue, GitHub Actions marque le workflow en rouge et bloque automatiquement le merge de la pull request.
>
> Nous recevons une notification par email. Le développeur doit corriger le bug, pusher un nouveau commit, et le workflow se relance automatiquement.
>
> C'est une sécurité pour éviter de merger du code cassé dans main."

---

**Q7 : Combien coûte l'hébergement de l'application ?**

**Réponse (Sarah) :**
> "Actuellement, **0€** !
>
> - **Frontend** : Netlify (plan gratuit, illimité)
> - **Images Docker** : Docker Hub (plan gratuit, repositories publics)
> - **CI/CD** : GitHub Actions (2000 minutes gratuites/mois)
>
> Pour un déploiement backend en production, on pourrait utiliser Render (plan gratuit) ou Heroku (payant mais abordable ~7$/mois)."

---

**Q8 : Comment testez-vous que l'application fonctionne offline ?**

**Réponse (Sarah) :**
> "Nous avons des tests E2E Playwright qui simulent une perte de connexion.
>
> Le test désactive le réseau avec `page.setOffline(true)`, puis vérifie que :
> 1. Les tâches existantes s'affichent
> 2. On peut créer de nouvelles tâches
> 3. Les données sont stockées dans IndexedDB
> 4. Quand on réactive le réseau, tout se synchronise
>
> Le fichier de test est `frontend/tests/e2e/pwa-offline.spec.ts`."

---

#### Questions Projet

**Q9 : Combien de temps avez-vous passé sur ce projet ?**

**Réponse (Tous) :**
> "Le projet a été réalisé sur environ **6 semaines** :
>
> - **Semaine 1-2** : Setup, architecture, maquettes
> - **Semaine 3-4** : Développement features (Sarah + Mouenis)
> - **Semaine 5** : Migration PostgreSQL, Docker, CI/CD (Amine + Mouenis)
> - **Semaine 6** : Tests, documentation, préparation soutenance
>
> Total estimé : **~120 heures** de travail en équipe."

---

**Q10 : Quelles difficultés avez-vous rencontrées ?**

**Réponse (Amine) :**
> "Les principales difficultés :
>
> 1. **Migration vers PostgreSQL** : Passer d'un stockage in-memory à une vraie DB avec ORM a nécessité de refactoriser beaucoup de code.
>
> 2. **Optimisation Docker** : Comprendre les multi-stage builds et réduire la taille des images a demandé de la recherche.
>
> 3. **Tests E2E** : Playwright nécessite une configuration spécifique pour les PWA avec Service Workers.
>
> 4. **Secrets GitHub** : Configurer les credentials Docker Hub de manière sécurisée.
>
> Mais toutes ces difficultés nous ont beaucoup appris !"

---

## 📊 MÉTRIQUES DU PROJET (Pour questions)

### Statistiques de Code

```
Backend:
- Lignes de code : ~3,500
- Fichiers TypeScript : 42
- Routes API : 20
- Entités TypeORM : 8
- Tests unitaires : 15

Frontend:
- Lignes de code : ~8,000
- Composants React : 25
- Pages : 6
- Tests E2E : 17
- Tests unitaires : 11

Docker & DevOps:
- Dockerfiles : 2 (multi-stage)
- GitHub Actions workflows : 3
- Scripts automation : 6
- Documentation : 2,000+ lignes

Total:
- Commits : 100+
- Branches : 13
- Pull Requests : 16
- Issues fermées : 13
```

---

## 🎯 POINTS FORTS À METTRE EN AVANT

### Conformité SAE (100%)

✅ **API REST complète** : 20 routes, tous les verbes HTTP  
✅ **Backend** : Node.js + Express + TypeScript  
✅ **Base relationnelle** : PostgreSQL 15  
✅ **ORM** : TypeORM avec 8 entités  
✅ **3 types de relations** : One-to-One, One-to-Many, Many-to-Many  
✅ **Docker** : Conteneurisation complète avec Docker Compose  
✅ **Docker Hub** : Images publiques publiées  
✅ **README structuré** : 1,300+ lignes de documentation  
✅ **Données de test** : Script seed fourni  
✅ **Volume Docker** : Persistance PostgreSQL  

### Extras (Au-delà du minimum)

🌟 **PWA offline-first** avec Service Worker  
🌟 **IA Gemini** pour génération de flashcards  
🌟 **Gamification** avec système XP/niveaux  
🌟 **43 tests** (unitaires + E2E) automatisés  
🌟 **CI/CD complet** avec GitHub Actions  
🌟 **Optimisation Docker** -69% de taille  
🌟 **Documentation exhaustive** (3 guides techniques)  
🌟 **Application en production** sur Netlify  

---

## 📋 CHECKLIST FINALE AVANT SOUTENANCE

### À Préparer

- [ ] **Laptop chargé** + chargeur de secours
- [ ] **Connexion internet stable** (wifi + hotspot 4G de secours)
- [ ] **Navigateur** : Chrome avec DevTools prêts
- [ ] **Tabs ouverts** :
  - [ ] https://galilee-os.netlify.app (app prod)
  - [ ] http://localhost:3000 (API locale si démo locale)
  - [ ] https://github.com/KESHRUD/Galilee-OS
  - [ ] https://github.com/KESHRUD/Galilee-OS/actions
  - [ ] https://hub.docker.com/r/mouenis/galilee-os-backend
- [ ] **Credentials de test** notés :
  ```
  Email: demo@galilee.com
  Password: Demo1234!
  ```
- [ ] **Slides** en backup (PDF sur clé USB)
- [ ] **Timer** : Chronomètre pour respecter les 15 minutes

### Vérifications Techniques

- [ ] **App production** fonctionne (test 5 min avant)
- [ ] **API localhost** tourne (docker-compose up -d)
- [ ] **GitHub Actions** : Tous les workflows verts
- [ ] **Docker Hub** : Images accessibles publiquement
- [ ] **README** : Prof invité (@samiryoucef ajouté)

### Répartition des Rôles

- [ ] **Sarah** : Prête pour intro + démo app + architecture ORM
- [ ] **Amine** : Prêt pour démo API + DevOps/CI/CD
- [ ] **Mouenis** : Prêt pour Docker + optimisations

---

## 🎤 CONSEILS POUR LA PRÉSENTATION

### Communication

1. **Parler clairement** et pas trop vite
2. **Regarder le jury** et les pairs, pas seulement l'écran
3. **Utiliser des transitions** entre les parties
4. **Montrer l'enthousiasme** pour le projet
5. **Gérer le timing** : utiliser un timer discret

### Démonstration

1. **Tester AVANT** que tout fonctionne (5 min avant)
2. **Avoir un plan B** : vidéo enregistrée de la démo si problème réseau
3. **Ne pas paniquer** si erreur : expliquer calmement ce qui se passe
4. **Préparer les données** : compte de test créé à l'avance
5. **Fermer les onglets inutiles** pour éviter les distractions

### Questions

1. **Écouter attentivement** la question avant de répondre
2. **Demander de répéter** si la question n'est pas claire
3. **Répondre honnêtement** : "Je ne sais pas" est acceptable si suivi de "mais voici comment je chercherais"
4. **Rester positif** même si la question est critique
5. **Se répartir les questions** selon les domaines d'expertise

---

## 🎯 MESSAGE FINAL

Vous avez construit une application **exceptionnelle** qui dépasse largement les exigences de la SAE.

**Points forts uniques :**
- Application réelle et utilisable (pas juste un CRUD basique)
- Qualité professionnelle (tests, CI/CD, optimisations)
- Documentation exhaustive
- DevOps exemplaire

**Soyez confiants !** Vous maîtrisez votre sujet et avez un projet dont vous pouvez être fiers.

Bon courage pour la soutenance ! 🚀

---

## 📞 CONTACTS

**En cas de problème technique le jour J :**
- Amine : [numéro]
- Sarah : [numéro]
- Mouenis : [numéro]

**Lien repository :**  
https://github.com/KESHRUD/Galilee-OS

**Lien Docker Hub :**  
https://hub.docker.com/r/mouenis/

---

*Document préparé pour la soutenance SAE DDAW - Galilee OS*  
*Équipe : Amine, Sarah, Mouenis - ING2 2024-2025*
