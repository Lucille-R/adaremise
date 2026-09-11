import './App.css';
/* import Objetsliste from './components/Objetsliste' */
import { useState } from 'react';
import { Routes, Route, Navigate } from "react-router";
import Benevoles from './components/Benevoles.jsx'
import Objetsliste from './components/Objetsliste.jsx'
// import CreationDepot from './components/CreationDepot.jsx'
import Stats from './components/Stats.jsx'
import Navbar from './components/Navbar.jsx';


function App() {

// --- Ici on verifie qu'on a bien un benevole pour afficher la liste d'objet sinon on demande l'identification ---
const [benevole, setBenevole] = useState(null)

// --- Fonction d'appel aux infos du benevole selectionne ---
const handleSelection = (nom, prenom) => {
  setBenevole({nom, prenom});
}

// --- Verification de l'etat de la variable benevole (null ou non)
  if(!benevole) {
    return (
          <Benevoles onSelect={handleSelection} />
        )};

  return (
    <>
      <Navbar />



      <main>
         <Routes>
           <Route path="/" element={<Navigate to="/objets" replace />} />
           <Route path="/objets" element={<Objetsliste />} />
           {/* <Route path="/depots" element={<CreationDepot />} /> */}
           <Route path="/stats" element={<Stats />} />
           {/* <Route /> */}
           <Route path="*" element={<p>Page introuvable</p>} /> {/* path="*" attrape tout ce qu'aucune autre route n'a reconnu. Elle se place toujours en dernier. */}
         </Routes>
      </main>
    </>
  );
};

export default App
