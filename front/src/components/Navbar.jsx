import { NavLink } from "react-router";
import "./Navbar.css"

const Navbar = () => {


  return (
    <nav className="navbar-navigation">
      <NavLink to="/objets" className={function (etat) {
        return etat.isActive ? "navbar-boutonNavigation navbar-boutonActive" : "navbar-boutonNavigation" }}>Les Objets</NavLink>
      <NavLink to="/depots" className={function (etat) {
        return etat.isActive ? "navbar-boutonNavigation navbar-boutonActive" : "navbar-boutonNavigation" }}>Dépôt</NavLink>
      <NavLink to="/stats" className={function (etat) {
        return etat.isActive ? "navbar-boutonNavigation navbar-boutonActive" : "navbar-boutonNavigation" }}>Statistiques</NavLink>
    </nav>
  );
}

export default Navbar;