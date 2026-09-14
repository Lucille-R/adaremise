import express from "express";
import { pool } from "./../server/db.js";

export const routerBenevoles = express.Router();

//--- GET ---

/**
 * @swagger
 * "/api/benevoles": {
 *   "get": {
 *     "summary": "Liste tous les benevoles",
 *     "tags": ["Benevoles"],
 *     "responses": {
 *       "200": {
 *         "description": "Liste des benevoles recuperee avec succes",
 *         "content": {
 *           "application/json": {
 *             "schema": {
 *               "type": "array",
 *               "items": {
 *                 "type": "object",
 *                 "properties": {
 *                   "id": { "type": "integer", "example": 1 },
 *                   "nom": { "type": "string", "example": "Leroux" },
 *                   "prenom": { "type": "string", "example": "Sonia" },
 *                   "telephone": { "type": "string", "example": "0620438808" },
 *                   "date_arrive": { "type": "string", "format": "date-time", "example": "2025-11-02T23:00:00.000Z" }
 *                 }
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

routerBenevoles.get('/benevoles', async (req,res) =>{
    const { rows } = await pool.query(`
        SELECT * FROM benevole
        `);

        res.status(200).json(rows);
});