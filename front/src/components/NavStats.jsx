import { NavLink } from "react-router";
import "./NavStats.css"


const NavStats = ({display}) => {

    return (
        <nav className="navstats-btnList">
            <button className="navstats-btn" type="button" onClick={() => display('reparation')}>Réparations</button>
            <button className="navstats-btn" type="button" onClick={() => display('ca')}>Chiffre d'affaire</button>
            <button className="navstats-btn" type="button" onClick={() => display('activite')}>Activité Bénévole</button>
            <button className="navstats-btn" type="button" onClick={() => display('objets')}>Objets par statuts</button>
        </nav>
    )}

export default NavStats;