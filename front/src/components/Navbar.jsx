import { useState, useEffect } from "react";
import { Link } from "react-router";
import "./Navbar.css"

const Navbar = () => {


  return (
    <nav className="navbar-navigation">
      <Link className="navbar-boutonNavigation" to="/">Les Objets</Link>
      <Link className="navbar-boutonNavigation" to="/depots">Dépôt</Link>
      <Link className="navbar-boutonNavigation" to="/films/nouveau">Ajouter un film</Link>
    </nav>
  );
}

export default Navbar;