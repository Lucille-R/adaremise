import express from "express";
import { pool } from "../server/db.js";

export const routerDepots = express.Router();

//========================= POST =============================

// Créer un nouveau dépôt (personne_id, date_depot, type) :
routerDepots.post("/depots", async (req, res) => {
	const { personne_id, date_depot, type } = req.body;

	// Gestion des champs obligatoires :
	if (personne_id === undefined || date_depot === undefined || type === undefined) {
		return res.status(400).json({erreur: 'Champ obligatoire manquant'});
	}

	// Liste blanche des ENUM type dépôt :
	const TYPE = ['boutique', 'domicile'];
	if (!TYPE.includes(type)) {
		return res.status(400).json({erreur: `type doit valoir ${TYPE.join(', ')}`});
	}

	// Vérification existance de personne_id :
	const { rows: rowsPersonneId } = await pool.query(`
		SELECT id
		FROM personne
		WHERE id = $1`, [personne_id]);
	if (rowsPersonneId.length === 0) {
		return res.status(404).json({erreur: `${personne_id} : cet identifiant n'existe pas`});
	}

	// Requete d'insertion dans la base :
	const { rows } = await pool.query(`
		INSERT INTO depot (date_depot, type, personne_id)
		VALUES ($1, $2::type_depot, $3::integer)
		RETURNING *`, 
		[date_depot, type, personne_id]);
	
	return res.status(201).json(rows[0]);

});