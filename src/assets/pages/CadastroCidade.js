import React, { useState } from 'react';
import axios from '../../axiosConfig'; 

const CadastroCidade = () => {
  const getCurrentDateYMD = () => {
    const date = new Date();
    const year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [cidadeData, setCidadeData] = useState({
    nome: '',
    estado: '',
    dataFundacao: getCurrentDateYMD()
  });

  const [cidadeExistente, setCidadeExistente] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');
  const [showModal, setShowModal] = useState(false);

  const capitalizeWithExceptions = (str, exceptions = []) => {
    return str.toLowerCase().replace(/\b\w+/g, function (word) {
      return exceptions.includes(word) ? word : word.charAt(0).toUpperCase() + word.slice(1);
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const exceptions = ['de', 'do', 'dos', 'das'];

    const capitalizedValue = capitalizeWithExceptions(value, exceptions);

    setCidadeData({
      ...cidadeData,
      [name]: capitalizedValue
    });
    setCidadeExistente(false);
    setMensagemErro('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(`cidades?nome=${cidadeData.nome}`);

      if (response.data.data.length > 0) {
        setCidadeExistente(true);
        setMensagemErro('Esta cidade já está cadastrada.');

      } else {
        const postResponse = await axios.post('cidades', {
          nome: cidadeData.nome,
          estado: cidadeData.estado,
          fundado_em: cidadeData.dataFundacao
        });
        console.log('Dados enviados com sucesso:', postResponse.data);

        
        setShowModal(true);

        setTimeout(() => {
          setShowModal(false);
        }, 2000);

        setCidadeData({
          nome: '',
          estado: '',
          dataFundacao: getCurrentDateYMD()
        });

        setCidadeExistente(false);
        setMensagemErro('');
      }
    } catch (error) {
      console.error('Erro ao cadastrar cidade:', error);
      setMensagemErro('Erro ao cadastrar cidade. Tente novamente.');



    }
  };

  return (
    <div className="container">
      <h2 className="my-4">Cadastro de Cidade</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label htmlFor="nomeCidade" className="form-label">Nome da Cidade:</label>
          <input
            type="text"
            id="nomeCidade"
            name="nome"
            value={cidadeData.nome}
            onChange={handleInputChange}
            className="form-control"
            required
          />
          {cidadeExistente && <div className="invalid-feedback d-block">{mensagemErro}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="estado" className="form-label">Estado:</label>
          <input
            type="text"
            id="estado"
            name="estado"
            value={cidadeData.estado}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="dataFundacao" className="form-label">Data de Fundação:</label>
          <input
            type="date"
            id="dataFundacao"
            name="dataFundacao"
            value={cidadeData.dataFundacao}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Cadastrar Cidade</button>
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
                <h5 className="modal-title">Cadastro de Cidade</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {cidadeExistente ? (
                  <p>{mensagemErro}</p>
                ) : (
                  <p>Cidade cadastrada com sucesso!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CadastroCidade;
