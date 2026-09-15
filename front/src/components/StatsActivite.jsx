import { useState, useEffect } from "react";

import { Chart as ChartJS, ArcElement, Title, Tooltip } from "chart.js";
import { Pie } from "react-chartjs-2";
import "./StatsActivite.css";

ChartJS.register(ArcElement, Title, Tooltip);

const StatsActivite = () => {

    const API = 'http://localhost:3000/api';

    const [activite, setActivite] = useState({});
    const [erreur, setErreur] = useState(null);

    const chargerDonnees = async () => {
        try{

            const response = await fetch (`${API}/stats/activite`);

            if(!response.ok){
                throw new Error (`Erreur ${response.status}: Impossible de charger les statistiques`)
            }

            const data = await response.json();

            setActivite({atelier: data.atelier, reparation: data.reparation})

            } catch (error){
                console.error(error.message);
                setErreur(error.message)
            }
    }

    useEffect(() => {
        chargerDonnees();
    }, []);

    const chartData = { labels: ["Atelier","Reparation"], 
                        datasets: [{ 
                            label: "heures", 
                            data: activite ? [activite.atelier, activite.reparation] : [0,0], 
                            backgroundColor: ["#F57B33", "#396184"],
                            // --- Effect de changement de couleur lors du passage de la souris ---
                            hoverBorderColor: '#020803',
                            hoverOffset: 25
                        }] 
    }

    const chartOption = {
        responsive: true, // --- Adapte a son espace parent ---
        maintainAspectRatio: false, 
        // --- Active la legende, le titre general et l'effet tooltip lors de hover ---
        plugins: {
            legend: { display: true},
            title : { 
                display: true, 
                text: "Heures de bénévolat",
                font: {
                    size: 30,
                    weight: "bold"
                } },
            tooltip: {
                enabled: true,
                displayColors: false,
                backgroundColor: "transparent",
                titleColor: "transparent",
                bodyColor: "#060401",
                padding: 10,
                callbacks: {
                    label: function(context) {
                        return `${context.raw} heures`;
                    }
                },
                // --- Parametre liée aux fonts ---
                titleFont: { size: 16 },
                bodyFont: { size: 20 }
            }
        },
    };

    return (
            <article className="statsActivite-chart">
                <div className="statsActivite-chartWrapper">
                    {/* On évite un problème d'affichage lié à l'asynchrone en attendant que le tableau ai une valeur */}
                    {activite.reparation > 0 && (
                        <Pie data={chartData} 
                            options={chartOption} />
                    )}
                </div>
                <div className="statsActivite-RightPanel">
                    <section className="statsActivite-legend">
                        <p><span className="statsActivite-carreViolet"></span>Heures passé en réparation</p>
                        <p><span className="statsActivite-carreBleu" ></span>Heures passé en atelier</p>
                    </section>
                    <article className="statsActivite-totalHeure">
                        <p className="statsActivite-detailGenData">{Number(activite.atelier)+Number(activite.reparation)}</p>
                        <p className="statsActivite-titleGenData">Total d'heure</p>
                    </article>
                </div>
            </article>
    )};

    export default StatsActivite;