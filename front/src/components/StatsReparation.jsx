import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { useState, useEffect } from "react";
import "./StatsReparation.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const StatsReparation = () => {

    const API = 'http://localhost:3000/api';

    const [data, setData] = useState([]);
    const [erreur, setErreur] = useState(null);

    const chargerDonnees = async () => {
        try {

            const response = await fetch (`${API}/stats/reparation`);

            if(!response.ok){
                throw new Error (`Erreur ${response.status}: Impossible de charger les statistiques`);
            }

            const dataJson = await response.json();

            setData(dataJson);
            console.log(dataJson);

            } catch (error){
                console.error(error.message);
                setErreur(error.message)
            }
    }

    useEffect(() => {
        chargerDonnees();
    }, []);

    const chartData = { labels: data.map(element => element.libelle), 
                        datasets: [{ 
                                        label: "Réussie", 
                                        data: data.map(element => element.reussie), 
                                        backgroundColor: "#6eb289",
                                        // --- Effect de changement de couleur lors du passage de la souris ---
                                        hoverBackgroundColor: "#F57B33",
                                        categoryPercentage: 0.4,
                                        barPercentage: 0.7
                                    },
                                    {
                                        label: "Échouée",
                                        data: data.map(element => element.echouee),
                                        backgroundColor: "#c55757",
                                        // --- Effect de changement de couleur lors du passage de la souris ---
                                        hoverBackgroundColor: "#F57B33",
                                        categoryPercentage: 0.4,
                                        barPercentage: 0.7
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
                text: "Réparations réussies et échouées par catégorie",
                font: {
                    size: 20,
                    weight: "bold"
                } },
            tooltip: {
                enabled: true,
                displayColors: false,
                backgroundColor: "transparent",
                titleColor: "transparent",
                bodyColor: "#e49431",
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
                ticks: { font: { size: 14, weight: "bold" }}
            }
        },
        // --- Parametre pour le visuel des barres ---
        elements: {
            bar: { borderRadius: 4 }
        }
    };

    if (erreur) {
        return (
            <article className="statsReparation-erreur">
                <p>{erreur}</p>
            </article>
        );
    }

    return (
            <article className="statsReparation-chart">
                <div className="statsReparation-chartWrapper">
                    {/* On évite un problème d'affichage lié à l'asynchrone en attendant que le tableau ai une valeur */}
                    {data.length > 0 && (
                        <Bar data={chartData} 
                            options={chartOption} />
                    )}
                </div>
            </article>
    )}

export default StatsReparation;