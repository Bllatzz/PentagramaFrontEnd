import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CadastroRua = () => {
  const [ruaData, setRuaData] = useState({
    nome: '',
    bairro_id: '',
    cep: ''
  });

  const [bairros, setBairros] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBairros();
  }, []);

  const fetchBairros = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/bairros');
      setBairros(response.data.data);
    } catch (error) {
      console.error('Erro ao buscar bairros:', error);
    }
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;

    value = value.toLowerCase().replace(/\b\w/g, function (char) {
      return /[ \t\r\n\f\v]/.test(char) ? char : char.toUpperCase();
    });

    const excecoes = ['das', 'dos', 'de'];
    const words = value.split(' ').map(word => excecoes.includes(word.toLowerCase()) ? word.toLowerCase() : word);

    value = words.join(' ');

    setRuaData({
      ...ruaData,
      [name]: value
    });
  };

  const handleCEPChange = async (cep) => {
    cep = cep.replace(/\D/g, '');

    cep = cep.slice(0, 9).replace(/^(\d{5})(\d)/, '$1-$2');

    setRuaData({
      ...ruaData,
      cep: cep
    });

    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      if (response.data.erro) {
        setRuaData({
          ...ruaData,
          nome: '',
          bairro_id: '',
        });
        setErro('CEP não encontrado. Por favor verifique se foi preenchido corretamente.');
        console.error('CEP não encontrado:', response.data);
      } else {
        setRuaData({
          ...ruaData,
          cep: response.data.cep,
          nome: response.data.logradouro ? response.data.logradouro.slice(0, 50) : '',
          bairro_id: response.data.bairro ? findBairroId(response.data.bairro) : ''
        });
        setErro('');
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  };

  const findBairroId = (bairroNome) => {
    const bairro = bairros.find(b => b.nome === bairroNome);
    return bairro ? bairro.id : '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const postResponse = await axios.post('http://localhost:8000/api/v1/ruas', ruaData);
      console.log('Dados enviados com sucesso:', postResponse.data);

      setShowModal(true);

      setTimeout(() => {
        setShowModal(false);
      }, 2000);

      setRuaData({
        nome: '',
        bairro_id: '',
        cep: ''
      });
    } catch (error) {
      setErro('Erro ao cadastrar rua. Por favor, tente novamente.');
      console.error('Erro ao cadastrar rua:', error);
    }
  };

  return (
    <div className="container">
      <h2 className="my-4">Cadastro de Rua</h2>
      {mensagem && (
        <div className="alert alert-success">{mensagem}</div>
      )}
      {erro && (
        <div className="alert alert-danger">{erro}</div>
      )}
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
          <label htmlFor="bairro" className="form-label">Bairro:</label>
          <select
            id="bairro"
            name="bairro_id"
            value={ruaData.bairro_id}
            onChange={handleInputChange}
            className="form-select"
            required
          >
            <option value="">Selecione um bairro</option>
            {bairros.map(bairro => (
              <option key={bairro.id} value={bairro.id}>{bairro.nome}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="cep" className="form-label">CEP:</label>
          <input
            type="text"
            id="cep"
            onChange={(e) => handleCEPChange(e.target.value)}
            value={ruaData.cep}
            placeholder="Digite o CEP da rua..."
            className="form-control"
            maxLength={9} 
            required
          />
          {ruaData.cep && !ruaData.nome && (
            <div className="alert alert-danger mt-2">CEP não encontrado. Por favor, verifique se foi preenchido corretamente.</div>
          )}
        </div>
        <button type="submit" className="btn btn-primary">Cadastrar Rua</button>
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
                <h5 className="modal-title">Rua adicionada com sucesso</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                Os dados da rua foram adicionados com sucesso!
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CadastroRua;
