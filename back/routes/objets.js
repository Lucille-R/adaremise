import express from 'express'
import { pool } from "../server/db.js";

export const routerObjets = express.Router();

//========================= GET =============================

/**
 * @swagger
 * "/api/objets": {
 *   "get": {
 *     "summary": "Liste les objets, avec filtre optionnel par statut et/ou catégorie",
 *     "parameters": [
 *       {
 *         "name": "statut",
 *         "in": "query",
 *         "required": false,
 *         "schema": { "type": "string", "enum": ["arrive", "en_reparation", "en_rayon", "vendu", "recycle"] },
 *         "description": "Filtre les objets sur ce statut"
 *       },
 *       {
 *         "name": "categorie_id",
 *         "in": "query",
 *         "required": false,
 *         "schema": { "type": "integer" },
 *         "description": "Filtre les objets sur cet identifiant de catégorie"
 *       }
 *     ],
 *     "responses": {
 *       "200": {
 *         "description": "Liste des objets récupérée avec succès",
 *         "content": {
 *           "application/json": {
 *             "schema": {
 *               "type": "array",
 *               "items": {
 *                 "type": "object",
 *                 "properties": {
 *                   "id": { "type": "integer", "example": 1 },
 *                   "libelle": { "type": "string", "example": "Chaise en bois" },
 *                   "statut": { "type": "string", "example": "en_rayon" },
 *                   "prix": { "type": "number", "example": 15 },
 *                   "categorie": { "type": "string", "example": "Mobilier" }
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
// Route qui permet d'effectuer une recherche de la liste des objets avec une possibilitée de filtre le statut et/ou la categorie
//------------------------------------------------------------
routerObjets.get('/objets', async(req,res) => {
    
    const statut = req.query.statut || null;
    const categorieId = req.query.categorie_id || null;

    const { rows } = await pool.query('SELECT o.id, o.libelle, o.statut, o.prix , c.libelle AS categorie FROM objet o JOIN categorie c ON c.id = O.categorie_id WHERE o.statut = COALESCE($1::statut_objet, o.statut) AND o.categorie_id = COALESCE($2::integer, O.categorie_id) ORDER BY o.id DESC' , [statut, categorieId]);
    res.status(200).json(rows);
});

//========================= GET =============================

/**
 * @swagger
 * "/api/objets/{id}": {
 *   "get": {
 *     "summary": "Récupère le détail complet d'un objet à partir de son id",
 *     "parameters": [
 *       {
 *         "name": "id",
 *         "in": "path",
 *         "required": true,
 *         "schema": { "type": "integer" },
 *         "description": "L'identifiant de l'objet"
 *       }
 *     ],
 *     "responses": {
 *       "200": {
 *         "description": "Détail de l'objet récupéré avec succès",
 *         "content": {
 *           "application/json": {
 *             "schema": {
 *               "type": "object",
 *               "properties": {
 *                 "id": { "type": "integer", "example": 1 },
 *                 "libelle": { "type": "string", "example": "Chaise en bois" },
 *                 "poids_kg": { "type": "number", "example": 3.5 },
 *                 "etat_arrivee": { "type": "string", "example": "bon_etat" },
 *                 "statut": { "type": "string", "example": "en_rayon" },
 *                 "prix": { "type": "number", "example": 15 },
 *                 "date_mise_rayon": { "type": "string", "example": "2026-09-06" },
 *                 "categorie": { "type": "string", "example": "Mobilier" },
 *                 "depot_id": { "type": "integer", "example": 4 },
 *                 "nom": { "type": "string", "example": "Dupont" },
 *                 "prenom": { "type": "string", "example": "Alice" }
 *               }
 *             }
 *           }
 *         }
 *       },
 *       "404": { "description": "Aucun objet ne correspond à cet identifiant" }
 *     }
 *   }
 * }
 */

//------------------------------------------------------------
// Route qui permet d'effectuer une recherche d'objet avec son id en paramêtre
//------------------------------------------------------------
routerObjets.get('/objets/:id', async (req,res) => {

    const { id } = req.params;

    const { rows } = await pool.query('SELECT o.id, o.libelle, o.poids_kg, o.etat_arrivee, o.statut, o.prix, o.date_mise_rayon, c.libelle AS categorie, o.depot_id, p.nom, p.prenom FROM objet o JOIN categorie c ON c.id = o.categorie_id JOIN depot d ON d.id = o.depot_id JOIN personne p ON p.id = d.personne_id WHERE o.id= $1' , [id]);

    if (rows.length === 0) {
        // L'erreur est déclenché car l'id ne correspond à aucun objet présent dans la DB 
        return res.status(404).json({ error: 'Objet introuvable'});
    }
    res.status(200).json(rows[0]);

});

//========================= PATCH =============================

/**
 * @swagger
 * "/api/objets/{id}/statut": {
 *   "patch": {
 *     "summary": "Modifie le statut d'un objet existant",
 *     "parameters": [
 *       {
 *         "name": "id",
 *         "in": "path",
 *         "required": true,
 *         "schema": { "type": "integer" },
 *         "description": "L'identifiant de l'objet"
 *       }
 *     ],
 *     "requestBody": {
 *       "required": true,
 *       "content": {
 *         "application/json": {
 *           "schema": {
 *             "type": "object",
 *             "required": ["statut"],
 *             "properties": {
 *               "statut": { "type": "string", "enum": ["arrive", "en_reparation", "en_rayon", "vendu", "recycle"] }
 *             }
 *           }
 *         }
 *       }
 *     },
 *     "responses": {
 *       "200": {
 *         "description": "Statut de l'objet modifié avec succès",
 *         "content": {
 *           "application/json": {
 *             "schema": {
 *               "type": "object",
 *               "properties": {
 *                 "id": { "type": "integer", "example": 1 },
 *                 "libelle": { "type": "string", "example": "Chaise en bois" },
 *                 "poids_kg": { "type": "number", "example": 3.5 },
 *                 "etat_arrivee": { "type": "string", "example": "bon_etat" },
 *                 "statut": { "type": "string", "example": "vendu" },
 *                 "prix": { "type": "number", "example": 15 },
 *                 "date_mise_rayon": { "type": "string", "example": "2026-09-06" },
 *                 "categorie_id": { "type": "integer", "example": 1 },
 *                 "depot_id": { "type": "integer", "example": 4 }
 *               }
 *             }
 *           }
 *         }
 *       },
 *       "400": { "description": "Champ statut manquant, ou valeur de statut invalide" },
 *       "404": { "description": "Aucun objet ne correspond à cet identifiant" }
 *     }
 *   }
 * }
 */

//------------------------------------------------------------
// Route qui permet de modifier le statut d'un objet existant
//------------------------------------------------------------
routerObjets.patch ('/objets/:id/statut' , async (req,res) => {
    const { id } = req.params;
    const { statut } = req.body;

    const objetExiste = await pool.query('SELECT id FROM objet WHERE id = $1' , [id]);
    if ( objetExiste.rows.length === 0 ) {
        return res.status(404).json({ error : "Objet introuvable"});
    }
    if (!statut) {
        return res.status(400).json({error : "Le champ statut est obligatoire"});
    }
    const statusValides = ['arrive' , 'en_reparation', 'en_rayon','vendu', 'recycle'];
    if (!statusValides.includes(statut)) {
        return res.status(400).json({error: `statut doit être une des valeurs suivantes ${statusValides.join(',')} `});
    }
    const { rows } = await pool.query(
        'UPDATE objet SET statut =$1::statut_objet WHERE id = $2 RETURNING *' , [statut, id]
    );
    
    res.status(200).json(rows[0]);

});
