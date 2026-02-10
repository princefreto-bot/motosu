# 🏗️ MOTOSU AGENCIES — Architecture Complète

## Version 2.0.0 — Architecture Modulaire

---

## 📁 STRUCTURE DES FICHIERS

```
motosu-agencies/
│
├── 📄 server.js                    # Bootstrap minimal (lance l'app)
├── 📄 index.html                   # Shell HTML minimal (charge les modules JS)
├── 📄 package.json                 # Dépendances Node.js
├── 📄 render.yaml                  # Configuration Render.com
├── 📄 .env.example                 # Template variables d'environnement
├── 📄 .gitignore                   # Fichiers exclus de Git
├── 📄 ARCHITECTURE.md              # CE FICHIER
│
├── 📂 src/                         # ══════ BACKEND ══════
│   │
│   ├── 📄 app.js                   # Configuration Express (middlewares, routes, statique)
│   │
│   ├── 📂 config/
│   │   ├── 📄 database.js          # Connexion MongoDB Atlas (MONGO_URI)
│   │   ├── 📄 constants.js         # Constantes (montants, limites, commissions)
│   │   └── 📄 initializer.js       # Données par défaut (admin, tâches, vidéos, config)
│   │
│   ├── 📂 models/                  # Schémas Mongoose
│   │   ├── 📄 User.js              # Utilisateur (nom, email, phone, password, status, earnings...)
│   │   ├── 📄 Video.js             # Vidéo (platform, title, url, videoId, duration, reward)
│   │   ├── 📄 Task.js              # Tâche (type, title, description, reward, content)
│   │   ├── 📄 Formation.js         # Formation (title, description, link, image, category)
│   │   ├── 📄 Withdrawal.js        # Retrait (userId, amount, method, accountNumber, status)
│   │   ├── 📄 Payment.js           # Paiement (userId, amount, screenshot, status)
│   │   ├── 📄 Config.js            # Config dynamique (key/value)
│   │   └── 📄 SystemConfig.js      # Config système (cycle tâches)
│   │
│   ├── 📂 middlewares/
│   │   ├── 📄 auth.js              # Vérification JWT + vérification admin + génération token
│   │   ├── 📄 rateLimiter.js       # 6 limiteurs (api, auth, payment, withdraw, task, admin)
│   │   ├── 📄 security.js          # Helmet, CORS, HPP, anti-scraping, headers sécurité
│   │   └── 📄 validator.js         # Validation inputs (register, login, withdraw, video, formation)
│   │
│   ├── 📂 services/
│   │   ├── 📄 referralService.js   # Distribution commissions 3 niveaux + stats parrainage
│   │   └── 📄 taskService.js       # Cycle pause tâches + validation réponses + complétion
│   │
│   ├── 📂 routes/
│   │   ├── 📄 index.js             # Router principal (agrège toutes les routes)
│   │   ├── 📄 authRoutes.js        # POST /api/register, POST /api/login
│   │   ├── 📄 userRoutes.js        # GET /api/user/:userId, GET /api/user/:userId/dashboard
│   │   ├── 📄 taskRoutes.js        # GET /api/tasks, GET /api/tasks/status, POST /api/tasks/:id/complete
│   │   ├── 📄 videoRoutes.js       # GET /api/videos, POST /api/videos/:id/watch
│   │   ├── 📄 formationRoutes.js   # GET /api/formations
│   │   ├── 📄 referralRoutes.js    # GET /api/referrals/:userId
│   │   ├── 📄 withdrawalRoutes.js  # POST /api/withdraw, GET /api/withdrawals/user/:userId
│   │   ├── 📄 paymentRoutes.js     # POST /api/payment/proof, GET/POST /api/payment/notify|return|cancel
│   │   ├── 📄 adminRoutes.js       # Toutes les routes /api/admin/*
│   │   └── 📄 configRoutes.js      # GET /api/config
│   │
│   └── 📂 utils/
│       ├── 📄 helpers.js           # Utilitaires (codes, dates, similarité, YouTube/TikTok IDs)
│       └── 📄 responseHandler.js   # Réponses standardisées (success, error, notFound, etc.)
│
├── 📂 public/                      # ══════ FRONTEND ══════
│   │
│   ├── 📂 css/
│   │   └── 📄 styles.css           # Styles (toast, nav, cards, buttons, inputs, modals, tasks, vidéos)
│   │
│   └── 📂 js/
│       ├── 📄 core.js              # State global, API calls, toast, helpers d'affichage, renderNav
│       ├── 📄 pages.js             # 18 templates de pages (login, register, dashboard, admin, etc.)
│       ├── 📄 tasks.js             # Tâches interactives (sondage, vérification, classification, transcription)
│       ├── 📄 videos.js            # Lecteur vidéo YouTube/TikTok avec timer et progression
│       ├── 📄 admin.js             # Panel admin (8 onglets, CRUD, config)
│       └── 📄 app.js               # Navigation, événements, init, sécurité anti-copie
│
└── (pas de dossier views/ — tout est SPA via les templates JS)
```

---

## 🔌 API ENDPOINTS

### 🔐 Authentification
| Méthode | Route | Description | Rate Limit |
|---------|-------|-------------|------------|
| `POST` | `/api/register` | Inscription utilisateur | 5 req/15min |
| `POST` | `/api/login` | Connexion (SHA256→bcrypt auto-migration) | 5 req/15min |

### 👤 Utilisateur
| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/api/user/:userId` | Profil utilisateur |
| `GET` | `/api/user/:userId/dashboard` | Dashboard avec stats |

### 📋 Tâches
| Méthode | Route | Description | Rate Limit |
|---------|-------|-------------|------------|
| `GET` | `/api/tasks` | Toutes les tâches actives | 30 req/15min |
| `GET` | `/api/tasks/status` | Statut du cycle (actif/pause) | 30 req/15min |
| `GET` | `/api/tasks/daily/:userId` | Tâches disponibles pour un utilisateur | 30 req/15min |
| `POST` | `/api/tasks/:taskId/complete` | Compléter une tâche | 30 req/15min |

### 🎬 Vidéos
| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/api/videos` | Toutes les vidéos |
| `POST` | `/api/videos/:videoId/watch` | Marquer vidéo comme vue |

### 📚 Formations
| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/api/formations` | Formations actives |
| `GET` | `/api/formations/:id` | Formation spécifique |

### 👥 Parrainage
| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/api/referrals/:userId` | Stats parrainage 3 niveaux |

### 💰 Retraits
| Méthode | Route | Description | Rate Limit |
|---------|-------|-------------|------------|
| `POST` | `/api/withdraw` | Demander un retrait | 5 req/1h |
| `GET` | `/api/withdrawals/user/:userId` | Historique retraits | - |

### 💳 Paiement
| Méthode | Route | Description | Rate Limit |
|---------|-------|-------------|------------|
| `POST` | `/api/payment/proof` | Envoyer preuve de paiement | 3 req/1h |
| `GET` | `/api/payment/return` | Retour après paiement → redirige `/` | - |
| `GET` | `/api/payment/cancel` | Annulation → redirige `/` | - |
| `GET/POST` | `/api/payment/notify` | Webhook notification paiement | - |

### ⚙️ Configuration
| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/api/config` | Config publique (numéros paiement, montant abo) |

### 🔧 Admin
| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/api/admin/stats` | Statistiques globales |
| `GET` | `/api/admin/pending` | Utilisateurs en attente |
| `GET` | `/api/admin/users` | Tous les utilisateurs |
| `POST` | `/api/admin/validate/:userId` | Valider un compte |
| `POST` | `/api/admin/reject/:userId` | Refuser un compte |
| `GET` | `/api/admin/withdrawals` | Toutes les demandes de retrait |
| `POST` | `/api/admin/withdraw/approve/:id` | Approuver un retrait |
| `POST` | `/api/admin/withdraw/reject/:id` | Refuser un retrait (remboursement auto) |
| `GET` | `/api/admin/videos` | Toutes les vidéos |
| `POST` | `/api/admin/videos` | Ajouter une vidéo |
| `DELETE` | `/api/admin/videos/:id` | Supprimer une vidéo |
| `GET` | `/api/admin/tasks` | Toutes les tâches |
| `PUT` | `/api/admin/tasks/:id` | Modifier une tâche (activer/désactiver) |
| `DELETE` | `/api/admin/tasks/:id` | Supprimer une tâche |
| `POST` | `/api/admin/tasks/cycle` | Configurer le cycle pause |
| `GET` | `/api/admin/formations` | Toutes les formations |
| `POST` | `/api/admin/formations` | Ajouter une formation |
| `DELETE` | `/api/admin/formations/:id` | Supprimer une formation |
| `GET` | `/api/admin/payments` | Tous les paiements |
| `GET` | `/api/admin/config` | Configuration admin |
| `POST` | `/api/admin/config/payment-numbers` | Modifier numéros de paiement |

### 🏥 Santé
| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/api/health` | Vérification serveur actif |

---

## 🗄️ MODÈLES MONGODB

### User (Collection: `users`)
```javascript
{
  name: String,              // Nom complet
  email: String,             // Email unique, lowercase
  phone: String,             // Téléphone
  password: String,          // Hash bcrypt (migré depuis SHA256)
  status: String,            // 'pending' | 'pending_payment' | 'validated' | 'rejected'
  isAdmin: Boolean,          // false par défaut
  balance: Number,           // Solde fixe (4000)
  earnings: Number,          // Gains accumulés
  referralCode: String,      // Code unique (MOT + 5 chars)
  referredBy: ObjectId,      // Ref vers User (parrain)
  completedTasks: [String],  // IDs des tâches complétées
  watchedVideos: [String],   // IDs des vidéos regardées
  tasksCompletedToday: [String], // Tâches du jour
  lastTaskDate: String,      // Date dernière tâche (YYYY-MM-DD)
  subscriptionDate: Date,    // Date de validation
  paymentProof: {            // Preuve de paiement
    screenshot: String,      // Base64 de l'image
    transactionId: String,
    phoneUsed: String,
    submittedAt: Date
  }
}
```

### Video (Collection: `videos`)
```javascript
{
  platform: String,    // 'youtube' | 'tiktok'
  title: String,
  url: String,         // URL complète
  videoId: String,     // ID extrait
  duration: Number,    // Minutes
  reward: Number       // FCFA
}
```

### Task (Collection: `tasks`)
```javascript
{
  type: String,        // 'sondage' | 'verification' | 'classification' | 'transcription'
  title: String,
  description: String,
  reward: Number,      // FCFA
  content: Mixed,      // Questions, items, texte selon le type
  isActive: Boolean
}
```

### Formation (Collection: `formations`)
```javascript
{
  title: String,
  description: String,
  link: String,        // URL externe
  image: String,       // Base64 ou URL
  category: String,    // 'Général', etc.
  isActive: Boolean
}
```

### Withdrawal (Collection: `withdrawals`)
```javascript
{
  userId: ObjectId,
  userName: String,
  userPhone: String,
  amount: Number,      // Min 15000 FCFA
  method: String,      // 'moov' | 'mix'
  accountNumber: String,
  accountName: String,
  status: String,      // 'pending' | 'approved' | 'rejected'
  approvedAt: Date
}
```

### Payment (Collection: `payments`)
```javascript
{
  userId: ObjectId,
  userName: String,
  userEmail: String,
  userPhone: String,
  amount: Number,      // 4000 FCFA
  screenshot: String,  // Base64
  transactionId: String,
  phoneUsed: String,
  status: String       // 'pending' | 'validated' | 'rejected'
}
```

### Config (Collection: `configs`)
```javascript
{
  key: String,         // 'paymentNumbers', 'subscriptionAmount', 'minReferralsForWithdraw'
  value: Mixed         // Tableau ou nombre
}
```

### SystemConfig (Collection: `systemconfigs`)
```javascript
{
  key: String,         // 'taskCycle'
  value: {
    startDate: String, // ISO date
    activeDays: Number, // Jours actifs (défaut: 2)
    pauseDays: Number   // Jours de pause (défaut: 3)
  }
}
```

---

## 💰 CONSTANTES MÉTIER

| Constante | Valeur |
|-----------|--------|
| **Abonnement** | 4 000 FCFA |
| **Commission Niveau 1** | 2 000 FCFA |
| **Commission Niveau 2** | 800 FCFA |
| **Commission Niveau 3** | 400 FCFA |
| **Retrait minimum** | 15 000 FCFA |
| **Méthodes retrait** | Moov Money, Mix by Yas |
| **Max tâches/jour** | 10 |
| **Cycle tâches** | 2 jours actifs, 3 jours pause |
| **Vidéo min visionnage** | 80% de la durée |
| **Vidéo gain/minute** | 5 FCFA |
| **JWT expiration** | 30 jours |
| **Slogan** | "Partagez, Gagnez, Grandissez ensemble" |

---

## 🔐 SÉCURITÉ

### Backend
| Protection | Implémentation |
|------------|----------------|
| **Mots de passe** | bcrypt (salt 10), migration auto SHA256→bcrypt |
| **Authentification** | JWT HS256, expiration 30 jours |
| **Rate Limiting** | 6 limiteurs différenciés (auth: 5/15min, API: 100/15min, etc.) |
| **Headers** | Helmet (HSTS, noSniff, XSS, frameGuard, referrerPolicy) |
| **CORS** | Origins autorisées uniquement |
| **HPP** | Protection pollution paramètres HTTP |
| **Anti-scraping** | Blocage agents (curl, wget, scrapy, selenium, puppeteer...) |
| **Validation** | express-validator + sanitisation anti-injection |
| **Cache API** | no-store, no-cache sur toutes les routes API |

### Frontend
| Protection | Implémentation |
|------------|----------------|
| **Anti clic-droit** | `contextmenu` bloqué |
| **Anti sélection** | `selectstart` bloqué (sauf inputs) |
| **Anti copie** | `copy` bloqué (sauf inputs) |
| **Anti Ctrl+U/S** | Raccourcis bloqués |
| **Anti drag** | `dragstart` bloqué |
| **CSP** | Meta tag restrictif |

---

## 🎨 FRONTEND — PAGES

| Page | Route JS | Description |
|------|----------|-------------|
| `login` | navigate('login') | Formulaire + liens légaux + slogan |
| `register` | navigate('register') | Inscription avec code parrain |
| `subscription` | navigate('subscription') | Offre 4000 FCFA + avantages |
| `pending` | navigate('pending') | Compte inactif + numéros paiement + upload preuve |
| `dashboard` | navigate('dashboard') | Solde bleu + Gains orange + stats + actions rapides |
| `tasks` | navigate('tasks') | Liste tâches + cycle pause + progression |
| `videos` | navigate('videos') | Liste vidéos + lecteur embed + timer |
| `formations` | navigate('formations') | Liste formations avec images |
| `referrals` | navigate('referrals') | Code + lien + 3 niveaux + filleuls |
| `withdraw` | navigate('withdraw') | Formulaire Moov/Mix + historique |
| `admin` | navigate('admin') | Panel admin 8 onglets |
| `about` | navigate('about') | Texte À propos |
| `terms` | navigate('terms') | Conditions d'utilisation |
| `privacy` | navigate('privacy') | Politique de confidentialité |
| `legal` | navigate('legal') | Mentions légales |
| `refund` | navigate('refund') | Politique de remboursement |
| `security` | navigate('security') | Sécurité & Paiements |
| `contact` | navigate('contact') | Contact & Support + FAQ |

---

## 🔧 ADMIN — 8 ONGLETS

| Onglet | Fonctionnalités |
|--------|-----------------|
| **📊 Stats** | Total utilisateurs, actifs, en attente, retraits, vidéos, tâches, formations |
| **⏳ En attente** | Liste comptes pending + preview preuve paiement + valider/refuser |
| **👥 Utilisateurs** | Liste tous les users + statuts + stats |
| **💸 Retraits** | Demandes de retrait + approuver/refuser (remboursement auto si refus) |
| **🎬 Vidéos** | Ajouter YouTube/TikTok + supprimer |
| **📚 Formations** | Ajouter avec image/lien + supprimer |
| **📋 Tâches** | Cycle pause (activer/désactiver) + activer/désactiver tâches individuelles |
| **⚙️ Config** | Modifier numéros de paiement (opérateur, numéro, nom) |

---

## 🌐 VARIABLES D'ENVIRONNEMENT (Render)

| Variable | Description | Exemple |
|----------|-------------|---------|
| `MONGO_URI` | URI MongoDB Atlas | `mongodb+srv://user:pass@cluster.mongodb.net/motosu` |
| `JWT_SECRET` | Clé secrète JWT | `motosu-secret-key-2024-production-secure` |
| `NODE_ENV` | Environnement | `production` |
| `PORT` | Port (auto par Render) | `3000` |

---

## 📱 COMPTE ADMIN PAR DÉFAUT

| Champ | Valeur |
|-------|--------|
| **Email** | `admin@motosu.com` |
| **Mot de passe** | `admin123` |
| **Statut** | `validated` |
| **isAdmin** | `true` |
| **Code parrainage** | `ADMIN001` |

---

## 🚀 DÉPLOIEMENT

### Commandes Git
```bash
git add .
git commit -m "Description"
git push
```

### Render.yaml
```yaml
services:
  - type: web
    name: motosu
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    healthCheckPath: /api/health
```

### URL Production
```
https://motosu.onrender.com
```

---

## 📋 10 TÂCHES PAR DÉFAUT

| # | Type | Titre | Récompense |
|---|------|-------|------------|
| 1 | Sondage | Enquête sur les habitudes de paiement mobile | 25 FCFA |
| 2 | Sondage | Étude sur l'utilisation des réseaux sociaux | 35 FCFA |
| 3 | Vérification | Vérification d'adresses email professionnelles | 15 FCFA |
| 4 | Classification | Classification de produits e-commerce | 20 FCFA |
| 5 | Transcription | Transcription d'un message vocal professionnel | 40 FCFA |
| 6 | Sondage | Enquête sur les services bancaires mobiles | 45 FCFA |
| 7 | Vérification | Vérification de numéros de téléphone | 15 FCFA |
| 8 | Classification | Classification de contenus digitaux | 20 FCFA |
| 9 | Sondage | Étude sur les habitudes alimentaires | 30 FCFA |
| 10 | Transcription | Transcription d'un slogan commercial | 25 FCFA |

---

## 🎬 2 VIDÉOS PAR DÉFAUT

| Plateforme | Titre | Durée | Récompense |
|------------|-------|-------|------------|
| YouTube | Comment réussir dans le marketing digital en Afrique | 3 min | 15 FCFA |
| YouTube | Les secrets de l'entrepreneuriat africain | 2 min | 10 FCFA |

---

## 🔄 CYCLE DES TÂCHES

```
Jour 1-2 : Tâches ACTIVES (max 10/jour)
Jour 3-5 : PAUSE (message affiché)
Jour 6-7 : Tâches ACTIVES
Jour 8-10 : PAUSE
... (cycle continu)
```

---

## 📞 NUMÉROS DE PAIEMENT PAR DÉFAUT

| Opérateur | Numéro | Nom |
|-----------|--------|-----|
| Moov Money | +225 01 01 01 01 01 | MOTOSU AGENCIES |
| Orange Money | +225 07 07 07 07 07 | MOTOSU AGENCIES |
| MTN Money | +225 05 05 05 05 05 | MOTOSU AGENCIES |
| Wave | +225 01 02 03 04 05 | MOTOSU AGENCIES |

*(Modifiables via Admin > Config)*

---

## ⚠️ RÈGLES NON NÉGOCIABLES

1. ❌ **NE PAS MODIFIER** la connexion MongoDB (database.js)
2. ❌ **NE PAS MODIFIER** les noms de collections
3. ❌ **NE PAS EXPOSER** les clés API côté client
4. ❌ **NE PAS SUPPRIMER** les protections de sécurité
5. ✅ **TOUJOURS** utiliser bcrypt pour les nouveaux mots de passe
6. ✅ **TOUJOURS** valider les entrées utilisateur
7. ✅ **TOUJOURS** tester sur Render après modification
8. ✅ **TOUJOURS** mettre à jour ce fichier après changement d'architecture

---

## 📅 HISTORIQUE DES PHASES

| Phase | Description | Statut |
|-------|-------------|--------|
| PHASE 1 | Analyse architecture | ✅ Terminée |
| PHASE 2 | Suppression + Recréation modulaire | ✅ Terminée |
| PHASE 3 | Test backend + MongoDB | ✅ Terminée |
| PHASE 4 | MoneyFusion | ⏳ En attente des clés API |
| PHASE 5 | Pages légales + Sécurité | ✅ Terminée |
| PHASE 6 | Sécurité avancée | ✅ Terminée |
| PHASE 7 | Nettoyage final | ✅ Terminée |

---

*Dernière mise à jour : Phase 7 — Architecture modulaire complète*
