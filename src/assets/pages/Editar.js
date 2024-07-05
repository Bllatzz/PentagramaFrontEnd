import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Editar = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [ruaData, setRuaData] = useState({
    nome: '',
    cep: ''
  });
  const [erro, setErro] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseRua = await axios.get(`http://127.0.0.1:8000/api/v1/ruas/${id}`);
        
        if (responseRua.status === 200) {
          setRuaData(responseRua.data.data);
        } else {
          throw new Error(`Erro ${responseRua.status}: Não foi possível carregar os dados da rua.`);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setErro(`Erro 404: Rua não encontrada. Verifique o ID da rua na URL.`);
        } else if (error.response && error.response.status === 400) {
          setErro(`Erro 400: Requisição inválida. Verifique os parâmetros da requisição.`);
        } else {
          console.error('Erro ao buscar dados da rua:', error);
          setErro('Erro ao carregar dados da rua. Tente novamente mais tarde.');
        }
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    setRuaData({
      ...ruaData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/v1/ruas/${id}`, {
        nome: ruaData.nome,
        cep: ruaData.cep
      });

      if (response.status === 200) {
        navigate('/');
      }
    } catch (error) {
      console.error('Erro ao atualizar rua:', error);
      setErro('Erro ao atualizar rua. Tente novamente.');
    }
  };

  if (!ruaData) {
    return (
      <div className="container">
        {erro && (
          <div className="alert alert-danger mb-4">
            <h4>Erro</h4>
            <p>{erro}</p>
          </div>
        )}
        <div>Carregando...</div>
      </div>
    );
  }

  return (
    <div className="container">
      {erro && (
        <div className="alert alert-danger mb-4">
          <h4>Erro</h4>
          <p>{erro}</p>
        </div>
      )}

      <h2 className="my-4">Editar Rua</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label htmlFor="nomeRua" className="form-label">Nome da Rua:</label>
          <input
            type="text"
            id="nomeRua"
            name="nome"
            value={ruaData.nome}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cepRua" className="form-label">CEP:</label>
          <input
            type="text"
            id="cepRua"
            name="cep"
            value={ruaData.cep}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Atualizar Rua
        </button>
      </form>
    </div>
  );
};

export default Editar;
