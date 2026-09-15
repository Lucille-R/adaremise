import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import "./DepotPersonne.css";
import { PartyPopper, Trash } from "lucide-react";

const API = 'http://localhost:3000/api';

const DepotPersonne = () => {
	
	// Permet de récupérer les données transmises par navigate(...)
	const location = useLocation();
	const { depot, personne } = location.state;

	const [categories, setCategories] = useState([]);
	const [erreurChargement, setErreurChargement] = useState(null);
	const [envoiReussi, setEnvoiReussi] = useState(false);
	
	// Charger les catégories :
	const chargerListeCategories = async () => {
		try {
			const response = await fetch(`${API}/categories`);

			if (!response.ok) {
				throw new Error(`Erreur ${response.status} : Impossible de charger la liste des catégories`);
			}

			const dataCategories = await response.json();
			setCategories(dataCategories);

		} catch (error) {
			console.error(error.message);
			setErreurChargement(error.message);
		}
	};

	useEffect(() => {
		chargerListeCategories();
	}, []);

	// Composition du formulaire :
	const [ prochainId, setProchainId ] = useState(2);
	const [ nouveauxObjets, setNouveauxObjets ] = useState([{
		id: 1,
		libelle: "",
		poids_kg: "",
		etat_arrivee: "",
		categorie_id: "",
	}]);
	// Fonction appelée à chaque frappe/sélection d'un champ du formulaire, adapté pour cibler une ligne précise du tableau d'objets :
	const handleChange = (idLigne, event) => {
		const { name, value } = event.target;
		setNouveauxObjets((valeurPrecedente) => 
			valeurPrecedente.map((ligne) => // Opérateur ternaire : 'condition ? valeurSiVrai / valeurSiFaux'
				ligne.id === idLigne // Condition
					? { ...ligne, [name]: value } // Valeur si vrai : spread '...ligne' : recopie libelle, poids_kg, etat_arrivee, categorie_id, id tels qu'ils étaient, puis on écrase seulement la propriété dont le nom est 'name' avec la nouvelle 'value'
					: ligne // Valeur si faux : ligne non concernée par le changement, donc on la renvoie telle qu'elle était
			)
		);
	};

	// Ajouter une ligne de nouvel objet
	const ajouterLigne = () => {
		setNouveauxObjets((valeurPrecedente) => [
			...valeurPrecedente,
			{ id: prochainId, libelle: "", poids_kg: "", etat_arrivee: "", categorie_id: ""}
		]);
		setProchainId((valeurPrecedente) => valeurPrecedente + 1)
	};

	// Retirer une ligne de nouvel objet (sauf la 1ère)
	const retirerLigne = (idLigne) => {
		if (nouveauxObjets.length === 1) {
			return;
		}
		setNouveauxObjets((valeurPrecedente) =>
		valeurPrecedente.filter((ligne) => ligne.id !== idLigne)
		);
	};

	// Vérification des erreurs en front (donc avant envoi de TOUS les objets) :
	const verifierLigne = (ligne) => {
		if (!ligne.libelle || !ligne.poids_kg ||!ligne.etat_arrivee || !ligne.categorie_id) {
			return "Champ obligatoire manquant !";
		}

		const ETAT = ['bon_etat', 'a_reparer', 'hors_service'];
		if (!ETAT.includes(ligne.etat_arrivee)) {
			return "L'état d'arrivée doit valoir bon_etat, a_reparer ou hors_service !";
		}

		if (isNaN(Number(ligne.poids_kg))) {
			return "Le poids doit être un nombre !";
		}

		return null;
	};

	const [erreurEnvoi, setErreurEnvoi] = useState(null);
	// Fonction appelée au clic "Valider" du formulaire pour éviter le rechargement de la page HTML:
	const handleSubmit = async (event) => {
		event.preventDefault();
		setErreurEnvoi(null); // Efface le msg d'erreur précédent en cas de 2nde tentative
		try {
			// Vérification de TOUTES les lignes avant d'envoyer quoique ce soit :
			for (const ligne of nouveauxObjets) {
				const messageErreur = verifierLigne(ligne);
				if (messageErreur) {
					throw new Error(messageErreur);
				}
			}

			// Envoi de TOUTES les lignes, une par une :
			for (const ligne of nouveauxObjets) {
				const objetAEnvoyer = {
					...ligne,
					poids_kg: Number(ligne.poids_kg)
				};

				const response = await fetch(`${API}/depots/${depot.id}/objets`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(objetAEnvoyer),
				});
				
				
				if (!response.ok) {
					const dataErreur = await response.json();
					throw new Error(dataErreur.erreur);
				}
			}

			// Une fois TOUTES les lignes envoyées avec succès :
			setEnvoiReussi(true);

			
		} catch (error) {
			console.error(error.message);
			setErreurEnvoi(error.message);
		};
	};

	if (erreurChargement) {
		return (
			<>
				<h3>Oops !</h3>
				<p>{erreurChargement}</p>
			</>
		);
	};


	return (
		<>
			<h3 className="depotPersonne-titreDepotPersonne">Dépot N°{depot.id} - {personne.nom} {personne.prenom} </h3>	

			<section className="depotPersonne-dataDepotCree">
				<select disabled className="depotPersonne-dataDepotPersonne" value={personne.id}>
					<option value={personne.id}>{personne.nom} {personne.prenom}</option>
				</select>
				<input disabled type="date" className="depotPersonne-dataDepotDate" value={depot.date_depot.slice(0, 10)} />
				<select disabled className="depotPersonne-dataDepotType" value={depot.type}>
					<option value={depot.type}>{depot.type}</option>
				</select>
			</section>

			<h2 className="depotPersonne-titreAjoutObjet">Ajout d'objet</h2>

			<form className="depotPersonne-formulaire" onSubmit={handleSubmit}>

				{nouveauxObjets.map((ligne) => (
					<section key={ligne.id} className="depotPersonne-donneesFormulaires">

						<input type="text" className="depotPersonne-inputLibelle" value={ligne.libelle} onChange={(event) => handleChange(ligne.id, event)} name="libelle" placeholder="Nom de l'objet (30 max)" maxLength="30" disabled={envoiReussi} />

						<input type ="number" className="depotPersonne-inputPoids" value={ligne.poids_kg} onChange={(event) => handleChange(ligne.id, event)} name="poids_kg" step="0.01" placeholder="Poids (kg)" disabled={envoiReussi} />

						<select className="depotPersonne-selectEtatArrivee" value={ligne.etat_arrivee} onChange={(event) => handleChange(ligne.id, event)} name="etat_arrivee" disabled={envoiReussi} >
							<option value="">Etat d'arrivée</option>
							<option value="bon_etat">Bon état</option>
							<option value="a_reparer">A réparer</option>
							<option value="hors_service">Hors service</option>
						</select>

						<select className="depotPersonne-selectCategorie" value={ligne.categorie_id} onChange={(event) => handleChange(ligne.id,event)} name="categorie_id" disabled={envoiReussi} >
							<option value="">Catégorie</option>
							{categories.map((categorie) => (
								<option key={categorie.id} value={categorie.id}>{categorie.libelle}</option>
							))}
						</select>

						{!envoiReussi && nouveauxObjets.length > 1 && (
							<button type="button" className="depotPersonne-boutonRetirer" onClick={() => retirerLigne(ligne.id)}><Trash  color="#ff1e1a" /></button>
						)}

					</section>
					
				))}

					{!envoiReussi && <button type="button" className="depotPersonne-boutonAjoutObjet" onClick={ajouterLigne}>Ajouter un objet</button>}

					{!envoiReussi && <button type="submit" className="depotPersonne-boutonValider" >Valider</button>}

					{envoiReussi && <p className="depotPersonne-msgSucces">Tous les objets ont été ajoutés à ce dépôt avec succès <PartyPopper color="#56ADC4" /> </p>}

					{erreurEnvoi && <p className="depotPersonne-erreurEnvoi">{erreurEnvoi} !</p> }
				
			</form>
		</>
	);


};

export default DepotPersonne;