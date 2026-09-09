import express from "express";
import { pool } from "../server/db.js";
import { debugPort } from "node:process";

export const routerDepots = express.Router();

//========================= POST =============================

//------------------------------------------------------------
// Créer un nouveau dépôt (personne_id, date_depot, type)
//------------------------------------------------------------
routerDepots.post("/depots", async (req, res) => {
	const { personne_id, date_depot, type } = req.body;

	// Gestion des champs obligatoires :
	if (personne_id === undefined || date_depot === undefined || type === undefined) {
		return res.status(400).json({erreur: 'Champ obligatoire manquant'});
	}

	// Liste blanche des ENUM type dépôt :
	const TYPE = ['boutique', 'domicile'];
	if (!TYPE.includes(type)) {
		return res.status(400).json({erreur: `Le type de dépôt doit valoir ${TYPE.join(', ')}`});
	}

	// Vérification existance de personne_id :
	const { rows: rowsPersonneId } = await pool.query(`
		SELECT id
		FROM personne
		WHERE id = $1`, [personne_id]);
	if (rowsPersonneId.length === 0) {
		return res.status(404).json({erreur: `${personne_id} : cet identifiant n'existe pas`});
	}

	// Requete d'insertion du dépôt :
	const { rows } = await pool.query(`
		INSERT INTO depot (date_depot, type, personne_id)
		VALUES ($1, $2::type_depot, $3::integer)
		RETURNING *`, 
		[date_depot, type, personne_id]);
	
	return res.status(201).json(rows[0]);

});

//------------------------------------------------------------
// Ajouter un objet au depot (depot_id, libelle, poids_kg, etat_arrivee, categorie_id) - statut a une valeur 'arrive' par defaut
//------------------------------------------------------------
routerDepots.post("/depots/:id/objets", async (req, res) => {
	const { id } = req.params;
	const { libelle, poids_kg, etat_arrivee, categorie_id } = req.body;

	// Gestion des champs obligatoires :
	if (libelle === undefined || poids_kg === undefined || etat_arrivee === undefined || categorie_id === undefined) {
		return res.status(400).json({erreur: 'Champ obligatoire manquant'});
	}

	// Liste blanche des ENUM etat_arrivee :
	const ETAT = ['bon_etat', 'a_reparer', 'hors_service'];
	if (!ETAT.includes(etat_arrivee)) {
		return res.status(400).json({erreur: `L'état d'arrivée doit valoir ${ETAT.join(', ')}`});
	}

	// Vérification que poids_kg est un nombre :
	if (typeof poids_kg !== "number" || isNaN(poids_kg)) {
		return res.status(400).json({erreur: 'Le poids doit être un nombre'})
	}

	// Vérification existance id du dépôt :
	const { rows: rowsDepotId } = await pool.query(`
		SELECT id
		FROM depot
		WHERE id = $1::integer`, [id]);
	if (rowsDepotId.length === 0) {
		return res.status(404).json({erreur: `${id} : Cet identifiant de dépôt n'existe pas`});
	}

	// Vérification existance id de la catégorie :
	const { rows: rowsCategorieId } = await pool.query(`
		SELECT id
		FROM categorie
		WHERE id = $1::integer`, [categorie_id]);
	if (rowsCategorieId.length === 0) {
		return res.status(404).json({erreur: `${categorie_id} : cet identifiant de catégorie n'existe pas`})
	}


	// Requete d'insertion de l'objet dans le dépot :
	const { rows } = await pool.query(`
		INSERT INTO objet (depot_id, libelle, poids_kg, etat_arrivee, categorie_id)
		VALUES ($1::integer, $2, $3::numeric, $4::etat_objet, $5::integer)
		RETURNING *`,
		[id, libelle, poids_kg, etat_arrivee, categorie_id]);
	
	return res.status(201).json(rows[0]);

});