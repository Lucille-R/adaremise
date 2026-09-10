import { useState, useEffect, useRef } from "react";

const Stats = () => {

    const []=useStats();

    const chargerDonnees = async () => {

        const data = await fetch (`${API}/stats`);
        const dataJson = data.json();

        
    }





    return (
        <>


        </>
    )}