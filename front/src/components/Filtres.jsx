import { useState, useEffect } from "react";
import './Filtres.css'

export default function Filtres ({ statut, onStatutChange, categories, categorieFiltre, onCategorieChange }) {
    return (
        <>
        <div className="filtres_box">
            
            <h2>Filtres</h2>
            <p>Par statut :</p>
            <select value={statut} onChange={(e) => onStatutChange(e.target.value)}>
                <option value="">Tous statuts</option>
                <option value="arrive">Arrivé</option>
                <option value="en_reparation">En réparation</option>
                <option value="en_rayon">En rayon</option>
                <option value="vendu">Vendu</option>
                <option value="recycle">Recycle</option>
            </select>
            
            <p>Par catégorie</p>

            <select value={categorieFiltre} onChange={(e) => onCategorieChange(e.target.value)}>
                <option value="">Toutes catégories</option>
                {categories.map((categorie) => (
                    <option key={categorie.id} className="categories" value={categorie.id}>{categorie.libelle}</option>
                ))}
            </select>
        
        </div>    
        </>
    )
};


