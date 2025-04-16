# PMU Horse Tracker

Application de suivi des courses de chevaux PMU.

## Installation

1. Clonez le repository :

```bash
git clone [votre-repo-url]
cd pmu-horse-tracker
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
- `RACING_API_USERNAME` : Nom d'utilisateur de l'API courses
- `RACING_API_PASSWORD` : Mot de passe de l'API courses

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

- `GET /api/horses/top` : Top 5 des chevaux
- `GET /api/horses` : Liste de tous les chevaux
- `GET /api/horses/search` : Recherche de chevaux
- `GET /api/horses/:id` : Détails d'un cheval
- `POST /api/horses/update` : Force la mise à jour des données

## Authentification

- `POST /api/auth/register` : Inscription
- `POST /api/auth/login` : Connexion

## Structure du projet

```
.
├── controllers/         # Contrôleurs
├── models/             # Modèles MongoDB
├── routes/             # Routes API
├── server.js           # Point d'entrée
└── .env                # Variables d'environnement
```

## Structure des données

Les données des chevaux incluent :

- Nom du cheval
- Cote
- Date de course
- Bookmaker
- Nom de la course
- Hippodrome
- Image URL
- Description
