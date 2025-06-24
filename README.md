# 🚀 LittleBill – Application de Gestion Clients et Ventes

Bienvenue sur LittleBill, une application web pour gérer des clients et leurs ventes.

---

## 🧭 Sommaire

- [🧰 Fonctionnalités](#-fonctionnalités)
- [⚙️ Prérequis](#️-prérequis)
- [📦 Installation](#-installation)
- [▶️ Lancement de l'application](#️-lancement-de-lapplication)
- [🔐 Authentification](#-authentification)
- [🧪 Tests](#-tests)
- [💾 Persistance des données](#-persistance-des-données)
- [🧠 Architecture](#-architecture)
- [🛠 Développement](#-développement)
- [🚀 Déploiement (optionnel)](#-déploiement-optionnel)

---

## 🧰 Fonctionnalités

- ✅ Interface React moderne
- ✅ Authentification sécurisée (JWT + mot de passe haché)
- ✅ Recherche de clients
- ✅ Affichage des ventes par client
- ✅ Données sauvegardées dans des fichiers JSON
- ✅ Synchronisation avec l’API Hiboutik
- ✅ Tests automatisés

---

## ⚙️ Prérequis

- Python 3.8+
- Node.js 16+ (et npm)
- Git (recommandé)

---

## 📦 Installation

### 1. Cloner le projet

````bash
git clone <votre-url-depot>
cd LittleBill

### 2. Installer le backend (FastAPI)
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt

### 3. Installer le frontend (React)
```bash
cd frontend-react
npm install
cd ..
▶️ Lancement de l'application
🔁 Méthode automatique (recommandée)
Vous pouvez démarrer le frontend et le backend avec un seul script selon votre système :

▪️ Windows PowerShell (recommandé)
```PowerShell
.\start.ps1
▪️ Windows CMD classique
```bash
start.bat
📌 À placer : ces deux fichiers sont à mettre à la racine du projet, c’est-à-dire au même niveau que requirements.txt.

🔁 Méthode manuelle (si les scripts ne marchent pas)
Backend FastAPI (Terminal 1)
```bash
cd app
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate
uvicorn app.main:app --reload
Frontend React (Terminal 2)
```bash
cd frontend-react
npm start
Modifier
cd frontend-react
npm start


🔐 Authentification
Un utilisateur test est déjà présent pour tester l'application :

Nom d'utilisateur : testuser
Mot de passe : testpass

➕ Ajouter un nouvel utilisateur
Lancer ce script pour générer un mot de passe chiffré :

```bash
python generate_hash.py
````

Copier le hash généré dans le fichier data/users.json :

```json
{
  "username": "newuser",
  "hashed_password": "le_hash_ici"
}
```

🧪 Tests
Backend (FastAPI)

```bash
pytest -v
```

Frontend (React)

```bash
cd frontend-react
npm test
```

💾 Persistance des données
Les données sont enregistrées dans le dossier data/ :

- users.json – utilisateurs autorisés
- customers.json – clients synchronisés
- sales.json – ventes enregistrées

🧠 Architecture

```bash
LittleBill/
├── app/                  # Backend (FastAPI)
├── data/                 # Données JSON (clients, ventes, utilisateurs)
├── frontend-react/       # Frontend React
├── tests/                # Tests backend (pytest)
├── generate_hash.py      # Script utilitaire
├── start.bat             # Script de démarrage CMD Windows
├── start.ps1             # Script de démarrage PowerShell
├── requirements.txt
└── README.md
```
