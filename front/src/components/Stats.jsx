import { useState, useEffect } from "react";
// --- On import depuis Chart les éléments nécessaire pour l'affichage des données ---
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from "chart.js";
// import { Bar } from "react-chartjs-2";
import "./Stats.css";
import StatsObjets from "./StatsObjets.jsx";
import StatsActivite from "./StatsActivite.jsx";
import StatsReparation from "./StatsReparation.jsx";
import NavStats from "./NavStats.jsx"


// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const Stats = () => {

    const API = 'http://localhost:3000/api';


    const [poidsTotal, setPoidsTotal] = useState(-1);
    const [nbObjetRayon, setNbObjetRayon] = useState(-1);
    const [erreur, setErreur] = useState(null);
    const [dataDisplay, setDataDisplay] = useState("objets")


    const chargerDonnees = async () => {
        try{

            const response = await fetch (`${API}/stats`);

            if(!response.ok){
                throw new Error (`Erreur ${response.status}: Impossible de charger les statistiques`)
            }

            const dataJson = await response.json();

            setPoidsTotal(dataJson.poidsTotal);
            setNbObjetRayon(dataJson.nbObjetRayon);

        } catch (error){
            console.error(error.message);
            setErreur(error.message)
        }
    }

    // --- On charge les données au chargenebt de la page ---
    useEffect(() => {
        chargerDonnees();
    }, []);

    const display = (graphDisplay) => {
        setDataDisplay(graphDisplay)
    }

    // --- Gestion d'affichage de l'erreur ---
    if(erreur){
        return(
            <article className="stats-erreur">
                <h3>Oops !</h3>
                <p>{erreur}</p>
            </article>
        )};

    return (
        <section className="stats-stats">
            {/* Affichage données générales */}
            <div className="stats-generalData stats-blocBg">
                <article className="stats-generalDatablocks">
                    <p className="stats-detailGenData ">{nbObjetRayon}</p>
                    <h4 className="stats-titleGenData">Objets en rayon </h4>
                </article>
                <article className="stats-generalDatablocks">
                    <p className="stats-detailGenData ">{poidsTotal} kg</p>
                    <h4 className="stats-titleGenData">Poids Total Reçus </h4>
                </article>
            </div>
            <section className="stats-graphSection">
                <div className="stats-NavStatsWrapper">
                    <NavStats display={display} />
                </div>
                <div className="stats-statsObjetsWrapper">
                    {dataDisplay === "objets" && <StatsObjets />}
                    {dataDisplay === "ca" && <ChiffreAffaire />}
                    {dataDisplay === "reparation" && <StatsReparation />}
                    {dataDisplay === "activite" && <StatsActivite />}
                </div>
                <div>
                </div>
            </section>
        </section>
    )}


    export default Stats;