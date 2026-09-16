import { useState, useEffect } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const StatsObjets = () => {

    const API = 'http://localhost:3000/api';

    const [statuts, setStatuts] = useState([]);
    const [nbObjets, setNbObjets] = useState([]);
    const [erreur, setErreur] = useState(null);

    const chargerDonnees = async () => {
        try{

            const response = await fetch (`${API}/stats`);

            if(!response.ok){
                throw new Error (`Erreur ${response.status}: Impossible de charger les statistiques`)
            }

            const dataJson = await response.json();

            setStatuts(dataJson.objetsStatut.map(element => element.statut));
            setNbObjets(dataJson.objetsStatut.map(element => element.nombre));

            } catch (error){
                console.error(error.message);
                setErreur(error.message)
            }
    }

    useEffect(() => {
        chargerDonnees();
    }, []);

    const chartData = { labels: statuts, 
                        datasets: [{ 
                            label: "nombre", 
                            data: nbObjets, 
                            backgroundColor: "#7DB5C7",
                            // --- Effect de changement de couleur lors du passage de la souris ---
                            hoverBackgroundColor: "#F57B33" 
                        }] 
    }

    const chartOption = {
        responsive: true, // --- Adapte a son espace parent ---
        maintainAspectRatio: false, 
        // --- Active la legende, le titre general et l'effet tooltip lors de hover ---
        plugins: {
            legend: { display: false},
            title : { 
                display: true, 
                text: "Classification par statut ",
                font: {
                    size: 30,
                    weight: "bold"
                } },
            tooltip: {
                enabled: true,
                displayColors: false,
                backgroundColor: "transparent",
                titleColor: "transparent",
                bodyColor: "#7b501b",
                padding: 10,
                callbacks: {
                    label: function(context) {
                                let text = "objet";
                                if(context.raw > 1) text = "objets";
                                return `${context.raw} ${text}`;
                            },
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
                         font: { size: 18, weight: "bold" }
                 },
                grid: { display: false }
            },
            // --- Parametre liée a l'axe X ---
            x: {
                title: { display: false },
                grid: { display: false },
                ticks: { font: { size: 18, weight: "bold" }}
            }
        },
        // --- Parametre pour le visuel des barres ---
        elements: {
            bar: { borderRadius: 4 }
        }
    };

    return (
            <article className="stats-chartStatus">
                <div className="stats-chartWrapper">
                    {/* On évite un problème d'affichage lié à l'asynchrone en attendant que le tableau ai une valeur */}
                    {statuts.length > 0 && (
                        <Bar data={chartData} 
                            options={chartOption} />
                    )}
                </div>
            </article>
    )}

    export default StatsObjets;