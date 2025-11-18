import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import AdminServicios from "./pages/adminServicios";
import Login from "./pages/login";
import DetalleServicio from "./pages/detalleServicio";
import MisSolicitudes from './pages/misSolicitudes';
import SolicitarServicio from './pages/SolicitarServicio';
import SolicitudesResponsable from './pages/solicitudesResponsable';
import AdminRoles from "./pages/adminRoles";
import AdminCategorias from "./pages/adminCategorias";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import Perfil from "./pages/perfil";
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas Públicas - Accesibles sin login */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/servicio/:id" element={<DetalleServicio />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        
        {/* Rutas Protegidas - Solo usuarios autenticados */}
        <Route 
          path="/mis-solicitudes" 
          element={
            <ProtectedRoute>
              <MisSolicitudes />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/solicitar" 
          element={
            <ProtectedRoute>
              <SolicitarServicio />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/solicitar/:id" 
          element={
            <ProtectedRoute>
              <SolicitarServicio />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/perfil" 
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          } 
        />
        
        {/* Rutas Protegidas - Solo para Administradores */}
        <Route 
          path="/admin/servicios" 
          element={
            <ProtectedRoute requiredRole={['Administrador', 'Admin']}>
              <AdminServicios />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/roles" 
          element={
            <ProtectedRoute requiredRole={['Administrador', 'Admin']}>
              <AdminRoles />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/categorias" 
          element={
            <ProtectedRoute requiredRole={['Administrador', 'Admin']}>
              <AdminCategorias />
            </ProtectedRoute>
          } 
        />
        
        {/* Rutas Protegidas - Para Responsables y Administradores */}
        <Route 
          path="/responsable/solicitudes" 
          element={
            <ProtectedRoute requiredRole={['Administrador', 'Admin', 'Responsable']}>
              <SolicitudesResponsable />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;