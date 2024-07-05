import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';  

const Relatorio = () => {
  const [filtro, setFiltro] = useState({
    cidade: '',
    bairro: '',
    rua: '',
    dataInicial: '',
    dataFinal: ''
  });
  const [dadosOriginais, setDadosOriginais] = useState([]);
  const [dadosRelatorio, setDadosRelatorio] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseCidades = await axios.get('http://127.0.0.1:8000/api/v1/cidades');
        

       
        const relatorio = [];

        responseCidades.data.data.forEach(cidade => {
          cidade.bairros.forEach(bairro => {
            bairro.ruas.forEach(rua => {
              relatorio.push({
                id: rua.id, 
                estado: cidade.estado,
                cidade: cidade.nome,
                bairro: bairro.nome,
                rua: rua.nome,
                cep: rua.cep, 
                dataFundacao: cidade.fundado_em 
              });
            });
          });
        });

        setDadosOriginais(relatorio);
        setDadosRelatorio(relatorio);
      } catch (error) {
        console.error('Erro ao buscar dados do relatório:', error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setFiltro({
      ...filtro,
      [e.target.name]: e.target.value
    });
  };

  const handleFiltrar = (e) => {
    e.preventDefault();

    
    const relatorioFiltrado = dadosOriginais.filter(item => {
      return (
        (filtro.cidade === '' || item.cidade.toLowerCase().includes(filtro.cidade.toLowerCase())) &&
        (filtro.bairro === '' || item.bairro.toLowerCase().includes(filtro.bairro.toLowerCase())) &&
        (filtro.rua === '' || item.rua.toLowerCase().includes(filtro.rua.toLowerCase())) &&
        (filtro.dataInicial === '' || new Date(item.dataFundacao) >= new Date(filtro.dataInicial)) &&
        (filtro.dataFinal === '' || new Date(item.dataFundacao) <= new Date(filtro.dataFinal))
      );
    });

    setDadosRelatorio(relatorioFiltrado);
  };

  const handleLimparFiltro = () => {
    setFiltro({
      cidade: '',
      bairro: '',
      rua: '',
      dataInicial: '',
      dataFinal: ''
    });
    setDadosRelatorio(dadosOriginais); 
  };

  const handleEditar = (id) => {
    navigate(`/editar/${id}`);
  };

  const handleDeletar = async (index) => {
    const idRuaDeletar = dadosRelatorio[index].id;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/v1/ruas/${idRuaDeletar}`);

      const novoRelatorio = [...dadosRelatorio];
      novoRelatorio.splice(index, 1);
      setDadosRelatorio(novoRelatorio);

      console.log('Rua deletada com sucesso:', idRuaDeletar);
    } catch (error) {
      console.error('Erro ao deletar rua:', error);
    }
  };

  return (
    <div className="container">
      <h2 className="my-4">Relatório de Cidades, Bairros e Ruas</h2>
      
      <form onSubmit={handleFiltrar} className="mb-4">
        <div className="row g-3">
          <div className="col-md-3">
            <input
              type="text"
              name="cidade"
              value={filtro.cidade}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Filtrar por cidade"
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              name="bairro"
              value={filtro.bairro}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Filtrar por bairro"
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              name="rua"
              value={filtro.rua}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Filtrar por rua"
            />
          </div>
          <div className="col-md-2">
            <input
              type="date"
              name="dataInicial"
              value={filtro.dataInicial}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Data inicial"
            />
          </div>
          <div className="col-md-2">
            <input
              type="date"
              name="dataFinal"
              value={filtro.dataFinal}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Data final"
            />
          </div>
          <div className="col-md-1">
            <button type="submit" className="btn btn-primary">Filtrar</button>
          </div>
          <div className="col-md-1">
            <button type="button" className="btn btn-secondary" onClick={handleLimparFiltro}>Limpar</button>
          </div>
        </div>
      </form>
      
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Estado</th>
            <th>Cidade</th>
            <th>Data de Fundação</th>
            <th>Bairro</th>
            <th>Rua</th>
            <th>CEP</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {dadosRelatorio.map((item, index) => (
            <tr key={index}>
              <td>{item.estado}</td>
              <td>{item.cidade}</td>
              <td>{item.dataFundacao}</td>
              <td>{item.bairro}</td>
              <td>{item.rua}</td>
              <td>{item.cep}</td>

              <td>
                <button className="btn btn-info btn-sm" onClick={() => handleEditar(item.id)}>Editar</button>
                <button className="btn btn-danger btn-sm ms-1" onClick={() => handleDeletar(index)}>Deletar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Relatorio;
