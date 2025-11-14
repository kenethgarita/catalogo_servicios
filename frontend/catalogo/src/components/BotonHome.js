import { Link } from "react-router-dom";
import './BotonHome.css';

const BotonHome = ({ texto, ruta, onClick, icono }) => (
  <Link to={ruta || '#'} className="boton-home" onClick={onClick}>
    <span className="boton-home-texto">{texto}</span>
    <div className="boton-home-icono">
      {icono || (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      )}
    </div>
  </Link>
);
export default BotonHome;
