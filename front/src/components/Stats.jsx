import { useState, useEffect } from "react";
import "./Stats.css"

const Stats = () => {

    const API = 'http://localhost:3000/api';

    const [objetStatut, setObjetStatut] = useState([]);
    const [poidsTotal, setPoidsTotal] = useState(-1);
    const [nbObjetRayon, setNbObjetRayon] = useState(-1);
    const [erreur, setErreur] = useState(null);

    const chargerDonnees = async () => {
        try{
            const response = await fetch (`${API}/stats`);

            if(!response.ok){
                throw new Error (`Erreur ${response.status}: Impossible de charger les statistiques`)
            }

            const dataJson = await response.json();

            setObjetStatut(dataJson.objetsStatut);
            setPoidsTotal(dataJson.poidsTotal);
            setNbObjetRayon(dataJson.nbObjetRayon);

        } catch (error){
            console.error(error.message);
            setErreur(error.message)
        }
    }

    useEffect(() => {
        chargerDonnees();
    }, []);

    if(erreur){
        return(
            <>
            <h3>Oops !</h3>
            <p>{erreur}</p>
            </>
        )};

    return (
        <section className="stats-stats">
            <div className="stats-generalData">
                <article className="stats-generalDatablocks">
                    <h4 className="stats-titleGenData">Objets en rayon :</h4>
                    <p className="stats-detailGenData ">{nbObjetRayon}</p>
                </article>
                <article className="stats-generalDatablocks">
                    <h4 className="stats-titleGenData">Poids Total :</h4>
                    <p className="stats-detailGenData ">{poidsTotal}</p>
                </article>
            </div>
            <div className="stats-listStatus">
                <h4>Classification par statut :</h4>
                <dl className="stats-donneeTableau">
                    {objetStatut.map((element) => (
                        <div key={element.statut} className="stats-cardData">
                            <dt className="stats-donneeTitle">{element.statut} :</dt>
                            <dd className="stats-donneeDetail">{element.nombre}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    )}


    export default Stats;