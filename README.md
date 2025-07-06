# Yalla Extra - Plateforme HORECA

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (version 16 ou supérieure) - [Télécharger ici](https://nodejs.org/)
- **Git** - [Télécharger ici](https://git-scm.com/)
- **Un éditeur de code** (VS Code recommandé) - [Télécharger ici](https://code.visualstudio.com/)

## 🚀 Installation du projet

### 1. Télécharger le projet

```bash
# Cloner le repository (si vous avez Git)
git clone [URL_DU_REPOSITORY]
cd yalla-extra-platform

# OU télécharger le ZIP et extraire dans un dossier
```

### 2. Installer les dépendances

```bash
# Installer les dépendances du frontend (React)
npm install

# Installer les dépendances du backend (Node.js)
npm run install:server
```

### 3. Configuration de l'environnement

Le fichier `.env` est déjà configuré avec votre base de données MongoDB :

```
MONGODB_URI=mongodb+srv://ghaith:ghaith@cluster0.cewyzm1.mongodb.net/YallaExtra?retryWrites=true&w=majority
JWT_SECRET=yalla_extra_jwt_secret_key_2024
JWT_EXPIRE=30d
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
```

## 🔧 Démarrage du projet

### Option 1 : Démarrage séparé (Recommandé pour le développement)

**Terminal 1 - Backend (API) :**
```bash
npm run server:dev
```
Le serveur API sera accessible sur : http://localhost:5000

**Terminal 2 - Frontend (React) :**
```bash
npm run dev
```
L'application web sera accessible sur : http://localhost:3000

### Option 2 : Démarrage simple du backend
```bash
npm run server
```

## 🧪 Tests de fonctionnement

### 1. Tester la connexion à la base de données
Ouvrez votre navigateur et allez sur :
```
http://localhost:5000/api/test
```

Vous devriez voir :
```json
{
  "message": "API Yalla Extra fonctionne correctement!",
  "database": "MongoDB connecté",
  "timestamp": "2024-01-XX..."
}
```

### 2. Tester l'inscription d'un utilisateur

**Avec Postman ou un outil similaire :**

**POST** `http://localhost:5000/api/auth/register`

**Body (JSON) pour un candidat :**
```json
{
  "firstName": "Ahmed",
  "lastName": "Ben Ali",
  "email": "ahmed@example.com",
  "phone": "+216 20 123 456",
  "password": "motdepasse123",
  "userType": "candidate",
  "address": "Tunis, Tunisie",
  "experience": "5 ans dans la restauration",
  "education": "CAP Cuisine"
}
```

**Body (JSON) pour un employeur :**
```json
{
  "firstName": "Fatma",
  "lastName": "Trabelsi",
  "email": "fatma@restaurant.com",
  "phone": "+216 71 123 456",
  "password": "motdepasse123",
  "userType": "employer",
  "address": "Sousse, Tunisie",
  "companyName": "Restaurant Le Méditerranéen",
  "companyType": "Restaurant",
  "position": "Gérant"
}
```

### 3. Tester la connexion

**POST** `http://localhost:5000/api/auth/login`

**Body (JSON) :**
```json
{
  "email": "ahmed@example.com",
  "password": "motdepasse123",
  "userType": "candidate"
}
```

## 📁 Structure du projet

```
yalla-extra-platform/
├── src/                    # Frontend React
│   ├── components/         # Composants réutilisables
│   ├── pages/             # Pages de l'application
│   └── ...
├── server/                # Backend Node.js
│   ├── config/            # Configuration DB
│   ├── models/            # Modèles MongoDB
│   ├── routes/            # Routes API
│   └── server.js          # Serveur principal
├── .env                   # Variables d'environnement
└── package.json           # Dépendances frontend
```

## 🔍 Vérification de l'installation

### Vérifier Node.js
```bash
node --version
# Doit afficher v16.x.x ou supérieur
```

### Vérifier npm
```bash
npm --version
# Doit afficher 8.x.x ou supérieur
```

### Vérifier les dépendances
```bash
# Frontend
npm list --depth=0

# Backend
cd server && npm list --depth=0
```

## 🐛 Résolution des problèmes courants

### Erreur de connexion MongoDB
- Vérifiez que votre adresse IP est autorisée dans MongoDB Atlas
- Vérifiez les identifiants dans le fichier `.env`

### Port déjà utilisé
```bash
# Tuer le processus sur le port 5000
npx kill-port 5000

# Ou changer le port dans .env
PORT=5001
```

### Erreur de dépendances
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install

# Pour le serveur
cd server
rm -rf node_modules package-lock.json
npm install
```

## 📱 Fonctionnalités disponibles

### Frontend (React)
- ✅ Pages d'accueil, concept, services
- ✅ Formulaires d'inscription et connexion
- ✅ Interface responsive
- ✅ Navigation complète

### Backend (API)
- ✅ Authentification JWT
- ✅ Modèles de données complets
- ✅ Routes d'inscription/connexion
- ✅ Connexion MongoDB Atlas

### Base de données
- ✅ Modèles User, Job, Application, Subscription
- ✅ Gestion des candidats et employeurs
- ✅ Système d'abonnements
- ✅ Évaluations et favoris

## 🔄 Prochaines étapes

1. **Tester l'API** avec Postman
2. **Connecter le frontend au backend**
3. **Implémenter les fonctionnalités manquantes**
4. **Ajouter la gestion des fichiers (photos)**
5. **Intégrer le système de paiement**

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans la console
2. Consultez la section "Résolution des problèmes"
3. Vérifiez que tous les prérequis sont installés