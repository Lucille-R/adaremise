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
            
                <h2 className="objetsliste-titre">Stock de La Remise</h2>

                <section className="objetsliste-onboarding">
                        <p className="objetsListeOnboardingText">Veuillez trouver ci-dessous la liste complète des objets présents dans notre stock. <br /><br />
                            Vous pouvez filtrer chaque résultat grâce à la barre située à votre gauche, ainsi qu'obtenir plus d'informations sur un objet particulier en cliquant sur son bandeau. <br /><br />
                            Après avoir préalablement modifié le statut de l'objet sélectionné, vous pouvez en confirmer sa sélection avec le bouton "modifier".
                        </p>
                </section>
                
            <div className="objetliste-bandeau">

                <ul>
                    {objets.map((objet) =>(
                        <li 
                        key={objet.id} 
                        className="objetsliste-objet" 
                        onClick={() => handleObjetChange(objet.id)}>
                            {/* {objet.libelle}      {objet.categorie}      Statut de l'objet : {objet.statut}  */
                            <div className="objetliste-bandeauobjet">

                                <p className="objetsliste-objetNom">{objet.libelle}</p>

                                <div className="objetliste-bandeauobjetCategorie">

                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-tag"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>
                                    
                                    {`${objet.categorie}`}    

                                </div>

                                <div className="objetliste-bandeauobjetStatut">

                                    {`${objet.statut}`}

                                </div>

                            </div>
                            }
                            {selectObjet === objet.id && (
                                <div onClick={(e) => e.stopPropagation()}>
                                    {
                                    <div className="objetlist-objetexpansion">
                                        
                                        <div className="objetlist-prix">

                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-piggy-bank"><path d="M11 17h3v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a3.16 3.16 0 0 0 2-2h1a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-1a5 5 0 0 0-2-4V3a4 4 0 0 0-3.2 1.6l-.3.4H11a6 6 0 0 0-6 6v1a5 5 0 0 0 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1z"/><path d="M16 10h.01"/><path d="M2 8v1a2 2 0 0 0 2 2h1"/></svg>
                                            
                                            {`${objet.prix} €`}

                                        </div>

                                        <div className="objetlist-poids">

                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-weight"><circle cx="12" cy="5" r="3"/><path d="M6.5 8a2 2 0 0 0-1.905 1.46L2.1 18.5A2 2 0 0 0 4 21h16a2 2 0 0 0 1.925-2.54L19.4 9.5A2 2 0 0 0 17.48 8Z"/></svg>

                                            {`${selectObjetContent.poids_kg} kg`}

                                        </div>

                                        <div className="objetlist-etat">

                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cog"><path d="M11 10.27 7 3.34"/><path d="m11 13.73-4 6.93"/><path d="M12 22v-2"/><path d="M12 2v2"/><path d="M14 12h8"/><path d="m17 20.66-1-1.73"/><path d="m17 3.34-1 1.73"/><path d="M2 12h2"/><path d="m20.66 17-1.73-1"/><path d="m20.66 7-1.73 1"/><path d="m3.34 17 1.73-1"/><path d="m3.34 7 1.73 1"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="12" r="8"/></svg>

                                            {`${selectObjetContent.etat_arrivee}`}

                                        </div>

                                        <div className="objetlist-date">

                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-days"><path d="M8 2v3"/><path d="M16 2v3"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M8 13h.01"/><path d="M12 13h.01"/><path d="M16 13h.01"/><path d="M8 17h.01"/><path d="M12 17h.01"/><path d="M16 17h.01"/></svg>

                                            {`Mise en rayon : ${selectObjetContent.date_mise_rayon ? new Date(selectObjetContent.date_mise_rayon).toLocaleDateString('fr-FR') : "Aucune date"}`}

                                        </div>
                                    
                                    </div>
                                    }
                                    <div className="objetlist-objetModif">

                                    <select value={curentSelectStatut} onChange={(e) => setCurentSelectStatut(e.target.value)}className="objetliste-selectStatut">
                                        <option value="arrive">Arrivé</option>
                                        <option value="en_reparation">En reparation</option>
                                        <option value="en_rayon">En rayon</option>
                                        <option value="vendu">Vendu</option>
                                        <option value="recycle">Recycle</option>
                                    </select>
                    
                                    <button className="objetlist-valid" onClick={() => handleValidStatut(objet.id)}>Modifier</button>

                                    </div>

                                    
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
