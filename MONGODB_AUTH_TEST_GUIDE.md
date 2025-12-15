# 🔐 MongoDB + Authentication - Guide de Test Complet

## 1️⃣ Register (Inscription)

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"user@test.com\",\"password\":\"password123\",\"name\":\"User Test\"}"
```

**Réponse attendue:**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": "6753...",
    "email": "user@test.com",
    "name": "User Test"
  }
}
```

**⚠️ COPIEZ LE TOKEN!**

---

## 2️⃣ Login (Connexion)

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"user@test.com\",\"password\":\"password123\"}"
```

**Réponse attendue:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1...",
  "user": {...}
}
```

---

## 3️⃣ Get Current User (avec token)

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"
```

---

## 4️⃣ Create Task (PROTÉGÉ - nécessite token)

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI" \
  -d "{\"title\":\"Ma tâche avec auth\",\"status\":\"todo\",\"priority\":\"high\"}"
```

**Réponse attendue:**
```json
{
  "data": {
    "title": "Ma tâche avec auth",
    "status": "todo",
    "priority": "high",
    "createdBy": "6753...",  ← ID de l'utilisateur!
    "_id": "6753...",
    ...
  }
}
```

---

## 5️⃣ Get All Tasks (PROTÉGÉ)

```bash
curl -X GET http://localhost:3000/api/tasks \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI"
```

Retourne seulement VOS tâches (filtrées par `createdBy`)

---

## 6️⃣ Test: Access sans token (doit ÉCHOUER)

```bash
curl -X GET http://localhost:3000/api/tasks
```

**Réponse attendue:**
```json
{
  "error": "No token provided"
}
```

---

## 📊 Vérification dans MongoDB Compass

1. Connectez-vous à `mongodb://localhost:27017`
2. Sélectionnez la base `kanban-board`
3. Collections à vérifier:

### Collection `users`:
```json
{
  "_id": ObjectId("..."),
  "email": "user@test.com",
  "password": "$2a$10$...", ← Hashé!
  "name": "User Test",
  "createdAt": "...",
  "updatedAt": "..."
}
```

### Collection `tasks`:
```json
{
  "_id": ObjectId("..."),
  "title": "Ma tâche avec auth",
  "status": "todo",
  "priority": "high",
  "createdBy": ObjectId("..."), ← Référence à l'utilisateur!
  "tags": [],
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

## ✅ Checklist de Validation

- [ ] ✅ Inscription fonctionne (register)
- [ ] ✅ Token JWT retourné
- [ ] ✅ Connexion fonctionne (login)
- [ ] ✅ `/me` retourne l'utilisateur connecté
- [ ] ✅ Création de tâche nécessite un token
- [ ] ✅ Tâche liée à `createdBy`
- [ ] ✅ GET tasks retourne seulement les tâches de l'utilisateur
- [ ] ✅ Accès sans token est refusé (401)
- [ ] ✅ Mot de passe hashé dans MongoDB
- [ ] ✅ Les collections users et tasks existent

---

## 🎯 Prochaine étape: Frontend

Une fois que le backend est validé, on créera:
- Page Login/Register
- Stockage du token (localStorage)
- Intercepteur HTTP pour ajouter le token
- Routes protégées
- UI de connexion/déconnexion
