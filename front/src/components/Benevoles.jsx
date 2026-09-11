import { useState, useEffect } from "react";
import "./Benevoles.css"

const Benevoles = ({onSelect}) => {

    const API = 'http://localhost:3000/api';

    const [listeBenevoles, setListeBenevoles] = useState([]);

    const chargerListe = async () => {

        const data = await fetch(`${API}/benevoles`);
        const dataJson = await data.json();

        setListeBenevoles(dataJson);

    }

    useEffect(() =>{
        chargerListe()
    }, [])

    return (
        <>
        <h2 className="benevoles-title">Identifiez-vous :</h2>
        <section className="benevoles-boutonDisplay">
            {listeBenevoles.map((element, index) => 
                <button key={index} className="benevoles-boutonBenevole" type="button" onClick={() => onSelect(element.nom, element.prenom)}>{element.nom} {element.prenom}</button>
            )}
        </section>
        </>
    )};

    export default Benevoles;