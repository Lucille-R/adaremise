import "./Entete.css";
import logo from "./../../assets/logo.jpg"
import decoIcon from "./../../assets/power.png"

const Entete = ({benevole, deconnection}) => {


    return(
        <header className="entete-header">
            <img className="entete-logo" src={logo} alt="Logo La Remise"/>
                <div className="entete-identifiant">
                    <p className="entete-benevole">{benevole.nom} {benevole.prenom}</p>
                    <button className="entete-btnRemove" onClick={() => deconnection(null)}><img className="entete-decoImg" src={decoIcon} alt="Bouton Deconnexion"/></button>
                </div>
        </header>   
    )};

export default Entete;