import express from "express";
import { pool } from "./../server/db.js";

export const routerBenevoles = express.Router();

routerBenevoles.get('/benevoles', async (req,res) =>{
    const { rows } = await pool.query(`
        SELECT * FROM benevole
        `);

        res.status(200).json(rows);
});