import express from "express";
import { pool } from "../server/db.js";

export const routerPersonnes = express.Router();


//========================= GET ==============================

// Affichage de la liste des personnes (id, nom, prenom) :
routerPersonnes.get("/personnes", async (req, res) => {
	const { rows } = await pool.query(`
		SELECT id, nom, prenom
		FROM personne`);
	
	res.status(200).json(rows);
});