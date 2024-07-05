import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CadastroBairro = () => {
  const [bairroData, setBairroData] = useState({
    nome: '',
    cidade_id: '',
  });

  const [cidades, setCidades] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCidades();
  }, []);

  const fetchCidades = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/cidades');
      setCidades(response.data.data); 
    } catch (error) {
      console.error('Erro ao buscar cidades:', error);
    }
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;

    const excecoes = ['das', 'dos', 'de', 'da', 'do'];

    value = value.toLowerCase().replace(/\b\w+/g, function (str) {
      return excecoes.includes(str) ? str : str.charAt(0).toUpperCase() + str.slice(1);
    });

    setBairroData({
      ...bairroData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const postResponse = await axios.post('http://localhost:8000/api/v1/bairros', bairroData);
      console.log('Dados enviados com sucesso:', postResponse.data);

      setShowModal(true);

      setTimeout(() => {
        setShowModal(false);
      }, 2000);

      setBairroData({
        nome: '',
        cidade_id: '',
      });
    } catch (error) {
      console.error('Erro ao cadastrar bairro:', error);
    }
  };

  return (
    <div className="container">
      <h2 className="my-4">Cadastro de Bairro</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label htmlFor="nomeBairro" className="form-label">Nome do Bairro:</label>
          <input
            type="text"
            id="nomeBairro"
            name="nome"
            value={bairroData.nome}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cidade" className="form-label">Cidade:</label>
          <select
            id="cidade"
            name="cidade_id"
            value={bairroData.cidade_id}
            onChange={handleInputChange}
            className="form-select"
            required
          >
            <option value="">Selecione uma cidade</option>
            {cidades.map((cidade) => (
              <option key={cidade.id} value={cidade.id}>
                {cidade.nome}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Cadastrar Bairro
        </button>
      </form>

      {showModal && (
        <div
          className="modal"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Bairro adicionado com sucesso</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                Os dados do bairro foram adicionados com sucesso!
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CadastroBairro;
