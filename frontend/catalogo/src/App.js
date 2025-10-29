import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home";
import About from "./pages/about";
import AdminServicios from "./pages/adminServicios";
import Login from "./pages/login";
import DetalleServicio from "./pages/detalleServicio";
import "./App.css";
import Accesibilidad from "./components/accesibilidad";
import Header from "./components/header";
import Footer from "./components/footer";

function App() {
  return (
    
    <Router>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin/servicios" element={<AdminServicios />} />
        <Route path="/login" element={<Login />} />
        <Route path="/detalle/servicio" element={<DetalleServicio />} />

      </Routes>
    </Router>
  );
}

export default App;
