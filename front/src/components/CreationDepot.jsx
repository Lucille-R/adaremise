import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "./CreationDepot.css";

const API = 'http://localhost:3000/api';

const CreationDepot = () => {

	// Charger la liste des personnes :
	const [personnes, setPersonnes] = useState([]);
	const [erreurChargement, setErreurChargement] = useState(null);
	const navigate = useNavigate();

	const chargerListePersonnes = async () => {
		try {
			const response = await fetch(`${API}/personnes`);

			// Pour 'fetch', un appel à une route qui renvoie un status d'erreur (400, 404, 500, ...) c'est une réponse reçue donc => pas d'erreur (donc ne va pas dans le catch)
			// La propriété en lecture seule 'ok' de l'interface 'Response' contient un booléen indiquant si la réponse a réussi (status 200 à 299) ou non.
			// Donc !response.ok => Pour les status différents de 200 à 299, on force une exception : grâce à 'throw' on les envoie dans le catch
			if (!response.ok) {
				throw new Error(`Erreur ${response.status}: Impossible de charger la liste des personnes`);
			}

			const dataPersonnes = await response.json();
			setPersonnes(dataPersonnes);

		} catch (error) {
			console.error(error.message);
			setErreurChargement(error.message);
		}
	};

	useEffect(() => {
		chargerListePersonnes();
	}, []);

	// Ce que va contenir le formulaire (un seul objet pour les 3 champs car ils font partie du même formulaire et seront envoyés ensemble dans un seul req.body) :
	const [nouveauDepot, setNouveauDepot] = useState({
		personne_id: "",
		date_depot: "",
		type: "",
	});
	// Fonction appelée à chaque frappe/sélection d'un champ du formulaire :
	const handleChange = (event) => {
		const { name, value } = event.target;
		setNouveauDepot((valeurPrecedente) => ({
			...valeurPrecedente,
			[name]: value,
		}));
	};

	const [erreurEnvoi, setErreurEnvoi] = useState(null);

	// Fonction appelée au clic "Valider" du formulaire pour éviter le rechargement de la page HTML:
	const handleSubmit = async (event) => {
		event.preventDefault();
		 try {
			const response = await fetch(`${API}/depots`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(nouveauDepot),
			});

			if (!response.ok) {
				const dataErreur = await response.json();
				throw new Error(dataErreur.erreur);
			}

			// Pour stocker les données du dépôt créé et les afficher dans NouveauDepot : 
			const dataDepotCree = await response.json();
			const personneTrouvee = personnes.find((personne) => {
				return personne.id === dataDepotCree.personne_id
			});
			navigate(`/depots/${dataDepotCree.id}/objets`, {
				state: { 
					depot: dataDepotCree,
					personne: personneTrouvee
				},
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
			<h2>Nouveau dépôt</h2>

			<form onSubmit={handleSubmit}>
				
				<section className="creationDepot-donneesFormulaire">
					<select className="creationDepot-selectPersonne" value={nouveauDepot.personne_id} onChange={handleChange} name="personne_id" >
						<option value="">Choisir un donateur</option>
						{personnes.map((personne) => (
							<option key={personne.id} value={personne.id}>{personne.nom} {personne.prenom}</option>
						))}
					</select>

					<input type="date" className="creationDepot-inputDate" value={nouveauDepot.date_depot} onChange={handleChange} name="date_depot" />

					<select className="creationDepot-selectType" value={nouveauDepot.type} onChange={handleChange} name="type">
						<option value="">Type de dépôt</option>
						<option value="boutique">Boutique</option>
						<option value="domicile">Domicile</option>
					</select>
				</section>

				<button type="submit" className="creationDepot-boutonValider">Valider</button>

				{erreurEnvoi && <p className="creationDepot-erreurEnvoi">{erreurEnvoi}</p>}

			</form>

		</>
	);
};

export default CreationDepot;