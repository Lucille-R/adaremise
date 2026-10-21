# AdaRemise

Application web de gestion de stock pour La Remise, une ressourcerie associative.

## 📝 Description
*Projet de groupe réalisé dans le cadre de la formation Concepteur Développeur d'Applications à Ada Tech School.*

AdaRemise permet aux bénévoles de La Remise de suivre les objets donnés, depuis leur dépôt jusqu'à leur vente ou leur recyclage.

## ✨ Fonctionnalités

- Identification du bénévole à l'ouverture de l'application
- Consultation du stock, avec filtres par statut et par catégorie
- Changement du statut d'un objet (arrivé, en réparation, en rayon, vendu, recyclé)
- Création d'un dépôt et ajout des objets déposés
- Tableau de bord statistique : objets par statut, chiffre d'affaires, réparations, activité bénévole

## 🛠️ Technologies utilisées

- **Front** : React, Vite, React Router, Chart.js
- **Back** : Node.js, Express, pg
- **Base de données** : PostgreSQL, Docker
- **Documentation de l'API** : Swagger

## 📂 Structure du projet

```
adaremise/
├── back/
│   ├── routes/
│   │   ├── benevoles.js
│   │   ├── categories.js
│   │   ├── depots.js
│   │   ├── objets.js
│   │   ├── personnes.js
│   │   └── stats.js
│   └── server/
│       ├── db.js
│       └── server.js
├── conception/              # Wireframes des écrans
├── db/
│   ├── docker-compose.yml   # À créer (non versionné)
│   ├── migration_up.sql
│   ├── migration_down.sql
│   ├── queries.sql
│   └── seed.sql
├── front/
│   ├── assets/
│   ├── src/
│   │   ├── components/      # Un fichier .jsx et un fichier .css par composant
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
├── requetes/                # Une requête .http par ressource
├── .env.example
├── package.json
├── README.md
└── swagger.json
```

## 📋 Prérequis

- Node.js 22 ou plus récent
- Docker

## 🚀 Installation

```bash
git clone https://github.com/Lucille-R/adaremise.git
cd adaremise
npm install
cp .env.example .env
```

Complétez ensuite le `.env` avec vos identifiants de base de données.

Le fichier `db/docker-compose.yml` n'est pas versionné : créez-le avec le contenu suivant, en reprenant les mêmes identifiants que dans votre `.env`.

```yaml
services:
  db:
    image: postgres:16
    container_name: adaremise-db
    environment:
      POSTGRES_USER: votre_utilisateur
      POSTGRES_PASSWORD: votre_mot_de_passe
      POSTGRES_DB: adaremise
    ports:
      - "5439:5432"
    volumes:
      - ./migration_up.sql:/docker-entrypoint-initdb.d/migration_up.sql
      - ./seed.sql:/docker-entrypoint-initdb.d/seed.sql
      - adaremise-data:/var/lib/postgresql/data

volumes:
  adaremise-data:
```

Au premier lancement, les tables sont créées et remplies avec un jeu de données de démonstration.

## 💻 Lancer le projet

```bash
cd db
docker compose up -d    # base de données
cd ..
npm run dev:back        # API, sur http://localhost:3000
npm run dev             # front, dans un second terminal
```

La documentation de l'API (Swagger) est disponible sur `http://localhost:3000/api-docs`.

## 🔜 Pistes d'évolution

- Écrans de saisie des réparations, des ventes et des ateliers
- Vitrine publique
- Recherche et pagination

## 👥 Équipe

Maxence Chotard, Lucille Richard et Marin Nicolle Poussier.

## 📄 Licence

Projet réalisé dans un cadre pédagogique - Ada Tech School.