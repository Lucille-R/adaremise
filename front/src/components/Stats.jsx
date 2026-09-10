import { useState, useEffect, Fragment } from "react";
import "./Stats.css"

const Stats = () => {

    const API = 'http://localhost:3000/api';

    const [objetStatut, setObjetStatut] = useState([]);
    const [poidsTotal, setPoidsTotal] = useState(-1);
    const [nbObjetRayon, setNbObjetRayon] = useState(-1);

    const chargerDonnees = async () => {

        const data = await fetch (`${API}/stats`);
        const dataJson = await data.json();


        setObjetStatut(dataJson.objetsStatut);
        setPoidsTotal(dataJson.poidsTotal);
        setNbObjetRayon(dataJson.nbObjetRayon);    
    }

    useEffect(() => {
        chargerDonnees();
    }, []);

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
                <dl className="stats-donneeTableau">
                    {objetStatut.map((element, index) => (
                        <div key={index} className="stats-cardData">
                            <dt className="stats-donneeTitle">{element.statut} :</dt>
                            <dd className="stats-donneeDetail">{element.nombre}</dd>
                        </div>
                    ))}
                </dl>

        </section>
    )}


    export default Stats;