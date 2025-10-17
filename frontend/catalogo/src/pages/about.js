
import './about.css';
import React from 'react';
import Accesibilidad from '../components/accesibilidad';
import Header from '../components/header';
import Footer from '../components/footer';

function About() {
  return (
    <div className="about-page">
    <Accesibilidad />
  <Header />

    <div className="about">
      <h1>Sobre nosotros</h1>
      <p>Esta es otra página del proyecto.</p>
    </div>
  <Footer />
  </div>

  );
}

export default About;
