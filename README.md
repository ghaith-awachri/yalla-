# Yalla Extra - Plateforme HORECA 🚀

[![CI/CD Pipeline](https://github.com/ghaith-awachri/yalla-/actions/workflows/main.yml/badge.svg)](https://github.com/ghaith-awachri/yalla-/actions/workflows/main.yml)


Yalla Extra est une plateforme moderne de recrutement et de mise en relation pour le secteur **HORECA** (Hotels, Restaurants, Cafés), connectant les établissements avec des talents qualifiés pour des missions en extra ou des postes fixes.

## 🏗️ Structure du Projet (Monorepo)

Le projet est structuré en monorepo pour faciliter le développement et le déploiement :

- **`frontend/`** : Application React + Vite + Tailwind CSS.
- **`backend/`** : API Node.js + Express + MongoDB.
- **`docker-compose.yml`** : Orchestration des conteneurs pour la production.

---

## 📋 Prérequis

- **Node.js** (v20+ recommandé)
- **Docker** & **Docker Compose** (pour le déploiement)
- **MongoDB Atlas** (ou une instance locale)

---

## 🛠️ Installation et Démarrage Local

### 1. Installation initiale
Installez les dépendances à la racine et dans les sous-projets :

```bash
npm install          # Dépendances de l'orchestrateur
npm run install:all  # Dépendances Frontend et Backend
```

### 2. Configuration
Créez un fichier `.env` à la racine du projet (copiez les valeurs depuis `frontend/.env`) :

```env
MONGODB_URI=votre_url_mongodb
JWT_SECRET=votre_secret_jwt
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### 3. Démarrage (Développement)
Lancez les deux serveurs simultanément avec une seule commande :

```bash
npm run dev
```
- **Frontend** : http://localhost:5173
- **Backend** : http://localhost:5000

---

## 🐳 Déploiement avec Docker

Le projet est entièrement conteneurisé pour une mise en production simplifiée.

### Démarrage avec Docker Compose
```bash
# Construire et lancer les conteneurs
docker compose up -d --build
```

- **Application (Production)** : http://localhost:3000
- **API (Production)** : http://localhost:5000

### Architecture Docker
- **Frontend** : Construit via Node.js puis servi par **Nginx** (optimisé).
- **Backend** : Image Node.js Alpine légère.
- **Réseau** : Isolé via `yalla-network`.

---

## 🚀 CI/CD

Le projet utilise **GitHub Actions** pour l'automatisation :
- **CI** : Linting et build automatique à chaque Pull Request.
- **CD** : Build des images Docker et push vers **GitHub Container Registry (GHCR)** lors d'un push sur `main`.

---

## 📂 Structure des fichiers

```text
yalla-extra/
├── frontend/           # Application React
│   ├── src/            # Code source
│   ├── Dockerfile      # Build Nginx
│   └── nginx.conf      # Config SPA
├── backend/            # API Express
│   ├── models/         # Schémas Mongoose
│   ├── routes/         # Endpoints API
│   └── Dockerfile      # Image Node.js
├── docker-compose.yml  # Orchestration globale
└── package.json        # Scripts du monorepo
```

---

## 📱 Fonctionnalités
- ✅ **Internationalisation** : Support complet Français/Arabe.
- ✅ **RTL Support** : Inversion dynamique du layout pour l'Arabe.
- ✅ **Tableau de Bord** : Interfaces dédiées Candidats et Employeurs.
- ✅ **Génération de CV** : Export PDF des profils candidats.
- ✅ **Dockerized** : Prêt pour le déploiement cloud.

---

## 📞 Support
Pour toute question technique, consultez les logs Docker :
```bash
docker compose logs -f
```