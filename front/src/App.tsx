import { Routes, Route } from "react-router-dom";
import Home from "./Containers/Home";
import Log from "./Containers/Log";
import NotFound from "./Containers/NotFound";
import Profil from "./Containers/Profil";
import Project from "./Containers/Project";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projet=:id" element={<Project />} />
      <Route path="/user=:id" element={<Profil />} />
      <Route path="/connexion" element={<Log />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default App;
