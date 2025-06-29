# LittleBill - Gestion de Clients et Ventes

Ce projet est une application web full-stack pour la gestion de clients et de ventes, construite avec un backend en Python (FastAPI) et un frontend en React. L'application comprend une interface utilisateur moderne en React, une authentification sécurisée, une persistance des données basée sur des fichiers et des tests complets.

## Fonctionnalités

- **Frontend** : ✅ Application React moderne avec routage et architecture basée sur des composants
- **Backend** : ✅ FastAPI avec des points de terminaison API complets
- **Authentification** : ✅ Authentification basée sur JWT avec hachage de mot de passe sécurisé
- **Recherche de Clients** : ✅ Recherche de clients en temps réel avec auto-complétion
- **Gestion des Ventes** : ✅ Affichage des ventes par client avec pagination
- **Persistance des Données** : ✅ Système de mise en cache basé sur des fichiers (fichiers JSON)
- **Intégration API** : ✅ Intégration de l'API Hiboutik avec gestion des erreurs
- **Tests** : ✅ Tests unitaires complets avec pytest

## Prérequis

- Python 3.8+
- Node.js 16+ et npm
- pip

## Installation et Lancement

### 1. Cloner et Configurer le Backend

```powershell
git clone <repository_url>
cd littlebill_test

# Créer un environnement virtuel Python
python -m venv venv
.\venv\Scripts\Activate.ps1

# Installer les dépendances Python
pip install --upgrade pip
pip install -r requirements.txt
```

### 2. Configurer le Frontend React

```powershell
# Accéder au répertoire du frontend React
cd frontend-react

# Installer les dépendances Node.js
npm install
```

## Exécution de l'Application

Vous devez exécuter à la fois les serveurs backend et frontend :

### Backend (FastAPI) - Terminal 1

```powershell
# Depuis la racine du projet, avec l'environnement virtuel activé
uvicorn app.main:app --reload
```

L'API sera disponible à :

- **Serveur API** : [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **Documentation API** : [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### Frontend (React) - Terminal 2

```powershell
# Depuis le répertoire frontend-react
cd frontend-react
npm start
```

L'application React sera disponible à :

- **Application React** : [http://localhost:3000](http://localhost:3000)

## Authentification

### Utilisateur Test par Défaut

L'application est fournie avec un utilisateur test préconfiguré :

- **Nom d'utilisateur** : `testuser`
- **Mot de passe** : `testpass`

### Création de Nouveaux Utilisateurs

Pour créer des utilisateurs supplémentaires :

1. **Générez un hachage de mot de passe** :

   ```powershell
   python generate_hash.py "votre_mot_de_passe_ici"
   ```

2. **Ajoutez l'utilisateur au fichier `data/users.json`** :
   ```json
   [
     {
       "username": "testuser",
       "hashed_password": "$2b$12$dKIxgTQ4QDCruNtuYhJhTOscO7kua8y3ZA2lamlJs.GMSzM5dwS7S"
     },
     {
       "username": "newuser",
       "hashed_password": "generated_hash_here"
     }
   ]
   ```

## Tests

### Tests Backend

Exécutez la suite de tests Python :

```powershell
# Depuis la racine du projet avec l'environnement virtuel activé
pytest -v
```

### Tests Frontend (Optionnel)

> **Note importante :**
> Node.js 22 n'est pas encore totalement supporté par Jest/jsdom. Pour exécuter les tests frontend, il est recommandé d'utiliser Node.js 20 (LTS) ou Node.js 18 (LTS). Si vous ne pouvez pas changer de version Node, essayez de mettre à jour Jest et jsdom à leurs dernières versions, mais des erreurs peuvent persister.

#### Installation des dépendances de test (obligatoire pour les tests React)

Dans le dossier `frontend-react`, exécutez :

```powershell
npm install --save-dev jest @types/jest ts-jest @testing-library/react @testing-library/jest-dom @testing-library/user-event identity-obj-proxy
```

#### Configuration de Jest (déjà incluse)

- Un fichier `jest.config.js` est présent dans `frontend-react` pour la configuration TypeScript et React.
- Un fichier `src/setupTests.ts` est utilisé pour initialiser Testing Library.

#### Exécuter les tests React avec Jest (recommandé)

```powershell
# Depuis le répertoire frontend-react
npm test
```

#### Exécuter les tests React avec react-scripts (alternative)

```powershell
# Depuis le répertoire frontend-react
npm run test:react
```

> **Astuce :**
> Si vous rencontrez des erreurs liées à jsdom ou Jest avec Node.js 22, essayez d'abord de mettre à jour Jest et jsdom :
>
> ```powershell
> npm install --save-dev jest@latest jsdom@latest jest-environment-jsdom@latest
> ```
>
> Si le problème persiste, utilisez Node.js 20 ou 18 (LTS) avec [nvm-windows](https://github.com/coreybutler/nvm-windows/releases).

## Persistance des Données

L'application utilise des **fichiers JSON** dans le répertoire `data/` pour :

- **Gestion des Utilisateurs** : `users.json` - Stocke les identifiants des utilisateurs
- **Cache des Clients** : `customers.json` - Données des clients mises en cache de l'API Hiboutik
- **Cache des Ventes** : `sales.json` - Données des ventes mises en cache pour les clients

## Fonctionnalités de l'Application

### Frontend React

- **UI Moderne** : Design épuré et réactif avec des composants React (TypeScript)
- **Authentification** : Connexion/déconnexion avec gestion des tokens JWT
- **Recherche de Clients** : Recherche en temps réel avec auto-complétion
- **Visualisation des Ventes** : Affichage paginé des ventes avec informations détailléess
- **Gestion des Erreurs** : Messages d'erreur conviviaux et états de chargement
- **Routage** : Routes protégées avec vérifications d'authentification
- **Tests** : Tests unitaires avec Jest et React Testing Library (`App.test.tsx`)

### Backend FastAPI

- **API RESTful** : Points de terminaison bien structurés avec documentation OpenAPI
- **Authentification** : Sécurité basée sur JWT avec hachage de mot de passe bcrypt
- **Mise en Cache des Données** : Système de mise en cache intelligent pour réduire les appels API
- **Gestion des Erreurs** : Gestion et journalisation complètes des erreurs
- **Support CORS** : Configuré pour le serveur de développement React
- **Tests** : Tests unitaires backend avec pytest (`tests/test_app.py`)

## Structure du Projet

```
├── frontend-react/              # Frontend React
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/          # Composants React (TypeScript)
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── ClientSearch.tsx
│   │   │   └── ClientSales.tsx
│   │   ├── contexts/            # Contexte React
│   │   │   └── AuthContext.tsx
│   │   ├── services/            # Services API
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   ├── App.test.tsx
│   │   ├── index.tsx
│   │   └── index.css
│   ├── jest.config.js           # Config Jest pour tests React/TS
│   ├── src/setupTests.ts        # Setup Testing Library
│   ├── package.json
│   └── package-lock.json
├── app/                         # Backend FastAPI
│   ├── api.py                   # Points de terminaison API
│   ├── auth.py                  # Logique d'authentification
│   ├── database.py              # Configuration de la base de données
│   ├── main.py                  # Application FastAPI
│   └── models.py                # Modèles Pydantic
├── data/                        # Stockage des Données
│   ├── customers.json           # Cache des clients
│   ├── sales.json               # Cache des ventes
│   └── users.json               # Données des utilisateurs
├── tests/                       # Suite de Tests Backend
│   └── test_app.py
├── generate_hash.py             # Utilitaire de hachage de mot de passe
├── requirements.txt             # Dépendances Python
└── README.md                    # Ce fichier
```

## Développement

### Variables d'Environnement

Créez un fichier `.env` dans le répertoire `frontend-react` pour la configuration API personnalisée :

```env
REACT_APP_API_BASE_URL=http://localhost:8000
```

### Qualité du Code

Le projet suit les meilleures pratiques :

- **Backend** : FastAPI avec annotations de type, gestion appropriée des erreurs et structure modulaire
- **Frontend** : React avec hooks, contexte pour la gestion d'état et séparation des composants
- **Sécurité** : Authentification JWT, hachage de mot de passe et configuration CORS
- **Tests** : Couverture de test complète pour les points de terminaison API

2. **Servir avec FastAPI** :
   Mettre à jour FastAPI pour servir les fichiers React construits

3. **Variables d'environnement** :
   Configurer les URL et secrets API de production

## Remarques

- Le frontend React s'exécute sur le port 3000 pendant le développement
- Le backend FastAPI s'exécute sur le port 8000
- Les tokens JWT sont stockés dans localStorage
- L'application gère automatiquement l'expiration des tokens et redirige vers la page de connexion
