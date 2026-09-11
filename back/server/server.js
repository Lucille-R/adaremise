//============== IMPORTS ====================
import express from "express";
import cors from 'cors';
import "dotenv/config"; // Va servir à importer le numéro du port (3000) au lieu de l'écrire en dur dans app.listen(3000, ...)
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerDocument from "./../../swagger.json" with { type: "json" };

import { routerObjets } from "./../routes/objets.js";
import { routerDepots } from "./../routes/depots.js";
import { routerPersonnes } from "./../routes/personnes.js";
import { routerStats } from "./../routes/stats.js";


//=========== CONFIGURATION SWAGGER ==============
// swagger-jsdoc scanne les fichiers de routes à la recherche de commentaires @swagger,et génère la documentation complète à partir des infos de swagger.json et de ces commentaires :
const options = {
  definition: swaggerDocument,
  apis: ["back/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);


//============= MIDDLEWARE ====================

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


//============= MONTAGE ROUTES ================

/* app.use("/api", routerCategories); */
app.use("/api", routerObjets);
app.use("/api", routerDepots);
app.use("/api", routerPersonnes);
app.use("/api", routerStats);


//============= MIDDLEWARE D'ERREUR ================

app.use((err, req, res, next) => {
  console.error('[erreur]', err.message);
  return res.status(500).json({ erreur: 'Une erreur est survenue' });
});


//============= DÉMARRAGE DU SERVEUR ================

app.listen(process.env.PORT, () => {
	console.log("Serveur sur http://localhost:3000");
});
