import express from "express";
import { pool } from "./../server/db.js"

export const routerStats = express.Router();

routerStats.get('/stats', async (req,res) => {
    
        const statut = await pool.query(`
            SELECT statut, COUNT(*) AS nombre
            FROM objet
            GROUP BY statut
        `);

        const poidsTotal = await pool.query(`
            SELECT SUM(poids_kg) AS poids_total_kg
            FROM objet
        `);

        const poidsDetourne = await pool.query(`
            SELECT SUM(poids_kg) AS poids_detourne_kg
            FROM objet
            WHERE statut IN ('vendu', 'recycle')
        `);

        const nbObjetRayon = await pool.query(`
            SELECT COUNT(statut) AS nombre_objet_rayon
            FROM objet
            WHERE statut = 'en_rayon'`);

        res.status(200).json({
            objetsStatut: statut.rows,
            poidsTotal: Number(poidsTotal.rows[0].poids_total_kg),
            poidsDetourne: Number(poidsDetourne.rows[0].poids_detourne_kg),
            nbObjetRayon: Number(nbObjetRayon.rows[0].nombre_objet_rayon)
        });


});

