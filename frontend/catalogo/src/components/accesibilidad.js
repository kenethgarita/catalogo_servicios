import React, { useState, useEffect } from "react";

function Accesibilidad() {
  const [hover, setHover] = useState(false);
  const [modo, setModo] = useState("normal");

  // Aplica los modos de accesibilidad globalmente
  useEffect(() => {
    const root = document.documentElement;

    if (modo === "aumentar") {
      root.style.fontSize = "120%";
      root.style.filter = "none";
      root.style.backgroundColor = "";
      root.style.color = "";
    } else if (modo === "contraste") {
      root.style.fontSize = "100%";
      root.style.filter = "contrast(1.4)";
      root.style.backgroundColor = "#fff";
      root.style.color = "#000";
    } else if (modo === "alto") {
      root.style.fontSize = "100%";
      root.style.filter = "invert(1)";
    } else if (modo === "normal") {
      root.style.fontSize = "";
      root.style.filter = "";
      root.style.backgroundColor = "";
      root.style.color = "";
    }
  }, [modo]);

  const resetear = () => setModo("normal");

  return (
    <div style={styles.container}>
      <div
        style={styles.menu}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <span style={styles.texto}>Accesibilidad</span>

        <div
          style={{
            ...styles.dropdown,
            transform: hover ? "translateY(0)" : "translateY(-10px)",
            opacity: hover ? 1 : 0,
            maxHeight: hover ? "200px" : "0px",
            pointerEvents: hover ? "auto" : "none",
          }}
        >
          <div style={styles.opcion} onClick={() => setModo("aumentar")}>
            Aumentar fuente
          </div>
          <div style={styles.opcion} onClick={() => setModo("contraste")}>
            Mejorar contraste
          </div>
          <div style={styles.opcion} onClick={() => setModo("alto")}>
            Alto contraste
          </div>
          <div
            style={{ ...styles.opcion, borderTop: "1px solid #ddd" }}
            onClick={resetear}
          >
            Reiniciar
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {    
  container: {
    backgroundColor: "#F0F2F4",
    padding: "12px 20px",
    textAlign: "right",
    position: "sticky",
    top: 0,
    zIndex: 10001, // Debe estar por encima del header
  },
  menu: {
    display: "inline-block",
    position: "relative",
  },
  texto: {
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    right: 0,
    backgroundColor: "#F0F2F4",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    borderRadius: "6px",
    overflow: "hidden",
    transition: "all 0.25s ease",
    width: "160px",
    zIndex: 10002,
  },
  opcion: {
    padding: "9px 12px",
    fontSize: "14px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
};

export default Accesibilidad;