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

/**
 * @swagger
 * "/api/stats/activite": {
 *   "get": {
 *     "summary": "Recupere le nombre d'heures d'activite benevole (ateliers et reparations)",
 *     "tags": ["Stats"],
 *     "responses": {
 *       "200": {
 *         "description": "Statistiques d'activite recuperees avec succes",
 *         "content": {
 *           "application/json": {
 *             "schema": {
 *               "type": "object",
 *               "properties": {
 *                 "atelier": { "type": "number", "example": 15.5 },
 *                 "reparation": { "type": "number", "example": 144.1 }
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

routerStats.get('/stats/activite', async (req,res) => {

    const atelierActivite = await pool.query(`
        SELECT SUM(atelier.duree) AS Activite_Atelier
        FROM atelier
        `)

    const reparationActivite = await pool.query(`
        SELECT SUM(reparation.duree_h) AS Activite_Reparation
        FROM reparation
        `)


    res.status(200).json({
        "atelier": atelierActivite.rows[0].activite_atelier, 
        "reparation": reparationActivite.rows[0].activite_reparation})
});

/**
 * @swagger
 * "/api/stats/reparation": {
 *   "get": {
 *     "summary": "Recupere le nombre de reparations reussies et echouees par categorie d'objet",
 *     "tags": ["Stats"],
 *     "responses": {
 *       "200": {
 *         "description": "Statistiques de reparation recuperees avec succes",
 *         "content": {
 *           "application/json": {
 *             "schema": {
 *               "type": "array",
 *               "items": {
 *                 "type": "object",
 *                 "properties": {
 *                   "libelle": { "type": "string", "example": "Mobilier" },
 *                   "reussie": { "type": "integer", "example": 5 },
 *                   "echouee": { "type": "integer", "example": 2 }
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

routerStats.get('/stats/reparation', async (req,res) => {

    const reparationCount = await pool.query(`
        SELECT categorie.libelle, 
        COUNT(*) FILTER (WHERE resultat = 'reussie') AS reussie,
        COUNT(*) FILTER (WHERE resultat = 'echouee') AS echouee
        FROM categorie
        JOIN objet ON categorie.id = objet.categorie_id
        JOIN reparation ON objet.id = reparation.objet_id
        GROUP BY categorie.libelle
        `);

    res.status(200).json(reparationCount.rows);
});

/**
 * @swagger
 * "/api/stats/ca": {
 *   "get": {
 *     "summary": "Recupere le chiffre d'affaire mensuel",
 *     "tags": ["Stats"],
 *     "responses": {
 *       "200": {
 *         "description": "Chiffre d'affaire recupere avec succes",
 *         "content": {
 *           "application/json": {
 *             "schema": {
 *               "type": "array",
 *               "items": {
 *                 "type": "object",
 *                 "properties": {
 *                   "mois": { "type": "string", "example": "Avril" },
 *                   "ca": { "type": "number", "example": 245.8 }
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

routerStats.get('/stats/ca', async (req,res) => {

    const {rows} = await pool.query(`
        SELECT to_char(date_trunc('month', vente.date_vente), 'FMMonth') AS Mois,
        SUM(objet.prix_paye) FILTER (WHERE prix_paye IS NOT NULL) AS CA
        FROM vente
        JOIN objet ON vente.id = objet.vente_id
        GROUP BY Mois
        `);

    res.status(200).json(rows);
})
