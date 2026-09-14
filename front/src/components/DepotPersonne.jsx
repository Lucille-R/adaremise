import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import "./DepotPersonne.css";

const API = 'http://localhost:3000/api';

const DepotPersonne = () => {
	
	// Permet de récupérer les données transmises par navigate(...)
	const location = useLocation();
	const { depot, personne } = location.state;

	// Charger les catégories :
	const [categories, setCategories] = useState([]);
	const [erreurChargement, setErreurChargement] = useState(null);

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

	// Composition du formulaire (un seul objet pour les 4 champs) :
	const [ nouvelObjet, setNouvelObjet] = useState({
		libelle: "",
		poids_kg: "",
		etat_arrivee: "",
		categorie_id: "",
	});
	// Fonction appelée à chaque frappe/sélection d'un champ du formulaire :
	const handleChange = (event) => {
		const { name, value } = event.target;
		setNouvelObjet((valeurPrecedente) => ({
			...valeurPrecedente,
			[name]: value,
		}));
	};

	const [erreurEnvoi, setErreurEnvoi] = useState(null);
	// Fonction appelée au clic "Valider" du formulaire pour éviter le rechargement de la page HTML:
	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const objetAEnvoyer = {
				...nouvelObjet,
				poids_kg: Number(nouvelObjet.poids_kg)
			}
			const response = await fetch(`${API}/depots/${depot.id}/objets`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(objetAEnvoyer),
			});

			if (!response.ok) {
				const dataErreur = await response.json();
				throw new Error(dataErreur.erreur);
			}

			// Réinitialisation de nouvelObjet après avoir validé le formulaire avec succès :
			setNouvelObjet({
				libelle: "",
				poids_kg: "",
				etat_arrivee: "",
				categorie_id: "",
			});

			
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

			<h2 className="depotPersonne-titreAjoutObjet">Ajout d'un objet</h2>

			<form className="depotPersonne-formulaire" onSubmit={handleSubmit}>

				<section className="depotPersonne-donneesFormulaires">

					<input type="text" className="depotPersonne-inputLibelle" value={nouvelObjet.libelle} onChange={handleChange} name="libelle" placeholder="Nom de l'objet (30 max)" maxLength="30"/>

					<input type ="number" className="depotPersonne-inputPoids" value={nouvelObjet.poids_kg} onChange={handleChange} name="poids_kg" step="0.01" placeholder="Poids en kg" />

					<select className="depotPersonne-selectEtatArrivee" value={nouvelObjet.etat_arrivee} onChange={handleChange} name="etat_arrivee" >
						<option value="">Etat d'arrivée</option>
						<option value="bon_etat">Bon état</option>
						<option value="a_reparer">A réparer</option>
						<option value="hors_service">Hors service</option>
					</select>

					<select className="depotPersonne-selectCategorie" value={nouvelObjet.categorie_id} onChange={handleChange} name="categorie_id" >
						<option value="">Catégorie</option>
						{categories.map((categorie) => (
							<option key={categorie.id} value={categorie.id}>{categorie.libelle}</option>
						))}
					</select>
				</section>

				<button type="submit" className="depotPersonne-boutonValider" >Valider</button>

				{erreurEnvoi && <p className="depotPersonne-erreurEnvoi">{erreurEnvoi} !</p> }

			</form>
		</>
	);


};

export default DepotPersonne;