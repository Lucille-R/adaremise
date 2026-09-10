import './App.css';
/* import Objetsliste from './components/Objetsliste' */
import { useState } from 'react';
import { Routes, Route } from "react-router";
import Benevoles from './components/Benevoles.jsx'


function App() {

const [benevole, setBenevole] = useState(null)

const handleSelection = (nom, prenom) => {
  setBenevole({nom, prenom});
}

  if(!benevole) {
    return (
          <Benevoles onSelect={handleSelection} />
        )}

  return (
    <>
      <Navbar />



      <main>
         <Routes>
           <Route path="/objets" element={<Objetsliste />} />
           <Route path="/depots" element={<CreationDepot />} />
           <Route path="/stats" element={<Stats />} />
           <Route path="/" element={<Benevoles />} />
           <Route />
           <Route path="*" element={<p>Page introuvable</p>} /> {/* path="*" attrape tout ce qu'aucune autre route n'a reconnu. Elle se place toujours en dernier. */}
         </Routes>
      </main>
    </>
  );
};

export default App
