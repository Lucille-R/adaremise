# AdaRemise — La Remise

Application de gestion de stock pour **La Remise**, une ressourcerie associative. Projet de fin de Bloc 1 (semaines 15-16) réalisé dans le cadre du bootcamp développement web d'Ada Tech School, en équipe de 3-4 personnes, sur la base d'un travail préalable de modélisation de base de données (Adatabase) et d'API (Adapi).

Ce README décrit l'état **actuel** du projet, tel qu'il se trouve dans le dépôt à ce jour.

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Stack technique](#stack-technique)
- [Structure du projet](#structure-du-projet)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Variables d'environnement](#variables-denvironnement)
- [Lancer le projet](#lancer-le-projet)
- [Documentation de l'API (Swagger)](#documentation-de-lapi-swagger)
- [Endpoints disponibles](#endpoints-disponibles)
- [Pages du front](#pages-du-front)
- [Base de données](#base-de-données)
- [Scripts disponibles](#scripts-disponibles)
- [Ce qui n'est pas encore fait](#ce-qui-nest-pas-encore-fait)
- [Équipe](#équipe)

## Fonctionnalités

L'application couvre aujourd'hui le parcours minimal de gestion du stock d'objets :

- **Identification d'un bénévole** avant tout accès à l'application (écran obligatoire, pas d'authentification réelle — sélection dans une liste).
- **Consultation et filtrage du stock** : liste des objets avec filtre par statut et/ou par catégorie, détail d'un objet au clic (poids, état, date de mise en rayon...).
- **Changement de statut d'un objet** (arrivé, en réparation, en rayon, vendu, recyclé) directement depuis la fiche objet.
- **Création d'un dépôt** : formulaire de sélection d'un donateur, date et type de dépôt (boutique/domicile), puis ajout d'un ou plusieurs objets à ce dépôt.
- **Tableau de bord statistiques** : répartition des objets par statut, poids total, poids "détourné" (vendu/recyclé), nombre d'objets en rayon (affiché via Chart.js).

## Stack technique

| Domaine | Choix |
|---|---|
| Frontend | React 19 + Vite, React Router pour la navigation |
| Backend | Express 5, SQL brut via `pg` (pas d'ORM) |
| Base de données | PostgreSQL 16, exécutée dans Docker |
| Documentation API | `swagger-jsdoc` + `swagger-ui-express` |
| Graphiques | Chart.js / react-chartjs-2 |
| Lint | oxlint |
| Tests manuels API | fichiers `.http` (dossier `requetes/`) |

## Structure du projet

```
adaremise/
├── back/
│   ├── routes/          # Un routeur Express par ressource (objets, depots, categories, personnes, benevoles, stats)
│   └── server/
│       ├── db.js        # Pool de connexion PostgreSQL (pg)
│       └── server.js    # Point d'entrée Express, montage des routes et de Swagger
├── db/
│   ├── migration_up.sql    # Création des types ENUM et des tables
│   ├── migration_down.sql  # Annulation de la migration
│   ├── seed.sql             # Jeu de données de démonstration
│   └── queries.sql
├── front/
│   └── src/
│       ├── components/   # Un composant + son CSS par écran ou brique d'UI
│       ├── App.jsx        # Routes front + logique d'identification du bénévole
│       └── main.jsx
├── requetes/             # Requêtes .http de test manuel, une par ressource
├── swagger.json          # Informations générales de l'API (titre, version, description)
├── docker-compose.yml    # Conteneur PostgreSQL
├── .env.example
└── package.json          # Dépendances et scripts uniques pour front + back
```

## Prérequis

- Node.js 22 ou plus récent
- Docker (pour la base de données PostgreSQL)
- Un client HTTP pour tester l'API si besoin (Thunder Client, l'extension REST Client avec les fichiers `.http` fournis, ou directement Swagger UI)

## Installation

```bash
git clone https://github.com/Lucille-R/adaremise.git
cd adaremise
npm install
cp .env.example .env
```

Toutes les dépendances (front et back) sont déclarées dans un unique `package.json` à la racine : un seul `npm install` suffit.

## Variables d'environnement

Le fichier `.env` doit contenir :

| Variable | Rôle |
|---|---|
| `DB_HOST` | Hôte de la base (`localhost` en local) |
| `DB_PORT` | Port exposé par le conteneur (`5439` avec le `docker-compose.yml` fourni) |
| `DB_USER` | Utilisateur PostgreSQL |
| `DB_PASSWORD` | Mot de passe PostgreSQL |
| `DB_NAME` | Nom de la base |
| `PORT` | Port du serveur Express (`3000`) |

⚠️ `DB_USER`, `DB_PASSWORD` et `DB_NAME` sont actuellement écrits en dur dans `docker-compose.yml` : les valeurs du `.env` doivent leur correspondre exactement pour que la connexion fonctionne. Ce fichier n'étant pas ignoré par Git, il serait préférable, dans une prochaine itération, de faire lire ces identifiants depuis des variables d'environnement plutôt que de les laisser en clair dans un fichier versionné.

## Lancer le projet

**1. Démarrer la base de données :**

```bash
docker-compose up -d
```

**2. Créer les tables et charger les données de démonstration** (aucun script npm dédié n'existe actuellement, la commande s'exécute directement avec `psql`) :

```bash
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f db/migration_up.sql
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f db/seed.sql
```

(remplacez les variables par les valeurs de votre `.env`, ou exportez-les dans votre shell au préalable)

**3. Démarrer le backend** (Express, avec rechargement automatique via nodemon) :

```bash
npm run dev:back
```

**4. Démarrer le frontend** (Vite) dans un second terminal :

```bash
npm run dev
```

Le front est alors accessible à l'adresse indiquée par Vite (par défaut `http://localhost:5173`), et communique avec l'API sur `http://localhost:3000/api`.

## Documentation de l'API (Swagger)

Une fois le backend lancé, la documentation interactive est disponible sur :

```
http://localhost:3000/api-docs
```

Elle est générée automatiquement à partir des commentaires `@swagger` présents dans les fichiers de `back/routes/`.

## Endpoints disponibles

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/categories` | Liste toutes les catégories |
| GET | `/api/objets` | Liste les objets, filtrable par `statut` et/ou `categorie_id` (query params) |
| GET | `/api/objets/:id` | Détail complet d'un objet |
| PATCH | `/api/objets/:id/statut` | Modifie le statut d'un objet |
| POST | `/api/depots` | Crée un nouveau dépôt |
| POST | `/api/depots/:id/objets` | Ajoute un objet à un dépôt existant |
| GET | `/api/personnes` | Liste toutes les personnes |
| GET | `/api/benevoles` | Liste tous les bénévoles |
| GET | `/api/stats` | Statistiques globales (répartition par statut, poids total, poids détourné, objets en rayon) |

## Pages du front

| Route | Composant | Rôle |
|---|---|---|
| *(écran initial)* | `Benevoles` | Identification obligatoire du bénévole avant l'accès à l'application |
| `/objets` | `Objetsliste` | Consultation et filtrage du stock, détail et changement de statut d'un objet |
| `/depots` | `CreationDepot` | Formulaire de création d'un nouveau dépôt |
| `/depots/:id/objets` | `DepotPersonne` | Ajout des objets au dépôt qui vient d'être créé |
| `/stats` | `Stats` | Tableau de bord statistique |

## Base de données

Schéma relationnel PostgreSQL défini dans `db/migration_up.sql`, avec 5 types ENUM (`type_depot`, `etat_objet`, `statut_objet`, `resultat_reparation`, `mode_paiement`) et 11 tables : `personne`, `benevole`, `competence`, `categorie`, `vente`, `depot`, `atelier`, `benevole_competence`, `objet`, `inscription`, `reparation`.

Seules les tables `personne`, `benevole`, `categorie`, `depot` et `objet` sont actuellement exploitées par l'API ; les autres (`vente`, `atelier`, `competence`, `benevole_competence`, `inscription`, `reparation`) sont déjà créées par la migration mais ne sont pas encore reliées à des routes.

## Scripts disponibles

| Commande | Effet |
|---|---|
| `npm run dev` | Démarre le frontend (Vite) |
| `npm run dev:back` | Démarre le backend (Express + nodemon) |
| `npm run build` | Build de production du frontend |
| `npm run preview` | Prévisualise le build de production |
| `npm run lint` | Lint du code avec oxlint |

## Ce qui n'est pas encore fait

D'après le découpage du projet en versions, seule la **V1** (le socle obligatoire noté) est aujourd'hui implémentée : gestion du stock, dépôt, statut d'un objet, statistiques minimales. Restent en version bonus (V2/V3), non commencées dans cet état du dépôt :

- Suivi des réparations
- Gestion des ventes
- Vitrine publique
- Gestion des ateliers
- Recherche et pagination
- Export CSV

## Équipe

Projet réalisé en équipe dans le cadre du Bloc 1 chez Ada Tech School. Contributeurs identifiés dans l'historique Git : Marin Nicolle Poussier, Lucille Richard, Maxence Chotard.
