# Football Match Tracker

Application de suivi des matchs de football avec système de cotes.

## Installation

1. Clonez le repository :

```bash
git clone [votre-repo-url]
cd football-match-tracker
```

2. Installez les dépendances :

```bash
npm install
```

3. Configurez les variables d'environnement :

```bash
cp .env.example .env
```

Puis modifiez le fichier `.env` avec vos propres valeurs.

## Configuration

Le fichier `.env` doit contenir les variables suivantes :

- `PORT` : Port du serveur (défaut: 3000)
- `MONGODB_URI` : URL de connexion MongoDB
- `NODE_ENV` : Environnement (development/production)
- `FRONTEND_URL` : URL du frontend pour CORS
- `JWT_SECRET` : Clé secrète pour les tokens JWT
- `SPORTSDB_API_KEY` : Clé API pour TheSportsDB
- `SPORTSDB_API_URL` : URL de base de l'API TheSportsDB

## Démarrage

Pour lancer en mode développement :

```bash
npm run dev
```

Pour lancer en production :

```bash
npm start
```

## API Endpoints

- `GET /api/sports/top` : Top 5 des matchs de football
- `GET /api/sports` : Liste de tous les matchs
- `GET /api/sports/search` : Recherche de matchs
- `GET /api/sports/:id` : Détails d'un match
- `POST /api/sports/update` : Force la mise à jour des données

## Authentification

- `POST /api/auth/register` : Inscription
- `POST /api/auth/login` : Connexion

## Structure du projet

```
.
├── controllers/        # Contrôleurs
├── models/             # Modèles MongoDB
├── routes/             # Routes API
├── services/           # Services (API)
├── middleware/         # Middleware (auth)
├── server.js           # Point d'entrée
└── .env                # Variables d'environnement
```

## Structure des données

Les données des matchs incluent :

- Nom du match (équipe à domicile vs équipe à l'extérieur)
- Cotes pour la victoire de l'équipe à domicile, match nul, et victoire de l'équipe à l'extérieur
- Date du match
- Bookmaker
- Nom de l'événement
- Stade
- URL de l'image
- Description (ligue, saison)
- Ligue
- Équipe à domicile
- Équipe à l'extérieur
- Sport
