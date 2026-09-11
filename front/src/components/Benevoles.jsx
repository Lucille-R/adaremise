import { useState, useEffect } from "react";
import "./Benevoles.css"

const Benevoles = ({onSelect}) => {

    const API = 'http://localhost:3000/api';

    const [listeBenevoles, setListeBenevoles] = useState([]);
    const [erreur, setErreur] = useState(null);

    const chargerListe = async () => {
        try {
            const response = await fetch(`${API}/benevoles`);

            if(!response.ok){
                throw new Error(`Erreur ${response.status}: Impossible de charger la liste des bénévoles`);
            }

            const data = await response.json();
            setListeBenevoles(data);
    } catch (error) {
        console.error(error.message);
        setErreur(error.message)
    }

    }

    useEffect(() =>{
        chargerListe()
    }, [])

    if(erreur){
        return(
            <>
            <h3>Oops !</h3>
            <p>{erreur}</p>
            </>
        )};

    return (
        <>
        <h2 className="benevoles-title">Identifiez-vous :</h2>
        <section className="benevoles-boutonDisplay">
            {listeBenevoles.map((element) => 
                <button key={element.id} className="benevoles-boutonBenevole" type="button" onClick={() => onSelect(element.nom, element.prenom)}>{element.nom} {element.prenom}</button>
            )}
        </section>
        </>
    )};

    export default Benevoles;