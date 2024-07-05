import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './assets/components/Header';
import CadastroCidade from './assets/pages/CadastroCidade';
import CadastroRua from './assets/pages/CadastroRua';
import CadastroBairro from './assets/pages/CadastroBairro';
import Relatorio from './assets/pages/Relatorio'
import Editar from './assets/pages/Editar'
import 'bootstrap/dist/css/bootstrap.css';

const App = () => {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Relatorio />} />
          <Route path="/cadastro-cidade" element={<CadastroCidade />} />
          <Route path="/cadastro-bairro" element={<CadastroBairro />} />
          <Route path="/cadastro-rua" element={<CadastroRua />} />
          <Route path="/relatorio" element={<Relatorio />} />
          <Route path="/editar/:id" element={<Editar />} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;
