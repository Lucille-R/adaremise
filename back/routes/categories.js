import express from 'express'   
import { pool } from './../server/db.js' ;

export const routerCategories = express.Router();

//========================= GET =============================

/**
 * @swagger
 * "/api/categories": {
 *   "get": {
 *     "summary": "Liste toutes les catégories",
 *     "responses": {
 *       "200": {
 *         "description": "Liste des catégories récupérée avec succès",
 *         "content": {
 *           "application/json": {
 *             "schema": {
 *               "type": "array",
 *               "items": {
 *                 "type": "object",
 *                 "properties": {
 *                   "id": { "type": "integer", "example": 1 },
 *                   "libelle": { "type": "string", "example": "Mobilier" }
 *                 }
 *               }
 *             }
 *           }
 *         }
 *       }
 *     }
 *   }
 * }
 */

//------------------------------------------------------------
// Récupérer la liste de toutes les catégories (id, libelle), triée par id
//------------------------------------------------------------
routerCategories.get('/categories', async (req,res) => {

        const {rows} = await pool.query('SELECT id,libelle FROM categorie ORDER BY id')
        res.status(200).json(rows)

})
