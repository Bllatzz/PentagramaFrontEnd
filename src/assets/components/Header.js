import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link to="/" className="navbar-brand">Prova PentaGrama</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink to="/" className="nav-link" exact="true">Relatório</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/cadastro-cidade" className="nav-link">Cadastro de Cidade</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/cadastro-bairro" className="nav-link">Cadastro de Bairro</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/cadastro-rua" className="nav-link">Cadastro de Rua</NavLink>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
