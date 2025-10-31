import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home";
import About from "./pages/about";
import AdminServicios from "./pages/adminServicios";
import Login from "./pages/login";
import DetalleServicio from "./pages/detalleServicio";
import SolicitarServicio from './pages/SolicitarServicio';
import AdminRoles from "./pages/adminRoles";
import AdminCategorias from "./pages/adminCategorias";
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
        <Route path="/servicio/:id" element={<DetalleServicio />} />
        <Route path="/solicitar" element={<SolicitarServicio />} />
        <Route path="/solicitar/:id" element={<SolicitarServicio />} />
        <Route path="/admin/roles" element={<AdminRoles />} />
        <Route path="/admin/categorias" element={<AdminCategorias />} />

      </Routes>
    </Router>
  );
}

export default App;
