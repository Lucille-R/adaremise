import { useState, useEffect } from "react";
import "./StatsCA.css";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StatsCA = () => {

    const API = 'http://localhost:3000/api';

    const [data, setData] = useState([]);
    const [erreur, setErreur] = useState(null);

    const chargerDonnees = async () => {
        try{

        const response = await fetch(`${API}/stats/ca`);

        if(!response.ok){
             throw new Error (`Erreur ${response.status}: Impossible de charger les statistiques`);
        }

        const data = await response.json();

        setData(data);

        } catch (error) {
                console.error(error.message);
                setErreur(error.message)
        }

    }

    useEffect(() =>{
        chargerDonnees();
    },[]);

    const chartData = {
        labels: data.map(item => item.mois), // à formater selon ce que ton API renvoie (voir point 4)
        datasets: [{
            label: "Chiffre d'affaires",
            data: data.map(item => Number(item.ca)), // Number() car SUM renvoie une string via pg
            borderColor: "#7DB5C7",
            backgroundColor: "#eaad2a",
            pointRadius: 5,
            pointHoverRadius: 7,
            tension: 0.3
        }]
    };

    const chartOption = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: "Chiffre d'affaires par mois",
                font: { size: 30, weight: "bold" }
            },
            tooltip: {
                enabled: true,
                displayColors: false,
                backgroundColor: "#222222",
                titleColor: "#f48342",
                bodyColor: "tansparent",
                callbacks: {
                    label: (context) => `${context.raw} €`
                }
            }
        },
        scales: {
            y: { beginAtZero: true },
            x: {}
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
        <article className="statsCA-chart">
            <div className="statsCA-chartWrapper">
                {data.length > 0 && (
                    <Line data={chartData} options={chartOption} />
                )}
            </div>
        </article>
    )}

    export default StatsCA;