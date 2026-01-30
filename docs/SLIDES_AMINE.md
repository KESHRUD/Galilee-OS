# 🎓 SLIDES AMINE - API REST & DEVOPS

---

## SLIDE 1 : API REST - INTRODUCTION

```
╔════════════════════════════════════════════════════════╗
║                                                        ║
║            🔌 API REST - GALILEE OS                   ║
║                                                        ║
║  Présenté par : BENHAMMADA Ahmed Amine                ║
║                                                        ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  ✅ 20 routes HTTP (GET, POST, PUT/PATCH, DELETE)     ║
║  ✅ Express + TypeScript                              ║
║  ✅ JWT Authentication                                ║
║  ✅ Validation & Error Handling                       ║
║  ✅ Documentation OpenAPI/Swagger                     ║
║                                                        ║
║  📍 Base URL:                                          ║
║     http://localhost:3000/api (dev)                   ║
║     https://galilee-api.render.com/api (prod)         ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

---

## SLIDE 2 : ENDPOINTS API (20 ROUTES)

```
╔════════════════════════════════════════════════════════╗
║          API REST - 20 ROUTES                          ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  🔐 AUTHENTICATION (6 routes)                          ║
║  POST   /api/auth/register                            ║
║  POST   /api/auth/login                               ║
║  POST   /api/auth/refresh                             ║
║  POST   /api/auth/logout                              ║
║  POST   /api/auth/reset-password                      ║
║  POST   /api/auth/verify-reset-token                  ║
║                                                        ║
║  📋 BOARDS (5 routes)                                  ║
║  GET    /api/boards                                   ║
║  POST   /api/boards                                   ║
║  GET    /api/boards/:id                               ║
║  PUT    /api/boards/:id                               ║
║  DELETE /api/boards/:id                               ║
║                                                        ║
║  📂 COLUMNS (3 routes)                                 ║
║  POST   /api/boards/:id/columns                       ║
║  PUT    /api/columns/:id                              ║
║  DELETE /api/columns/:id                              ║
║                                                        ║
║  ✅ TASKS (6 routes)                                   ║
║  POST   /api/columns/:id/tasks                        ║
║  GET    /api/tasks/:id                                ║
║  PATCH  /api/tasks/:id                                ║
║  PUT    /api/tasks/:id                                ║
║  DELETE /api/tasks/:id                                ║
║  POST   /api/tasks/:id/move                           ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

---

## SLIDE 3 : EXEMPLE REQUÊTE/RÉPONSE

```
╔════════════════════════════════════════════════════════╗
║        EXEMPLE: POST /api/auth/register                ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  📤 REQUEST:                                           ║
║  POST http://localhost:3000/api/auth/register         ║
║  Content-Type: application/json                       ║
║                                                        ║
║  {                                                     ║
║    "email": "student@galilee.com",                    ║
║    "password": "SecurePass123!"                       ║
║  }                                                     ║
║                                                        ║
║  📥 RESPONSE 201 Created:                              ║
║                                                        ║
║  {                                                     ║
║    "message": "User registered successfully",         ║
║    "user": {                                          ║
║      "id": "uuid-abc-123",                            ║
║      "email": "student@galilee.com",                  ║
║      "role": "student"                                ║
║    },                                                 ║
║    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5..."       ║
║  }                                                     ║
║                                                        ║
║  🔐 JWT Token inclus pour authentification            ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

---

## SLIDE 4 : GESTION D'ERREURS

```
╔════════════════════════════════════════════════════════╗
║          GESTION D'ERREURS - FORMAT STANDARD           ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  Toutes les erreurs suivent ce format:                ║
║                                                        ║
║  {                                                     ║
║    "error": "Error Type",                             ║
║    "message": "Human-readable description",           ║
║    "statusCode": 400                                  ║
║  }                                                     ║
║                                                        ║
║  CODES D'ERREUR HTTP:                                  ║
║                                                        ║
║  400 - Bad Request                                    ║
║      ↳ Données invalides, validation échouée          ║
║                                                        ║
║  401 - Unauthorized                                   ║
║      ↳ Token manquant, invalide, ou expiré            ║
║                                                        ║
║  403 - Forbidden                                      ║
║      ↳ Permissions insuffisantes (admin requis)       ║
║                                                        ║
║  404 - Not Found                                      ║
║      ↳ Ressource inexistante                          ║
║                                                        ║
║  500 - Internal Server Error                          ║
║      ↳ Erreur serveur (base de données, etc.)         ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

---

## SLIDE 5 : PIPELINE CI/CD

```
╔════════════════════════════════════════════════════════╗
║         PIPELINE CI/CD - GITHUB ACTIONS                ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║              git push origin main                      ║
║                      │                                 ║
║                      ▼                                 ║
║          ┌─────────────────────┐                       ║
║          │  WORKFLOW 1: CI     │                       ║
║          │  ✅ ESLint          │                       ║
║          │  ✅ Tests unitaires │                       ║
║          │  ✅ Tests E2E        │                       ║
║          │  ✅ Build TypeScript│                       ║
║          │  ⏱️  ~36 secondes   │                       ║
║          └─────────┬───────────┘                       ║
║                    │                                   ║
║                    ▼                                   ║
║          ┌─────────────────────┐                       ║
║          │  WORKFLOW 2: Docker │                       ║
║          │  Build              │                       ║
║          │  ✅ Backend image   │                       ║
║          │  ✅ Frontend image  │                       ║
║          │  ✅ Cache layers    │                       ║
║          │  ⏱️  ~1m30          │                       ║
║          └─────────┬───────────┘                       ║
║                    │                                   ║
║                    ▼ (sur tag v*.*.*)                  ║
║          ┌─────────────────────┐                       ║
║          │  WORKFLOW 3: Publish│                       ║
║          │  ✅ Tag version     │                       ║
║          │  ✅ Push Docker Hub │                       ║
║          │  ✅ GitHub Release  │                       ║
║          │  ⏱️  ~44 secondes   │                       ║
║          └─────────────────────┘                       ║
║                                                        ║
║  📊 186 workflow runs - 100% success ✅                ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

---

## SLIDE 6 : GITHUB ACTIONS - WORKFLOW CI

```
╔════════════════════════════════════════════════════════╗
║           WORKFLOW CI - CONTINUOUS INTEGRATION         ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  Déclencheurs:                                         ║
║    - Push sur n'importe quelle branche                ║
║    - Pull Request vers main ou develop                ║
║                                                        ║
║  Jobs en parallèle:                                    ║
║                                                        ║
║  ┌───────────────────────────────────────┐            ║
║  │  JOB 1: Backend Tests & Lint          │            ║
║  │  ├─ npm install                       │            ║
║  │  ├─ npm run lint (ESLint)             │            ║
║  │  ├─ npm run test (Jest)               │            ║
║  │  └─ npm run build (TypeScript)        │            ║
║  └───────────────────────────────────────┘            ║
║                                                        ║
║  ┌───────────────────────────────────────┐            ║
║  │  JOB 2: Frontend Tests & Lint         │            ║
║  │  ├─ npm install                       │            ║
║  │  ├─ npm run lint (ESLint + React)     │            ║
║  │  ├─ npx playwright test (E2E)         │            ║
║  │  └─ npm run build (Vite)              │            ║
║  └───────────────────────────────────────┘            ║
║                                                        ║
║  ┌───────────────────────────────────────┐            ║
║  │  JOB 3: Security Audit                │            ║
║  │  ├─ npm audit (backend)               │            ║
║  │  └─ npm audit (frontend)              │            ║
║  └───────────────────────────────────────┘            ║
║                                                        ║
║  ✅ Si un test échoue → PR bloquée                     ║
║  ✅ Durée moyenne : 36 secondes                        ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

---

## SLIDE 7 : GITHUB SECRETS

```
╔════════════════════════════════════════════════════════╗
║         GITHUB SECRETS - SÉCURITÉ                      ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  🔐 SECRETS CONFIGURÉS:                                ║
║                                                        ║
║  ┌─────────────────────────────────────────────┐      ║
║  │  DOCKER_HUB_USERNAME                        │      ║
║  │  Value: mouenis                             │      ║
║  │  Usage: Login Docker Hub dans workflows    │      ║
║  └─────────────────────────────────────────────┘      ║
║                                                        ║
║  ┌─────────────────────────────────────────────┐      ║
║  │  DOCKER_HUB_TOKEN                           │      ║
║  │  Value: [encrypted] ••••••••••••••••        │      ║
║  │  Usage: Authentication Docker Hub           │      ║
║  │  Type: Personal Access Token (PAT)          │      ║
║  └─────────────────────────────────────────────┘      ║
║                                                        ║
║  SÉCURITÉ:                                             ║
║  ✅ Chiffrés par GitHub (AES-256)                      ║
║  ✅ Jamais exposés dans les logs                       ║
║  ✅ Masqués automatiquement si affichés                ║
║  ✅ Accessibles uniquement par workflows autorisés     ║
║  ✅ Rotation possible sans redéployer                  ║
║                                                        ║
║  ❌ Aucun secret dans le code source                   ║
║  ❌ Pas de .env commité dans Git                       ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

---

## SLIDE 8 : INFRASTRUCTURE CLOUD

```
╔════════════════════════════════════════════════════════╗
║         ARCHITECTURE DE DÉPLOIEMENT                    ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║   ┌──────────────┐         ┌──────────────┐           ║
║   │   NETLIFY    │         │    RENDER    │           ║
║   │  (Frontend)  │────────▶│  (Backend)   │           ║
║   │              │  HTTPS  │              │           ║
║   │ React PWA    │         │ Express API  │           ║
║   │ CDN Global   │         │ + PostgreSQL │           ║
║   │ Service      │         │ Auto-scaling │           ║
║   │ Worker       │         │              │           ║
║   └──────────────┘         └──────────────┘           ║
║         │                        │                    ║
║         │                        │                    ║
║      Utilisateur          ┌──────▼──────┐             ║
║         │                 │  Docker Hub │             ║
║         │                 │  (Images)   │             ║
║         └─────────────────┤  Public     │             ║
║                           └─────────────┘             ║
║                                                        ║
║  AVANTAGES:                                            ║
║  ✅ CDN global (latence < 100ms)                       ║
║  ✅ HTTPS automatique (SSL gratuit)                    ║
║  ✅ Auto-scaling (trafic élevé)                        ║
║  ✅ Health checks (redémarrage auto)                   ║
║  ✅ Coût: 0€ (plans gratuits)                          ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

---

## SLIDE 9 : GESTION DES SECRETS (3 NIVEAUX)

```
╔════════════════════════════════════════════════════════╗
║         SECRETS - 3 NIVEAUX DE SÉCURITÉ                ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  🔐 NIVEAU 1: GITHUB SECRETS (CI/CD)                   ║
║  ┌──────────────────────────────────────────────┐     ║
║  │  DOCKER_HUB_USERNAME  = mouenis              │     ║
║  │  DOCKER_HUB_TOKEN     = [encrypted] ••••••   │     ║
║  └──────────────────────────────────────────────┘     ║
║  Usage: Workflows GitHub Actions                      ║
║                                                        ║
║  🌐 NIVEAU 2: NETLIFY ENV (Frontend)                   ║
║  ┌──────────────────────────────────────────────┐     ║
║  │  VITE_GEMINI_API_KEY  = [encrypted] ••••••   │     ║
║  │  VITE_API_URL         = https://...render... │     ║
║  └──────────────────────────────────────────────┘     ║
║  Usage: Build-time frontend (injecté dans bundle)     ║
║                                                        ║
║  ☁️  NIVEAU 3: RENDER ENV (Backend)                    ║
║  ┌──────────────────────────────────────────────┐     ║
║  │  DATABASE_URL         = postgresql://[enc]   │     ║
║  │  JWT_SECRET           = [encrypted] ••••••   │     ║
║  │  JWT_REFRESH_SECRET   = [encrypted] ••••••   │     ║
║  │  NODE_ENV             = production           │     ║
║  └──────────────────────────────────────────────┘     ║
║  Usage: Runtime backend (process.env)                 ║
║                                                        ║
║  ✅ Aucun secret dans le code source                   ║
║  ✅ Chiffrement AES-256                                ║
║  ✅ Rotation sans redéploiement                        ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

---

## SLIDE 10 : GITHUB RELEASES & VERSIONING

```
╔════════════════════════════════════════════════════════╗
║         GITHUB RELEASES - VERSIONING SÉMANTIQUE        ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  PROCESSUS AUTOMATISÉ:                                 ║
║                                                        ║
║  1️⃣ Développeur crée un tag:                         ║
║     git tag -a v1.0.0 -m "Release v1.0.0"             ║
║     git push origin v1.0.0                            ║
║                                                        ║
║  2️⃣ GitHub Actions détecte le tag                     ║
║                                                        ║
║  3️⃣ Workflow "Docker Publish" s'exécute:              ║
║     ├─ Build backend:1.0.0                            ║
║     ├─ Build frontend:1.0.0                           ║
║     ├─ Push vers Docker Hub                           ║
║     └─ Create GitHub Release                          ║
║                                                        ║
║  4️⃣ Release créée automatiquement avec:               ║
║     ✅ Changelog (commits depuis dernière release)    ║
║     ✅ Instructions de déploiement                     ║
║     ✅ Liens Docker Hub                                ║
║     ✅ Assets (optionnel)                              ║
║                                                        ║
║  VERSIONING SÉMANTIQUE:                                ║
║                                                        ║
║  v MAJOR . MINOR . PATCH                               ║
║    1   .   0   .   0                                   ║
║                                                        ║
║  MAJOR: Breaking changes (incompatible)               ║
║  MINOR: New features (compatible)                     ║
║  PATCH: Bug fixes                                     ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

---

## SLIDE 11 : MONITORING & OBSERVABILITÉ

```
╔════════════════════════════════════════════════════════╗
║         MONITORING & LOGS EN TEMPS RÉEL                ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  📊 NETLIFY (Frontend):                                ║
║  ┌──────────────────────────────────────────────┐     ║
║  │  ✅ Build logs (succès, erreurs, warnings)  │     ║
║  │  ✅ Analytics (visiteurs, pages vues)       │     ║
║  │  ✅ Core Web Vitals (LCP, FID, CLS)         │     ║
║  │  ✅ Bande passante (GB utilisés)            │     ║
║  │  ✅ Deploy previews (PR automatiques)       │     ║
║  └──────────────────────────────────────────────┘     ║
║                                                        ║
║  📊 RENDER (Backend):                                  ║
║  ┌──────────────────────────────────────────────┐     ║
║  │  ✅ Logs applicatifs (console.log)          │     ║
║  │  ✅ Métriques CPU/RAM (temps réel)          │     ║
║  │  ✅ Health checks HTTP (/api/health)        │     ║
║  │  ✅ Database metrics (connections, queries) │     ║
║  │  ✅ Error tracking (Sentry intégrable)      │     ║
║  └──────────────────────────────────────────────┘     ║
║                                                        ║
║  🔄 AUTO-RECOVERY:                                     ║
║  - Health check échoue 3x → Redémarrage auto         ║
║  - Crash détecté → Redémarrage < 30s                  ║
║  - Alertes email en cas d'incident                    ║
║                                                        ║
║  ⏱️  Uptime: 99.9% (SLA Render)                       ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

---

## SLIDE 12 : RÉSUMÉ AMINE

```
╔════════════════════════════════════════════════════════╗
║           RÉSUMÉ - API REST & DEVOPS                   ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  🔌 API REST:                                          ║
║  ✅ 20 routes HTTP (GET/POST/PUT/PATCH/DELETE)        ║
║  ✅ JWT Authentication sécurisée                       ║
║  ✅ Gestion d'erreurs robuste                          ║
║  ✅ TypeScript + Express                               ║
║  ✅ Validation des données                             ║
║                                                        ║
║  🚀 DEVOPS & CI/CD:                                    ║
║  ✅ 3 workflows GitHub Actions automatisés            ║
║  ✅ 43 tests automatiques (100% pass)                 ║
║  ✅ 186 workflow runs (100% success)                  ║
║  ✅ Secrets sécurisés (GitHub/Netlify/Render)         ║
║  ✅ Cache intelligent (builds rapides)                ║
║                                                        ║
║  🌐 DÉPLOIEMENT:                                       ║
║  ✅ Multi-cloud (Netlify + Render)                    ║
║  ✅ CDN global (latence < 100ms)                       ║
║  ✅ HTTPS automatique                                 ║
║  ✅ GitHub Releases automatiques                      ║
║  ✅ Monitoring temps réel                             ║
║  ✅ Coût: 0€                                           ║
║                                                        ║
║  🏆 Infrastructure de niveau professionnel !           ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

---

# 📋 AIDE-MÉMOIRE RAPIDE

## Commandes DevTools à Copier-Coller

### Bloc 1 : Register
```javascript
fetch('http://localhost:3000/api/auth/register', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({email: 'soutenance@galilee.com', password: 'SoutenanceSAE2025!'})}).then(res => res.json()).then(data => {console.log('✅ User:', data); window.token = data.accessToken;});
```

### Bloc 2 : Login
```javascript
fetch('http://localhost:3000/api/auth/login', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({email: 'soutenance@galilee.com', password: 'SoutenanceSAE2025!'})}).then(res => res.json()).then(data => {console.log('✅ Login:', data); window.token = data.accessToken;});
```

### Bloc 3 : Create Board
```javascript
fetch('http://localhost:3000/api/boards', {method: 'POST', headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${window.token}`}, body: JSON.stringify({title: 'SAE DDAW - Soutenance'})}).then(res => res.json()).then(data => {console.log('✅ Board:', data); window.boardId = data.id;});
```

### Bloc 4 : Get Boards
```javascript
fetch('http://localhost:3000/api/boards', {headers: {'Authorization': `Bearer ${window.token}`}}).then(res => res.json()).then(data => console.log('✅ Boards:', data));
```

### Bloc 5 : Create Column
```javascript
fetch(`http://localhost:3000/api/boards/${window.boardId}/columns`, {method: 'POST', headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${window.token}`}, body: JSON.stringify({title: 'To Do', position: 0})}).then(res => res.json()).then(data => {console.log('✅ Column:', data); window.columnId = data.id;});
```

### Bloc 6 : Create Task
```javascript
fetch(`http://localhost:3000/api/columns/${window.columnId}/tasks`, {method: 'POST', headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${window.token}`}, body: JSON.stringify({title: 'Préparer démo API', description: 'Tester endpoints REST', position: 0})}).then(res => res.json()).then(data => {console.log('✅ Task:', data); window.taskId = data.id;});
```

### Bloc 7 : Update Task (PATCH)
```javascript
fetch(`http://localhost:3000/api/tasks/${window.taskId}`, {method: 'PATCH', headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${window.token}`}, body: JSON.stringify({completed: true})}).then(res => res.json()).then(data => console.log('✅ Updated:', data));
```

### Bloc 8 : Test Erreur
```javascript
fetch('http://localhost:3000/api/boards', {headers: {'Authorization': 'Bearer invalid-token-xxx'}}).then(res => res.json()).then(data => console.log('❌ Error:', data));
```

---

# 🎯 CHECKLIST PERSONNELLE

## Avant la Soutenance

- [ ] API backend lancée localement (`npm run dev`)
- [ ] Tester tous les fetch() une fois pour vérifier qu'ils fonctionnent
- [ ] Avoir les commandes copier-collées dans un `.txt`
- [ ] Console DevTools propre (`clear()` avant de commencer)
- [ ] Tabs GitHub ouverts dans le bon ordre
- [ ] Timer préparé (7-10 minutes pour ma partie)

## Pendant ma Partie

- [ ] Parler clairement et pas trop vite
- [ ] Montrer les réponses JSON complètes
- [ ] Expliquer ce qui se passe (ne pas juste exécuter)
- [ ] Pointer les éléments importants (token, IDs, statusCode)
- [ ] Gérer le timing (timer discret sur téléphone)

## Points à NE PAS OUBLIER

- [ ] Mentionner les **20 routes** au total
- [ ] Expliquer JWT vs sessions
- [ ] Montrer la gestion d'erreurs
- [ ] Secrets **chiffrés** et **jamais exposés**
- [ ] **186 workflow runs avec 100% succès**
- [ ] **0€ de coût** d'infrastructure
- [ ] GitHub Release automatique

---

# 💡 ASTUCES PRÉSENTATION

## Si Problème Réseau
- Basculer sur vidéo de démo pré-enregistrée
- Expliquer le code des fetch() au lieu de les exécuter
- Montrer des screenshots des réponses

## Si Dépassement de Temps
- Sauter la partie 4bis (Déploiement)
- Fusionner tests 5+6+7 en un seul exemple rapide
- Aller directement au résumé

## Si Question Difficile
- "Excellente question ! Laissez-moi réfléchir..."
- Être honnête si je ne sais pas
- Proposer de chercher ensemble après la soutenance

---

# 🏆 POINTS FORTS UNIQUES

**Ce qui te distingue :**
1. **Démo live avec DevTools** (pas Postman statique)
2. **186 workflow runs 100% success** (fiabilité prouvée)
3. **3 niveaux de secrets** (sécurité pro)
4. **GitHub Releases automatiques** (DevOps moderne)
5. **Infrastructure 0€** (optimisation des coûts)

**Sois fier de ton travail !** 💪

---

*Slides préparés pour Amine BENHAMMADA*  
*Soutenance SAE DDAW - Galilee OS*
