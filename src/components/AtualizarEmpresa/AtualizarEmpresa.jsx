"use client";
import { useEffect, useState } from "react";
import style from "./AtualizarEmpresa.module.css";
import Header from "../Header/Header";
import { motion } from "framer-motion";
import axios from "axios";

const AtualizarEmpresa = () => {
  const [empresa, setEmpresa] = useState(null);
  const [mensagemSucesso, setMensagemSucesso] = useState(null);
  const [mensagemErro, setMensagemErro] = useState(null);
  const [novoRamo, setNovoRamo] = useState("");
  const [etapa, setEtapa] = useState(1);
  const [ramoId, setRamoId] = useState("");
  const [ramoNome, setRamoNome] = useState("");
  const [ramos, setRamos] = useState([]);
  const [responsaveis, setResponsaveis] = useState([]);
  const [responsavelId, setResponsavelId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cnpjEmpresa = localStorage.getItem("cnpjEmpresa");

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/empresa/obter",
          { cnpj: cnpjEmpresa },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        setEmpresa(response.data);
        if (response.data.responsavel)
          setResponsavelId(response.data.responsavel.id);
        if (response.data.ramo) setRamoId(response.data.ramo.id);
      } catch (error) {
        console.error("Erro ao buscar empresa:", error);
        setMensagemErro("Não foi possível carregar os dados da empresa.");
      }
    };
    fetchEmpresa();
  }, [cnpjEmpresa]);

  const listarRamos = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await axios.get(
        "http://localhost:8080/ramo/obter-ramos",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRamos(response.data);
    } catch (error) {
      console.error("Erro ao listar ramos:", error);
      setMensagemErro("Erro ao listar ramos. Tente novamente.");
    }
  };

  const listarResponsaveis = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await axios.get(
        "http://localhost:8080/visitante/listar-visitantes-disponiveis",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResponsaveis(response.data);
    } catch (error) {
      console.error("Erro ao listar responsaveis:", error);
      setMensagemErro("Erro ao listar responsaveis. Tente novamente.");
    }
  };

  useEffect(() => {
    listarRamos();
    listarResponsaveis();
  }, []);

  const handleSubmitGeral = async (event) => {
    event.preventDefault();
    setMensagemSucesso(null);
    setMensagemErro(null);

    const formData = new FormData(event.target);
    const dadosGeral = {
      nomeFantasia: formData.get("nomeFantasia"),
      razaoSocial: formData.get("razaoSocial"),
      email: formData.get("email"),
      telefone: formData.get("telefone"),
      cnpj: formData.get("cnpj"),
      ramo: { id: parseInt(ramoId) },
      responsavel: { nomeCompleto: localStorage.getItem("nomeResponsavel") },
      endereco: {
        logradouro: formData.get("logradouro"),
        numero: formData.get("numero"),
        complemento: formData.get("complemento"),
        cep: formData.get("cep"),
        cidade: formData.get("cidade"),
        estado: formData.get("estado"),
        pais: formData.get("pais"),
      },
    };

    try {
      await axios.put("http://localhost:8080/empresa/atualizar", dadosGeral, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      setMensagemSucesso(
        "Dados da empresa e endereço atualizados com sucesso!"
      );
      setEtapa(1);
      listarRamos();
    } catch (error) {
      console.error("Erro ao atualizar dados gerais:", error);
      setMensagemErro("Erro ao atualizar dados gerais. Tente novamente.");
    }
  };

  const handleDesativarEmpresa = async () => {
    setMensagemSucesso(null);
    setMensagemErro(null);
    try {
      await axios.put(
        "http://localhost:8080/empresa/desativar",
        { cnpj: cnpjEmpresa },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setMensagemSucesso("Empresa desativada com sucesso!");
    } catch (error) {
      console.error("Erro ao desativar Empresa:", error);
      setMensagemErro("Erro ao desativar Empresa. Tente novamente.");
    }
  };

  const handleAtivarEmpresa = async () => {
    setMensagemSucesso(null);
    setMensagemErro(null);
    try {
      await axios.put(
        "http://localhost:8080/empresa/ativar",
        { cnpj: cnpjEmpresa },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setMensagemSucesso("Empresa ativada com sucesso!");
    } catch (error) {
      console.error("Erro ao ativar Empresa:", error);
      setMensagemErro("Erro ao ativar Empresa. Tente novamente.");
    }
  };

  const handleNovoRamo = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const valorRamo = novoRamo.trim();
    if (!valorRamo) {
      alert("Preencha o campo do ramo para cadastrar!");
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8080/ramo/cadastrar",
        { ramo: valorRamo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNovoRamo("");
      listarRamos();
      setEtapa(1);
    } catch (error) {
      console.error("Erro ao cadastrar ramo:", error);
      setMensagemErro("Erro ao cadastrar ramos. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ...código anterior
  return (
    <>
      <Header />
      <motion.main
        className={style.mainContainer}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className={style.titleAndButtonContainer}>
          <motion.button
            className={style.returnButton}
            onClick={() => (window.location.href = "/cadastrarEmpresa")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ←
          </motion.button>
          <h1 className={style.title}>Atualizar Empresa</h1>
        </div>

        {etapa === 1 && (
          <div className={style.formsContainer}>
            {/* Novo contêiner para alinhar os formulários */}
            <div className={style.formSectionsWrapper}>
              {/* Seção de Dados Gerais */}
              <motion.div className={style.formContainer}>
                <h2 className={style.formTitle}>Dados Gerais</h2>
                <form className={style.form} onSubmit={handleSubmitGeral}>
                  <div className={style.inputGrid}>
                    <div className={style.inputGroup}>
                      <label htmlFor="nomeFantasia">Nome Fantasia</label>
                      <input
                        type="text"
                        name="nomeFantasia"
                        defaultValue={empresa?.nomeFantasia || ""}
                        required
                      />
                    </div>
                    <div className={style.inputGroup}>
                      <label htmlFor="razaoSocial">Razão Social</label>
                      <input
                        type="text"
                        name="razaoSocial"
                        defaultValue={empresa?.razaoSocial || ""}
                        required
                      />
                    </div>
                    <div className={style.inputGroup}>
                      <label htmlFor="cnpj">CNPJ</label>
                      <input
                        type="text"
                        name="cnpj"
                        defaultValue={empresa?.cnpj || ""}
                        required
                      />
                    </div>
                    <div className={style.inputGroup}>
                      <label htmlFor="email">E-mail</label>
                      <input
                        type="email"
                        name="email"
                        defaultValue={empresa?.email || ""}
                        required
                      />
                    </div>
                    <div className={style.inputGroup}>
                      <label htmlFor="telefone">Telefone</label>
                      <input
                        type="tel"
                        name="telefone"
                        defaultValue={empresa?.telefone || ""}
                      />
                    </div>
                    <div className={style.inputGroup}>
                      <label htmlFor="responsavel">Responsável</label>
                      <select
                        name="responsavel"
                        value={responsavelId}
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          setResponsavelId(selectedValue);
                          const selectedOption =
                            e.target.options[e.target.selectedIndex];
                          localStorage.setItem(
                            "nomeResponsavel",
                            selectedOption.text
                          );
                        }}
                      >
                        <option value="">Selecione um responsável</option>
                        {responsaveis.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.nomeCompleto}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={style.inputGroup}>
                      <label htmlFor="ramo">Ramo de Atividade</label>
                      <select
                        name="ramo"
                        value={ramoId}
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          if (selectedValue === "novo") {
                            setEtapa(0);
                          } else {
                            const selectedOption =
                              e.target.options[e.target.selectedIndex];
                            setRamoId(selectedValue);
                            setRamoNome(selectedOption.text);
                          }
                        }}
                      >
                        <option value="">Selecione um ramo</option>
                        {ramos.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.ramo}
                          </option>
                        ))}
                        <option value="novo">+ Adicionar novo ramo</option>
                      </select>
                    </div>
                  </div>
                </form>
              </motion.div>

              {/* Seção de Endereço */}
              <motion.div className={style.formContainer}>
                <h2 className={style.formTitle}>Endereço</h2>
                <div className={style.inputGrid}>
                  <div className={style.inputGroup}>
                    <label htmlFor="logradouro">Logradouro</label>
                    <input
                      type="text"
                      name="logradouro"
                      defaultValue={empresa?.endereco.logradouro || ""}
                    />
                  </div>
                  <div className={style.inputGroup}>
                    <label htmlFor="numero">Número</label>
                    <input
                      type="text"
                      name="numero"
                      defaultValue={empresa?.endereco.numero || "Sem número"}
                    />
                  </div>
                  <div className={style.inputGroup}>
                    <label htmlFor="complemento">Complemento</label>
                    <input
                      type="text"
                      name="complemento"
                      defaultValue={
                        empresa?.endereco.complemento || "Sem complemento"
                      }
                    />
                  </div>
                  <div className={style.inputGroup}>
                    <label htmlFor="cep">CEP</label>
                    <input
                      type="text"
                      name="cep"
                      defaultValue={empresa?.endereco.cep || ""}
                    />
                  </div>
                  <div className={style.inputGroup}>
                    <label htmlFor="cidade">Cidade</label>
                    <input
                      type="text"
                      name="cidade"
                      defaultValue={empresa?.endereco.cidade || ""}
                    />
                  </div>
                  <div className={style.inputGroup}>
                    <label htmlFor="estado">Estado</label>
                    <input
                      type="text"
                      name="estado"
                      defaultValue={empresa?.endereco.estado || ""}
                    />
                  </div>
                  <div className={style.inputGroup}>
                    <label htmlFor="pais">País</label>
                    <input
                      type="text"
                      name="pais"
                      defaultValue={empresa?.endereco.pais || ""}
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            <div className={style.actionButtons}>
              <motion.button
                type="submit"
                form="mainForm"
                className={style.submitButton}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Atualizar Dados da Empresa
              </motion.button>
              <motion.button
                type="button"
                className={style.desativarButton}
                onClick={handleDesativarEmpresa}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Desativar
              </motion.button>
              <motion.button
                type="button"
                className={style.ativarButton}
                onClick={handleAtivarEmpresa}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Reativar
              </motion.button>
            </div>
          </div>
        )}

        {/* ... outras etapas do formulário ... */}
        {etapa === 0 && (
          <motion.div
            className={style.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className={style.modalContainer}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <form onSubmit={handleNovoRamo} className={style.form}>
                <h2 className={style.titleStep}>Cadastrar novo Ramo</h2>
                <div className={style.inputGroup}>
                  <label htmlFor="novoRamo">Informe o nome do ramo</label>
                  <input
                    type="text"
                    id="novoRamo"
                    name="novoRamo"
                    placeholder="Digite o ramo"
                    value={novoRamo}
                    onChange={(e) => setNovoRamo(e.target.value)}
                  />
                </div>

                <div className={style.buttonGroup}>
                  <motion.button
                    type="button"
                    className={style.buttonVoltar}
                    onClick={() => setEtapa(1)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Voltar
                  </motion.button>
                  <motion.button
                    type="submit"
                    className={style.buttonSubmit}
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isSubmitting ? "Cadastrando..." : "Cadastrar Ramo"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
        {mensagemSucesso && (
          <p className={style.successMessage}>{mensagemSucesso}</p>
        )}
        {mensagemErro && <p className={style.errorMessage}>{mensagemErro}</p>}
      </motion.main>
    </>
  );
};

export default AtualizarEmpresa;
