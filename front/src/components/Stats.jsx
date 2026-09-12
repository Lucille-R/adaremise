import { useState, useEffect } from "react";
// --- On import depuis Chart les éléments nécessaire pour l'affichage des données ---
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";
import "./Stats.css"


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const Stats = () => {

    const API = 'http://localhost:3000/api';


    const [poidsTotal, setPoidsTotal] = useState(-1);
    const [nbObjetRayon, setNbObjetRayon] = useState(-1);
    const [erreur, setErreur] = useState(null);
    const [statuts, setStatuts] = useState([]);
    const [nbObjets, setNbObjets] = useState([]);

    const chargerDonnees = async () => {
        try{

            const response = await fetch (`${API}/stats`);

            if(!response.ok){
                throw new Error (`Erreur ${response.status}: Impossible de charger les statistiques`)
            }

            const dataJson = await response.json();

            setPoidsTotal(dataJson.poidsTotal);
            setNbObjetRayon(dataJson.nbObjetRayon);
            setStatuts(dataJson.objetsStatut.map(element => element.statut));
            setNbObjets(dataJson.objetsStatut.map(element => element.nombre));

        } catch (error){
            console.error(error.message);
            setErreur(error.message)
        }
    }

    // --- Données pour établir le graphique ---
    const chartData = { labels: statuts, 
                        datasets: [{ 
                            label: "nombre", 
                            data: nbObjets, 
                            backgroundColor: "#7DB5C7",
                            // --- Effect de changement de couleur lors du passage de la souris ---
                            hoverBackgroundColor: "#F57B33" 
                        }] 
                      }

    // --- Liste des parametre visuel pour l'histogramme ---
    const chartOption = {
        responsive: true, // --- Adapte a son espace parent ---
        maintainAspectRatio: false, 
        // --- Active la legende, le titre general et l'effet tooltip lors de hover ---
        plugins: {
            legend: { display: true},
            title : { display: true, text: "Classification par statut :" },
            tooltip: {
                enabled: true,
                displayColors: false,
                backgroundColor: "transparent",
                titleColor: "transparent",
                bodyColor: "#7b501b",
                padding: 10,
                callbacks: {
                    label: function(context) {
                        return `${context.raw} objet(s)`;
                    }
                },
                // --- Parametre liée aux fonts ---
                titleFont: { size: 16 },
                bodyFont: { size: 20 }
            }
        },
        scales: {
            // --- Parametre liée a l'axe Y ---
            y: {
                beginAtZero: true,
                title: { display: false },
                ticks: { stepSize: 1,
                         font: { size: 14, weight: "bold" }
                 },
                grid: { display: false }
            },
            // --- Parametre liée a l'axe X ---
            x: {
                title: { display: false },
                grid: { display: false },
                ticks: { font: { size: 14, weight: "bold" }}
            }
        },
        // --- Parametre pour le visuel des barres ---
        elements: {
            bar: { borderRadius: 4 }
        }
    };

    // --- On charge les données au chargenebt de la page ---
    useEffect(() => {
        chargerDonnees();
    }, []);

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
            <div className="stats-generalData">
                <article className="stats-generalDatablocks">
                    <h4 className="stats-titleGenData">Objets en rayon :</h4>
                    <p className="stats-detailGenData ">{nbObjetRayon}</p>
                </article>
                <article className="stats-generalDatablocks">
                    <h4 className="stats-titleGenData">Poids Total :</h4>
                    <p className="stats-detailGenData ">{poidsTotal} kg</p>
                </article>
            </div>
            {/* Affichage Graph */}
            <article className="stats-chartStatus">
                <div className="stats-chartWrapper">
                    {/* On évite un problème d'affichage lié à l'asynchrone en attendant que le tableau ai une valeur */}
                    {statuts.length > 0 && (
                        <Bar data={chartData} 
                            options={chartOption} />
                    )}
                </div>
            </article>
        </section>
    )}


    export default Stats;