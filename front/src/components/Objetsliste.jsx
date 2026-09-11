import { useState, useEffect } from "react";
import './Objetsliste.css';
import Filtres from './Filtres.jsx'


function Objetsliste () {
    const [objets, setObjets] = useState([]);
    const [statutFiltre, setStatutFiltre] = useState("");
    const [categories , setCategories] = useState([]);
    const [categorieFiltre, setCategorieFiltre] = useState("")

    const handleStatutChange = (nouveauStatut) => {
        setStatutFiltre(nouveauStatut);
    }

    const handleCategorieChange = (nouvelleCategorie) => {
        setCategorieFiltre(nouvelleCategorie);
    }
    
    useEffect(() => {
        async function chargerObjets() {
            const params = new URLSearchParams();

            if (statutFiltre) {
                params.append('statut', statutFiltre);
            }
            if (categorieFiltre) {
                params.append('categorie_id', categorieFiltre);
            }

            const queryString = params.toString();
            const url = queryString
                ? `http://localhost:3000/api/objets?${queryString}`
                : 'http://localhost:3000/api/objets';
            
                const reponse = await fetch(url);
            const data = await reponse.json();
            setObjets(data);
        }
        chargerObjets();
    }, [statutFiltre, categorieFiltre]);
    
    useEffect(() => {
        async function chargerCategories() {
            const reponse = await fetch('http://localhost:3000/api/categories');
            const data = await reponse.json();
            setCategories(data);
        } 
        chargerCategories();
    }, []);
    return (
        <>
        <div className="filtre_objets_box">
        
            <Filtres statut={statutFiltre} onStatutChange={handleStatutChange} categories={categories} categorieFiltre={categorieFiltre} onCategorieChange={handleCategorieChange}/>
            <ul>
                {objets.map((objet) =>(
                    <li key={objet.id} className="objets">{objet.libelle} - Catégorie : {objet.categorie} - Prix : {objet.prix} € - Statut de l'objet : {objet.statut} </li>

                ))}
            </ul>
        
        </div> 
        
        </>
    )
};


export default Objetsliste;