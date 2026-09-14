import express from "express";
import { pool } from "./../server/db.js"

export const routerStats = express.Router();

/**
 * @swagger
 * "/api/stats": {
 *   "get": {
 *     "summary": "Recupere les statistiques globales des objets",
 *     "tags": ["Stats"],
 *     "responses": {
 *       "200": {
 *         "description": "Statistiques recuperees avec succes",
 *         "content": {
 *           "application/json": {
 *             "schema": {
 *               "type": "object",
 *               "properties": {
 *                 "objetsStatut": {
 *                   "type": "array",
 *                   "items": {
 *                     "type": "object",
 *                     "properties": {
 *                       "statut": { "type": "string", "example": "en_rayon" },
 *                       "nombre": { "type": "integer", "example": 12 }
 *                     }
 *                   }
 *                 },
 *                 "poidsTotal": { "type": "number", "example": 152.4 },
 *                 "poidsDetourne": { "type": "number", "example": 43.2 },
 *                 "nbObjetRayon": { "type": "integer", "example": 8 }
 *               }
 *             }
 *           }
 *         }
 *       },
 *       "500": { "description": "Erreur de connexion au serveur" }
 *     }
 *   }
 * }
 */

routerStats.get('/stats', async (req,res) => {
    
        const statut = await pool.query(`
            SELECT statut, COUNT(*) AS nombre
            FROM objet
            GROUP BY statut
        `);

        console.log(typeof statut.rows[0].nombre);

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

