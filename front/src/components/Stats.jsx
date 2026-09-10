import { useState, useEffect, useRef, Fragment } from "react";
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
        <section>
            <div className="enRayon">
                <p>Objets en rayon :</p>
                <p>{nbObjetRayon}</p>
            </div>
            <div className="poidsTotal">
                <p>Poids Total :</p>
                <p>{poidsTotal}</p>
            </div>
            <div>
                <dl className="stats-donneeTableau">
                    {objetStatut.map((element, index) => (
                        <Fragment key={index}>
                            <dt className="donneeTitle">{element.statut}</dt>
                            <dd className="donneeDetail">{element.nombre}</dd>
                        </Fragment>
                    ))}
                </dl>
            </div>

        </section>
    )}


    export default Stats;