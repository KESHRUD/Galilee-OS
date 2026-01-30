# 🎓 SOUTENANCE AMINE - GALILEE OS
## API REST, DevOps & Déploiement

**Responsable :** BENHAMMADA Ahmed Amine  
**Rôle :** Scrum Master, API REST & DevOps Specialist  
**Durée :** 7 minutes (sur 15 min total)  
**Parties :** 3️⃣ API REST + 4️⃣ DevOps/CI/CD + 4️⃣bis Déploiement

---

## 📊 TIMING DE MA PRÉSENTATION

| Section | Durée | Contenu |
|---------|-------|---------|
| **API REST (Partie 3)** | 4 min | Démo API avec DevTools navigateur |
| **DevOps/CI/CD (Partie 4)** | 3 min | GitHub Actions, workflows, secrets |
| **Déploiement (Partie 4bis)** | 2 min (bonus) | Netlify, Render, variables d'env, releases |

---

# 🔌 PARTIE 3 : API REST (4 minutes)

## 3.1 Introduction API (15 secondes)

### Script

> "Je vais maintenant vous montrer notre API REST en action. Elle expose **20 routes** conformes aux standards HTTP avec GET, POST, PUT/PATCH, DELETE.
>
> Je vais utiliser les **DevTools du navigateur** pour tester l'API en direct, ce qui est plus interactif qu'un Postman pré-enregistré."

---

## 3.2 Démonstration avec DevTools (3 min 45)

### Préparation

**🌐 URL à ouvrir :** https://galilee-os.netlify.app  
**DevTools :** `F12` → Onglet `Console`

**⚠️ Important :** Si démo locale, remplacer par `http://localhost:3000`

---

### Test 1 : Register - Créer un utilisateur (30 secondes)

**Script :**

> "Commençons par créer un nouvel utilisateur avec l'endpoint `POST /api/auth/register`."

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

**Réponse attendue :**

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

**Script après réponse :**

> "Parfait ! L'utilisateur est créé avec succès. On reçoit un **JWT token** qu'on va utiliser pour les requêtes authentifiées. Le token est automatiquement sauvegardé dans `window.token` pour faciliter la suite."

---

### Test 2 : Login - Connexion (30 secondes)

**Script :**

> "Testons maintenant la connexion avec `POST /api/auth/login`."

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

**Réponse attendue :**

```json
{
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Script :**

> "La connexion fonctionne. Notez qu'on reçoit aussi un **refresh token** pour renouveler la session sans redemander le mot de passe."

---

### Test 3 : Create Board - Créer un tableau (30 secondes)

**Script :**

> "Créons un board avec `POST /api/boards`, en utilisant le token dans le header `Authorization`."

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
  "createdAt": "2025-01-23T15:30:00Z"
}
```

**Script :**

> "Board créé avec succès ! Remarquez qu'on sauvegarde l'ID du board pour l'utiliser dans les requêtes suivantes."

---

### Test 4 : Get All Boards - Lire les données (20 secondes)

**Script :**

> "Récupérons tous nos boards avec `GET /api/boards`."

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

**Réponse attendue :**

```json
[
  {
    "id": "board-uuid-456",
    "title": "SAE DDAW - Soutenance",
    "owner": {
      "id": "uuid-123",
      "email": "soutenance@galilee.com"
    },
    "createdAt": "2025-01-23T15:30:00Z"
  }
]
```

---

### Test 5 : Create Column - Créer une colonne (30 secondes)

**Script :**

> "Ajoutons une colonne 'To Do' au board avec `POST /api/boards/:id/columns`."

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

**Réponse attendue :**

```json
{
  "id": "column-uuid-789",
  "title": "To Do",
  "position": 0,
  "boardId": "board-uuid-456"
}
```

---

### Test 6 : Create Task - Créer une tâche (30 secondes)

**Script :**

> "Créons une tâche dans la colonne avec `POST /api/columns/:id/tasks`."

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
    description: 'Tester tous les endpoints REST pour la soutenance',
    position: 0
  })
})
.then(res => res.json())
.then(data => {
  console.log('✅ Task created:', data);
  window.taskId = data.id;
});
```

**Réponse attendue :**

```json
{
  "id": "task-uuid-101",
  "title": "Préparer la démo API",
  "description": "Tester tous les endpoints REST pour la soutenance",
  "completed": false,
  "position": 0,
  "columnId": "column-uuid-789",
  "createdAt": "2025-01-23T15:32:00Z"
}
```

---

### Test 7 : Update Task (PATCH) - Modifier (20 secondes)

**Script :**

> "Marquons la tâche comme complétée avec `PATCH /api/tasks/:id`. Ici, on utilise **PATCH** et pas PUT pour une modification partielle."

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

**Réponse attendue :**

```json
{
  "id": "task-uuid-101",
  "title": "Préparer la démo API",
  "completed": true,
  "updatedAt": "2025-01-23T15:33:00Z"
}
```

---

### Test 8 : Gestion d'Erreurs (15 secondes)

**Script :**

> "Testons la gestion d'erreurs : que se passe-t-il avec un token invalide ?"

```javascript
// Test error: Invalid token
fetch('http://localhost:3000/api/boards', {
  headers: { 'Authorization': 'Bearer invalid-token-xxx' }
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

> "Parfait ! L'API retourne une erreur **401 Unauthorized** avec un message clair. Toutes nos erreurs suivent ce format standard :
> - `400` : Données invalides
> - `401` : Token manquant/invalide
> - `403` : Permissions insuffisantes
> - `404` : Ressource introuvable
> - `500` : Erreur serveur"

---

## 3.3 Résumé API (15 secondes)

### Script

> "Voilà pour la démo API ! Nous avons testé **8 endpoints** couvrant toutes les opérations CRUD :
>
> ✅ **POST** : Register, Login, Create Board/Column/Task  
> ✅ **GET** : Read Boards  
> ✅ **PATCH** : Update Task (modification partielle)  
> ✅ **DELETE** : Disponible mais pas montré par manque de temps  
>
> L'API est **entièrement conforme aux standards REST** avec :
> - Authentification JWT sécurisée
> - Gestion d'erreurs robuste
> - Validation des données
> - 20 routes au total"

---

# 🚀 PARTIE 4 : DEVOPS & CI/CD (3 minutes)

## 4.1 Présentation DevOps (30 secondes)

### Slide : Pipeline CI/CD

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

### Script

> "Notre pipeline CI/CD est entièrement automatisé avec **GitHub Actions**. À chaque push, 3 workflows se déclenchent automatiquement :
> 
> 1. **CI** : Tests, linting, build TypeScript
> 2. **Docker Build** : Construction des images
> 3. **Docker Publish** : Publication sur Docker Hub (uniquement sur tag de version)
>
> Tout se passe automatiquement, sans intervention manuelle !"

---

## 4.2 Démo GitHub Actions (1 min 30)

### Vue d'ensemble (15 secondes)

**🌐 Ouvrir :** https://github.com/KESHRUD/Galilee-OS/actions

**Script :**

> "Vous voyez ici l'historique de tous nos workflows. **Tous sont verts**, ce qui signifie que nos builds et tests passent systématiquement."

**Pointer :**
- Nombre total de workflow runs : **186**
- Statut : ✅ **Success**
- Durée moyenne : 30-40 secondes

---

### Workflow CI (30 secondes)

**Cliquer sur un workflow "CI - Continuous Integration"**

**Script :**

> "Le workflow **CI** s'exécute à **chaque push et pull request**. Il comporte 3 jobs qui tournent en parallèle :
>
> **1. Backend Tests & Lint :**
> - ESLint (détection erreurs de code)
> - Tests unitaires (Jest)
> - Build TypeScript
>
> **2. Frontend Tests & Lint :**
> - ESLint React
> - Tests E2E avec Playwright (3 navigateurs)
> - Build Vite
>
> **3. Security Audit :**
> - `npm audit` pour détecter les vulnérabilités
>
> Regardez, tout est vert. Le build complet a pris **36 secondes**. Si un test échoue, le merge est bloqué automatiquement."

**Montrer :**
- Les 3 jobs en parallèle (icônes vertes)
- Durée d'exécution
- Logs d'un job (optionnel)

---

### Workflow Docker Publish (45 secondes)

**Cliquer sur "Docker Publish to Hub #3" (le dernier succès)**

**Script :**

> "Ce workflow se déclenche **uniquement quand on crée un tag de version**, par exemple `v1.0.0`.
>
> **Étapes automatiques :**
>
> 1. **Build des images** :
>    - Backend avec Docker Buildx
>    - Frontend avec multi-stage build
>    - Cache des layers sur GitHub
>
> 2. **Login sécurisé sur Docker Hub** :
>    - Utilisation de secrets chiffrés
>    - Token d'accès (pas de mot de passe)
>
> 3. **Push des images** avec 2 tags :
>    - Tag version : `mouenis/galilee-os-backend:1.0.0`
>    - Tag latest : `mouenis/galilee-os-backend:latest`
>
> 4. **Création automatique d'une GitHub Release** :
>    - Changelog généré
>    - Instructions de déploiement
>    - Liens vers Docker Hub
>
> Regardez, le workflow a réussi en **44 secondes**. Les images sont maintenant publiques sur Docker Hub."

**Montrer :**
- Étapes du workflow (toutes vertes)
- Durée d'exécution
- Liens vers Docker Hub dans les logs

---

## 4.3 GitHub Secrets (30 secondes)

### Présentation Secrets

**🌐 Ouvrir :** https://github.com/KESHRUD/Galilee-OS/settings/secrets/actions

**Script :**

> "Pour que le workflow puisse pousser sur Docker Hub, nous utilisons des **GitHub Secrets** qui sont **chiffrés** et sécurisés.
>
> **Secrets configurés :**
>
> **1. DOCKER_HUB_USERNAME**
> - Valeur : `mouenis`
> - Utilisé pour login Docker Hub
>
> **2. DOCKER_HUB_TOKEN**
> - Token d'accès personnel (PAT)
> - **Pas le mot de passe !** Plus sécurisé
> - Permissions limitées (read/write images)
>
> **Sécurité :**
> - Les secrets **ne sont jamais exposés** dans les logs
> - GitHub masque automatiquement les valeurs sensibles
> - Seuls les workflows autorisés peuvent y accéder
>
> C'est une **bonne pratique DevOps** essentielle pour éviter les fuites de credentials."

**Montrer (sans révéler les valeurs) :**
- Liste des 2 secrets configurés
- Date de dernière modification
- Bouton "Update" (montrer qu'on peut changer sans redéployer)

---

## 4.4 Résumé DevOps (30 secondes)

### Script

> "En résumé, notre infrastructure DevOps comprend :
> 
> ✅ **3 workflows GitHub Actions** automatisés  
> ✅ **43 tests automatiques** (26 unitaires + 17 E2E)  
> ✅ **Déploiement continu** sur tag de version  
> ✅ **Secrets sécurisés** (chiffrés, jamais exposés)  
> ✅ **Cache intelligent** pour builds rapides  
> ✅ **Badges de statut** dans le README  
> ✅ **186 workflow runs** avec 100% de succès  
>
> Tout est **versionné, testé, et déployé automatiquement** sans intervention manuelle.
>
> C'est un pipeline DevOps de niveau professionnel !"

---

# 🌐 PARTIE 4bis : DÉPLOIEMENT EN PRODUCTION (2 minutes BONUS)

## 4.5 Architecture de Déploiement (30 secondes)

### Slide : Infrastructure Cloud

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

UTILISATEURS ────► Netlify CDN (Frontend)
                      │
                      └──► Render API (Backend + PostgreSQL)
```

### Script

> "Notre application est déployée sur **2 plateformes cloud complémentaires** :
>
> **1. Netlify (Frontend) :**
> - Héberge le React PWA
> - CDN global (serveurs partout dans le monde)
> - HTTPS automatique
> - Fonctionne 100% offline (Service Worker)
>
> **2. Render (Backend) :**
> - Héberge l'API Express + PostgreSQL
> - Auto-scaling si besoin
> - Backup automatique de la DB
> - Health checks
>
> Les deux communiquent via HTTPS. Le frontend peut aussi fonctionner **entièrement offline** grâce au Service Worker et IndexedDB."

---

## 4.6 Déploiement Frontend - Netlify (30 secondes)

### Démo Netlify

**🌐 Ouvrir :** https://app.netlify.com/sites/galilee-os/overview (si accès)

**Sinon montrer depuis le site :** https://galilee-os.netlify.app

**Script :**

> "Le frontend est déployé sur **Netlify** avec ces avantages :
>
> ✅ **Déploiement automatique** :
> - Chaque push sur `main` → build automatique
> - Preview deployment sur chaque Pull Request
>
> ✅ **CDN global** :
> - L'app est servie depuis des serveurs proches de l'utilisateur
> - Latence minimale (< 100ms)
>
> ✅ **HTTPS automatique** :
> - Certificat SSL gratuit et renouvelé automatiquement
>
> ✅ **Rollback facile** :
> - Retour à une version précédente en 1 clic
> - Historique des 100 derniers déploiements
>
> ✅ **100% gratuit** pour notre usage !"

**Montrer (si possible) :**
- Historique des déploiements
- Durée du dernier build
- URL de production

---

## 4.7 Variables d'Environnement & Secrets (40 secondes)

### Slide : Gestion des Secrets

```
┌────────────────────────────────────────────────────────┐
│         GESTION DES SECRETS & VARIABLES                │
└────────────────────────────────────────────────────────┘

🔐 GITHUB SECRETS (CI/CD):
   ├─ DOCKER_HUB_USERNAME  = mouenis
   └─ DOCKER_HUB_TOKEN     = [encrypted] ••••••••

🌐 NETLIFY ENV (Frontend):
   ├─ VITE_GEMINI_API_KEY  = [encrypted] ••••••••
   └─ VITE_API_URL         = https://galilee-api.render.com

☁️  RENDER ENV (Backend):
   ├─ DATABASE_URL         = postgresql://[encrypted]
   ├─ JWT_SECRET           = [encrypted] ••••••••
   ├─ JWT_REFRESH_SECRET   = [encrypted] ••••••••
   └─ NODE_ENV             = production

✅ Aucun secret dans le code source
✅ Secrets différents par environnement (dev/staging/prod)
✅ Rotation des tokens possible sans redéployer
✅ Audit logs des accès
```

### Script

> "La **sécurité des secrets** est primordiale. Nous gérons les secrets sur **3 niveaux distincts** :
>
> **1. GitHub Secrets (CI/CD) :**
> - Credentials Docker Hub
> - Utilisés uniquement par GitHub Actions
> - Jamais exposés dans les logs
>
> **2. Netlify Environment Variables (Frontend) :**
> - **VITE_GEMINI_API_KEY** : Clé API Gemini pour les flashcards IA
> - **VITE_API_URL** : URL du backend (différente en dev/prod)
> - Injectées au moment du build
>
> **3. Render Environment Variables (Backend) :**
> - **DATABASE_URL** : Connection string PostgreSQL (auto-générée)
> - **JWT_SECRET** : Secret pour signer les tokens (généré avec `openssl rand -base64 32`)
> - **JWT_REFRESH_SECRET** : Secret pour les refresh tokens
>
> **Bonnes pratiques appliquées :**
> - ✅ Aucun secret commité dans Git
> - ✅ Fichier `.env.example` fourni (valeurs fictives)
> - ✅ Secrets chiffrés par les plateformes
> - ✅ Rotation possible sans toucher au code
> - ✅ Principe du moindre privilège"

---

## 4.8 GitHub Releases & Versioning (30 secondes)

### Démo GitHub Releases

**🌐 Ouvrir :** https://github.com/KESHRUD/Galilee-OS/releases

**Script :**

> "Nous utilisons le **versioning sémantique** (SemVer) avec **GitHub Releases** :
>
> **Comment créer une release (processus automatisé) :**
>
> ```bash
> # 1. Créer un tag git avec version
> git tag -a v1.0.0 -m "Release v1.0.0 - Production Ready"
>
> # 2. Pousser le tag
> git push origin v1.0.0
>
> # 3. GitHub Actions fait le reste automatiquement :
> #    - Build les images Docker avec tag 1.0.0
> #    - Push sur Docker Hub
> #    - Crée la GitHub Release avec changelog
> ```
>
> **Ce que contient notre release v1.0.0 :**
> - ✅ Description des features principales
> - ✅ Changelog généré automatiquement
> - ✅ Commandes Docker pour déployer
> - ✅ Liens vers images Docker Hub
> - ✅ Date, auteurs, statistiques
>
> Regardez, notre release v1.0.0 est **production-ready** avec toutes les instructions de déploiement !"

**Montrer :**
- Release v1.0.0
- Notes de release
- Assets (si présents)
- Liens Docker Hub

---

## 4.9 Monitoring & Logs (20 secondes)

### Script

> "En production, nous avons accès aux **logs et métriques en temps réel** :
>
> **Netlify (Frontend) :**
> - Logs de build (durée, erreurs)
> - Analytics de trafic (visiteurs, pages vues)
> - Core Web Vitals (performance, LCP, FID, CLS)
> - Bande passante utilisée
>
> **Render (Backend) :**
> - Logs applicatifs en temps réel (`console.log`)
> - Métriques CPU/RAM (utilisation, pics)
> - Health checks HTTP (toutes les 30s)
> - Database metrics (connections, requêtes)
>
> **Auto-recovery :**
> - Si l'API tombe → Render la redémarre automatiquement en **< 30 secondes**
> - Health check échoue 3 fois → redémarrage forcé
> - Alertes email en cas d'incident
>
> Nous avons une **observabilité complète** de l'infrastructure !"

---

## 4.10 Résumé Déploiement (10 secondes)

### Script

> "En résumé sur le déploiement :
>
> ✅ **Frontend** : Netlify (CDN global, HTTPS, auto-deploy)  
> ✅ **Backend** : Render (API + PostgreSQL, auto-scaling)  
> ✅ **Docker Hub** : Images publiques pour déploiement facile  
> ✅ **Secrets** : Chiffrés sur 3 niveaux (GitHub/Netlify/Render)  
> ✅ **Releases** : Automatisées avec GitHub Actions + SemVer  
> ✅ **Monitoring** : Logs et métriques en temps réel  
> ✅ **Coût** : **0€** (plans gratuits pour tout !)  
>
> Déploiement **100% automatisé, sécurisé, et scalable** ! 🚀"

---

# 📊 RÉCAPITULATIF COMPLET DE MA PARTIE

## Endpoints API démontrés (8 sur 20)

| Méthode | Endpoint | Démo | Status |
|---------|----------|------|--------|
| POST | `/api/auth/register` | ✅ | User créé |
| POST | `/api/auth/login` | ✅ | JWT token reçu |
| POST | `/api/boards` | ✅ | Board créé |
| GET | `/api/boards` | ✅ | Liste récupérée |
| POST | `/api/boards/:id/columns` | ✅ | Column créée |
| POST | `/api/columns/:id/tasks` | ✅ | Task créée |
| PATCH | `/api/tasks/:id` | ✅ | Task modifiée |
| GET | `/api/boards` (erreur) | ✅ | Erreur 401 gérée |

**Total API : 20 routes** (les 12 autres disponibles mais non démontrées par manque de temps)

---

## Workflows GitHub Actions (3)

| Workflow | Déclencheur | Durée | Jobs | Status |
|----------|-------------|-------|------|--------|
| **CI** | Push + PR | ~36s | 3 (tests, lint, audit) | ✅ 100% |
| **Docker Build** | Push main/develop | ~1m30s | 2 (backend, frontend) | ✅ 100% |
| **Docker Publish** | Tag `v*.*.*` | ~44s | 1 (build + push + release) | ✅ 100% |

**Total : 186 workflow runs, 100% de succès**

---

## Infrastructure Cloud

| Service | Plateforme | Fonction | Coût |
|---------|-----------|----------|------|
| **Frontend** | Netlify | React PWA + CDN | Gratuit |
| **Backend** | Render | Express API + PostgreSQL | Gratuit (hobby) |
| **Images** | Docker Hub | Registre public | Gratuit |
| **CI/CD** | GitHub Actions | Workflows automatisés | Gratuit (2000 min/mois) |

**Total : 0€ de coût d'infrastructure**

---

## Secrets & Variables (8)

| Plateforme | Secrets | Chiffrés | Rotatables |
|------------|---------|----------|------------|
| GitHub | 2 | ✅ | ✅ |
| Netlify | 2 | ✅ | ✅ |
| Render | 4 | ✅ | ✅ |

**Aucun secret dans le code source ✅**

---

# 🎯 POINTS FORTS À METTRE EN AVANT

## API REST

✅ **20 routes conformes HTTP**  
✅ **JWT Authentication sécurisée**  
✅ **Gestion d'erreurs complète**  
✅ **Validation des données**  
✅ **CORS configuré**  
✅ **Documentation OpenAPI** (possible)  

## DevOps

✅ **Pipeline CI/CD 100% automatisé**  
✅ **3 workflows GitHub Actions**  
✅ **43 tests automatisés**  
✅ **186 runs avec 100% succès**  
✅ **Secrets sécurisés (chiffrés)**  
✅ **Cache intelligent**  

## Déploiement

✅ **Multi-cloud (Netlify + Render)**  
✅ **CDN global (latence < 100ms)**  
✅ **HTTPS automatique**  
✅ **Auto-scaling**  
✅ **Health checks**  
✅ **Monitoring en temps réel**  
✅ **Coût : 0€**  

---

# ❓ QUESTIONS POSSIBLES & RÉPONSES

## Questions API

**Q1 : Pourquoi JWT et pas les sessions classiques ?**

> "Les JWT sont **stateless**, ce qui signifie qu'on n'a pas besoin de stocker les sessions en mémoire ou en Redis. C'est plus scalable : si on ajoute plusieurs serveurs backend, ça fonctionne sans synchronisation.
>
> Le token contient toutes les infos nécessaires (user ID, role, expiration), signées avec un secret. Le serveur vérifie juste la signature, pas besoin de requête DB à chaque appel API.
>
> On utilise aussi des **refresh tokens** pour renouveler la session sans redemander le mot de passe."

---

**Q2 : Comment gérez-vous la sécurité des mots de passe ?**

> "Nous utilisons **bcrypt** avec un salt de **10 rounds** pour hasher les mots de passe.
>
> Le mot de passe n'est **jamais stocké en clair**. TypeORM a des hooks `@BeforeInsert` et `@BeforeUpdate` qui hashent automatiquement avant d'enregistrer en base.
>
> Pour vérifier le mot de passe au login, on utilise `bcrypt.compare()` qui compare le hash stocké avec le mot de passe saisi."

---

**Q3 : Pourquoi PATCH et pas PUT pour les updates ?**

> "**PATCH** est pour les **modifications partielles** (on envoie seulement les champs à modifier).
> 
> **PUT** est pour les **remplacements complets** (on envoie l'objet entier).
>
> Exemple :
> - `PATCH /api/tasks/123 { "completed": true }` → Modifie juste le statut
> - `PUT /api/tasks/123 { ...tout l'objet... }` → Remplace la tâche entière
>
> PATCH est plus efficace en bande passante et évite d'écraser des champs par erreur."

---

## Questions DevOps

**Q4 : Que se passe-t-il si un test échoue dans la CI ?**

> "Si un test échoue, GitHub Actions **marque le workflow en rouge** et bloque automatiquement le merge de la pull request.
>
> Le développeur reçoit une **notification par email**. Il doit corriger le bug, pusher un nouveau commit, et le workflow se relance automatiquement.
>
> C'est une **sécurité** pour éviter de merger du code cassé dans `main` ou `develop`."

---

**Q5 : Pourquoi GitHub Actions et pas Jenkins/GitLab CI ?**

> "**GitHub Actions** est natif à GitHub, donc :
> - ✅ Pas de serveur à gérer (pas de Jenkins à installer)
> - ✅ 2000 minutes gratuites par mois (suffisant pour nous)
> - ✅ Marketplace avec 20,000+ actions réutilisables
> - ✅ Intégration parfaite avec GitHub (PRs, issues, releases)
>
> Pour un projet académique ou open-source, c'est le meilleur choix."

---

**Q6 : Comment testez-vous les workflows avant de les pousser ?**

> "Bonne question ! On utilise plusieurs techniques :
>
> 1. **act** (CLI) : Exécute les workflows GitHub Actions localement
> 2. **Branches de test** : On push sur une branche `test-ci` pour tester sans affecter `main`
> 3. **Workflow dispatch** : Déclenchement manuel depuis l'interface GitHub
> 4. **Logs détaillés** : GitHub Actions affiche tous les logs en temps réel
>
> On a aussi des **dry-run** dans nos scripts qui simulent sans exécuter réellement."

---

## Questions Déploiement

**Q7 : Combien coûte l'hébergement de l'application ?**

> "Actuellement, **0€** !
>
> - **Frontend (Netlify)** : Plan gratuit (100GB bande passante/mois, CDN illimité)
> - **Backend (Render)** : Plan hobby gratuit (750h/mois, suffisant pour un service)
> - **Docker Hub** : Repositories publics gratuits
> - **GitHub Actions** : 2000 minutes gratuites/mois
> - **PostgreSQL (Render)** : Inclus dans le plan gratuit (1GB stockage)
>
> Pour un projet en production avec trafic réel, il faudrait environ **7-15€/mois** (Render Professional)."

---

**Q8 : Comment gérez-vous les migrations de base de données en production ?**

> "Les migrations TypeORM sont **versionnées** dans le code (`backend/src/migrations/`).
>
> **Processus de déploiement :**
>
> 1. Code mergé dans `main`
> 2. Tag créé (`v1.1.0`)
> 3. Images Docker buildées avec la nouvelle migration
> 4. **Avant de démarrer le backend** :
>    ```bash
>    docker exec backend npm run migration:run
>    ```
> 5. Backend démarre avec le nouveau schéma
>
> TypeORM garde une trace dans la table `migrations` pour éviter de rejouer les mêmes."

---

**Q9 : Que se passe-t-il si le backend tombe ?**

> "Render a plusieurs mécanismes de **auto-recovery** :
>
> 1. **Health checks HTTP** :
>    - Toutes les 30 secondes, Render appelle `/api/health`
>    - Si 3 checks consécutifs échouent → redémarrage automatique
>
> 2. **Crash detection** :
>    - Si le processus Node.js crash → redémarrage immédiat (< 10s)
>
> 3. **Zero-downtime deployments** :
>    - Render garde l'ancienne version active pendant le déploiement de la nouvelle
>    - Bascule seulement quand la nouvelle version est healthy
>
> 4. **Rollback facile** :
>    - On peut revenir à un déploiement précédent en 1 clic
>
> Temps de downtime moyen : **< 30 secondes** en cas de crash."

---

**Q10 : Le frontend fonctionne comment en offline ?**

> "Le frontend est une **PWA** (Progressive Web App) avec un Service Worker.
>
> **Stratégie de cache :**
> 1. **Assets statiques** (HTML, CSS, JS) : Précachés avec Workbox
> 2. **Données utilisateur** : Stockées dans IndexedDB (tasks, boards, etc.)
> 3. **API calls** : Interceptés par le Service Worker
>    - Si online → requête normale
>    - Si offline → lecture depuis IndexedDB
>
> **Synchronisation :**
> - Quand l'utilisateur revient online, les données locales sont envoyées au backend
> - Résolution de conflits (last-write-wins)
>
> On a des **tests E2E** qui simulent une perte de connexion pour vérifier que tout fonctionne."

---

# ⏱️ TIMING RÉCAPITULATIF

| Section | Durée | Timing cumulé |
|---------|-------|---------------|
| Intro API | 15s | 0:15 |
| Test 1: Register | 30s | 0:45 |
| Test 2: Login | 30s | 1:15 |
| Test 3: Create Board | 30s | 1:45 |
| Test 4: Get Boards | 20s | 2:05 |
| Test 5: Create Column | 30s | 2:35 |
| Test 6: Create Task | 30s | 3:05 |
| Test 7: Update (PATCH) | 20s | 3:25 |
| Test 8: Erreurs | 15s | 3:40 |
| Résumé API | 15s | **3:55** |
| **TOTAL PARTIE 3** | | **~4 min** |
|||||
| Intro DevOps | 30s | 4:25 |
| GitHub Actions overview | 15s | 4:40 |
| Workflow CI | 30s | 5:10 |
| Workflow Docker Publish | 45s | 5:55 |
| GitHub Secrets | 30s | 6:25 |
| Résumé DevOps | 30s | **6:55** |
| **TOTAL PARTIE 4** | | **~3 min** |
|||||
| Architecture déploiement | 30s | 7:25 |
| Netlify | 30s | 7:55 |
| Secrets & Vars | 40s | 8:35 |
| GitHub Releases | 30s | 9:05 |
| Monitoring | 20s | 9:25 |
| Résumé Déploiement | 10s | **9:35** |
| **TOTAL PARTIE 4bis** | | **~2 min** |
|||||
| **TOTAL AMINE** | | **~9-10 min** |

**Note :** La partie 4bis (Déploiement) est **bonus** si il reste du temps. Partie essentielle = API (4 min) + DevOps (3 min) = **7 minutes**.

---

# ✅ CHECKLIST FINALE AVANT MA PARTIE

## Préparation Technique

- [ ] **Laptop chargé** + chargeur
- [ ] **Connexion internet stable** (wifi + hotspot 4G de secours)
- [ ] **Navigateur** : Chrome avec DevTools prêts (F12)
- [ ] **Tabs ouverts** dans l'ordre :
  - [ ] https://galilee-os.netlify.app (app prod, Console DevTools ouverte)
  - [ ] https://github.com/KESHRUD/Galilee-OS/actions
  - [ ] https://github.com/KESHRUD/Galilee-OS/settings/secrets/actions
  - [ ] https://github.com/KESHRUD/Galilee-OS/releases
- [ ] **API localhost** tourne (si démo locale) :
  ```bash
  cd backend && npm run dev
  ```
- [ ] **Copier-coller les fetch()** prêts dans un fichier texte (pour éviter de taper)

## Contenu à Avoir Prêt

- [ ] **Scripts fetch()** dans un fichier `.txt` (copier-coller rapide)
- [ ] **Credentials de test** notés :
  ```
  Email: soutenance@galilee.com
  Password: SoutenanceSAE2025!
  ```
- [ ] **Slides** en backup (PDF sur clé USB)
- [ ] **Vidéo de la démo** en backup (si problème réseau)

## Vérifications 5 min Avant

- [ ] **App prod accessible** : https://galilee-os.netlify.app
- [ ] **API localhost répond** : `curl http://localhost:3000/api/health`
- [ ] **GitHub Actions** : Tous les workflows verts
- [ ] **Docker Hub** : Images accessibles
- [ ] **Console DevTools** propre (clear console)

---

# 🎯 CONSEILS PERSONNELS

## Pendant la Démo API

1. **Aller à un rythme modéré** : Pas trop vite, pas trop lent
2. **Copier-coller les fetch()** : Éviter de taper en direct (erreurs possibles)
3. **Attendre la réponse** : Ne pas passer au suivant avant que le JSON s'affiche
4. **Pointer les valeurs importantes** : `id`, `token`, `statusCode`
5. **Si erreur réseau** : Rester calme, basculer sur la vidéo backup

## Pendant la Démo DevOps

1. **Montrer sans lire** : Pointer les éléments visuels (icônes vertes, durées)
2. **Zoomer si besoin** : Ctrl + molette pour agrandir l'interface GitHub
3. **Ouvrir les logs** : Montre que tu maîtrises (optionnel)
4. **Ne pas s'attarder** : Les workflows sont assez visuels, pas besoin de tout lire

## Gestion du Temps

- **Timer discret** : Avoir un chrono sur le téléphone
- **Si en retard** : Sauter la partie 4bis (Déploiement)
- **Si en avance** : Ajouter des détails sur les secrets ou les releases

---

# 🏆 MESSAGE FINAL

Tu as construit une infrastructure DevOps **de niveau professionnel** !

**Tes atouts uniques :**
- API REST complète et bien structurée
- Pipeline CI/CD 100% automatisé
- Déploiement multi-cloud sécurisé
- Gestion des secrets irréprochable
- Monitoring et observabilité

**Reste confiant**, tu maîtrises ton sujet !

Bon courage pour la soutenance ! 🚀

---

*Document préparé spécifiquement pour Amine BENHAMMADA*  
*Soutenance SAE DDAW - Galilee OS - ING2 2024-2025*
