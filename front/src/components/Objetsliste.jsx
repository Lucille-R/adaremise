import { useState, useEffect } from "react";
import './Objetsliste.css';
import Filtres from './Filtres.jsx'


function Objetsliste () {
    const [objets, setObjets] = useState([]);
    
    const [statutFiltre, setStatutFiltre] = useState("");
    
    const [categories , setCategories] = useState([]);
    const [categorieFiltre, setCategorieFiltre] = useState("")

    const [selectObjet, setSelectObjet] = useState("")
    const [selectObjetContent, setSelectObjetContent] = useState("")

    const [curentSelectStatut, setCurentSelectStatut] = useState("")


    const handleStatutChange = (nouveauStatut) => {
        setStatutFiltre(nouveauStatut);
    }

    const handleCategorieChange = (nouvelleCategorie) => {
        setCategorieFiltre(nouvelleCategorie);
    }

    const handleObjetChange = (nouveauObjet) => {
        if (nouveauObjet === selectObjet) {
            return setSelectObjet("")
        }
        setSelectObjet(nouveauObjet);
    }

    const handleModifStatut = (modifStatut) => {
        setCurentSelectStatut(modifStatut);
    }

    const handleValidStatut = async (idObjet) => {
        await fetch(`http://localhost:3000/api/objets/${idObjet}/statut` , {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({statut : curentSelectStatut})
            });

            chargerObjets();
    }

    async function chargerObjets() {
        const params = new URLSearchParams();

        if (statutFiltre) {
            params.append('statut', statutFiltre);
        }
        if (categorieFiltre) {
            params.append('categorie_id', categorieFiltre);
        }

        const queryString = params.toString();
        const url = queryString
            ? `http://localhost:3000/api/objets?${queryString}`
            : 'http://localhost:3000/api/objets';
        
            const reponse = await fetch(url);
        const data = await reponse.json();
        setObjets(data);
    }
    
    useEffect(() => {
        chargerObjets();
    }, [statutFiltre, categorieFiltre]);
    
    useEffect(() => {
        async function chargerCategories() {
            const reponse = await fetch('http://localhost:3000/api/categories');
            const data = await reponse.json();
            setCategories(data);
        } 
        chargerCategories();
    }, []);

    useEffect(() => {
        async function chargerSelectObjet() {
            if (!selectObjet) {
                return 
            }
            const reponse = await fetch(`http://localhost:3000/api/objets/${selectObjet}`)
            const data = await reponse.json(); 
            setSelectObjetContent(data)
        }
        chargerSelectObjet();
    }, [selectObjet])
    return (
        <>

        <div className="objetliste_globalbox">

        <div className="filtre_objets_box">
        
            <Filtres statut={statutFiltre} onStatutChange={handleStatutChange} categories={categories} categorieFiltre={categorieFiltre} onCategorieChange={handleCategorieChange}/>
                
        </div>  

        <div className="objets_box">
            
                <h2 className="objetsListeTitre">Stock de La Remise</h2>

                <section className="objetsListeOnboarding">
                        <p className="objetsListeOnboardingText">Veuillez trouver ci dessous la liste complète des objets présent dans notre stock.
                            Vous pouvez filtrer chaque resultat grâce à la barre située à votre gauche, ainsi qu'obtenir plus d'informations sur un objets particulier en cliquant sur son bandeau.
                        </p>
                </section>
                
            <div className="objetliste-bandeau">

                <ul>
                    {objets.map((objet) =>(
                        <li 
                        key={objet.id} 
                        className="objetsliste-objet" 
                        onClick={() => handleObjetChange(objet.id)}>
                            {objet.libelle} --- Catégorie : {objet.categorie} --- Prix : {objet.prix} € --- Statut de l'objet : {objet.statut} 
                            {selectObjet === objet.id && (
                                <div onClick={(e) => e.stopPropagation()}>
                                    <p>

                                    {` --- Poids : ${selectObjetContent.poids_kg} kg --- Etat : ${selectObjetContent.etat_arrivee} --- Date de mise en rayon : ${selectObjetContent.date_mise_rayon ? new Date(selectObjetContent.date_mise_rayon).toLocaleDateString('fr-FR') : "Aucune date renseignée"}`}

                                    </p>

                                    <select value={curentSelectStatut} onChange={(e) => setCurentSelectStatut(e.target.value)}className="objetliste_selectstatut">
                                        <option value="arrive">Arrivé</option>
                                        <option value="en_reparation">En reparation</option>
                                        <option value="en_rayon">En rayon</option>
                                        <option value="vendu">Vendu</option>
                                        <option value="recycle">Recycle</option>
                                    </select>
                    
                                    <button className="objetlist_valid" onClick={() => handleValidStatut(objet.id)}>Modifier</button>
                                    
                                </div>
                            )}
                        </li>
        
                    ))}
                    
                </ul>
        
            </div>
        
        </div>      
        
        
            
        </div>

        </>
    )
};


export default Objetsliste;