import { useState, useEffect } from "react";
import './Objetsliste.css';


function Objetsliste () {
    const [objets, setObjets] = useState([])
    
    useEffect(() => {
        async function chargerObjets() {
            const reponse = await fetch ("http://localhost:3000/api/objets");
            const data = await reponse.json();
            setObjets(data);
        }
        chargerObjets();
    }, []);
    
    return (
        <ul>
            {objets.map((objet) =>(
                <li key={objet.id}>{objet.libelle} - Catégorie : {objet.categorie} - Prix : {objet.prix} € - Statut de l'objet : {objet.statut} </li>

            ))}
        </ul>
    )
};

export default Objetsliste;