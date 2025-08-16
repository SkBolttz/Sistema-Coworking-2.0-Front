"use client";
import { useEffect, useState } from "react";
import style from "./AtualizarFuncionario.module.css";
import Header from "../Header/Header";
import { motion } from "framer-motion";
import axios from "axios";

const AtualizarFuncionario = () => {
  const [funcionario, setFuncionario] = useState(null);
  const [mensagemSucesso, setMensagemSucesso] = useState(null);
  const [mensagemErro, setMensagemErro] = useState(null);
  const [mostrarModalSenha, setMostrarModalSenha] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const idFuncionario = localStorage.getItem("funcionarioId");

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  useEffect(() => {
    const fetchFuncionario = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/visitante/obter-por-id",
          { id: idFuncionario },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        setFuncionario(response.data);
      } catch (error) {
        console.error("Erro ao buscar funcionário:", error);
        setMensagemErro("Não foi possível carregar os dados do funcionário.");
      }
    };

    fetchFuncionario();
  }, [idFuncionario]);

  const handleSubmitDados = (event) => {
    event.preventDefault();
    setMensagemErro(null);
    setMensagemSucesso(null);

    const formData = new FormData(event.target);
    const dadosPessoais = {
      id: idFuncionario,
      nomeCompleto: formData.get("nome"),
      cpf: formData.get("cpf"),
      email: formData.get("email"),
      telefone: formData.get("telefone"),
      observacao: formData.get("observacao"),
    };

    if (!dadosPessoais.nomeCompleto || !dadosPessoais.cpf) {
      setMensagemErro("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    axios
      .put(
        "http://localhost:8080/visitante/atualizar",
        dadosPessoais,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setMensagemSucesso("Dados pessoais atualizados com sucesso!");
        setFuncionario(response.data);
      })
      .catch(() => setMensagemErro("Erro ao atualizar os dados pessoais."));
  };

  const handleSubmitEmpresa = (event) => {
    event.preventDefault();
    setMensagemErro(null);
    setMensagemSucesso(null);

    const formData = new FormData(event.target);
    const dadosEmpresa = {
      id: idFuncionario,
      empresa: formData.get("empresa"),
      tipoVisitante: formData.get("tipoVisitante"),
    };

    axios
      .put(
        "http://localhost:8080/visitante/atualizar",
        dadosEmpresa,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setMensagemSucesso("Dados da empresa atualizados com sucesso!");
        setFuncionario(response.data);
      })
      .catch(() => setMensagemErro("Erro ao atualizar os dados da empresa."));
  };

  const handleDesativarFuncionario = () => {
    setMensagemErro(null);
    setMensagemSucesso(null);
    axios
      .put(
        `http://localhost:8080/visitante/desativar`,
        { cpf: funcionario.cpf },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => setMensagemSucesso("Funcionário desativado com sucesso!"))
      .catch(() => setMensagemErro("Erro ao desativar funcionário."));
  };

  const handleAtivarFuncionario = () => {
    setMensagemErro(null);
    setMensagemSucesso(null);
    axios
      .put(
        `http://localhost:8080/visitante/ativar`,
        { cpf: funcionario.cpf },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => setMensagemSucesso("Funcionário ativado com sucesso!"))
      .catch(() => setMensagemErro("Erro ao ativar funcionário."));
  };

  const handleTrocarSenha = (e) => {
    e.preventDefault();
    setMensagemErro(null);
    setMensagemSucesso(null);

    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      setMensagemErro("Todos os campos de senha são obrigatórios.");
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setMensagemErro("As novas senhas não coincidem.");
      return;
    }

    axios
      .post(
        "http://localhost:8080/visitante/trocar-senha",
        {
          id: idFuncionario,
          senha: senhaAtual,
          novaSenha: novaSenha,
          confirmaSenha: confirmarSenha,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        setMensagemSucesso("Senha alterada com sucesso!");
        fecharModalSenha();
      })
      .catch(() => setMensagemErro("Erro ao trocar a senha."));
  };

  const abrirModalSenha = () => {
    setMensagemErro(null);
    setMensagemSucesso(null);
    setMostrarModalSenha(true);
  };

  const fecharModalSenha = () => {
    setMostrarModalSenha(false);
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");
  };

  if (!funcionario) {
    return (
      <>
        <Header />
        <div className={style.loadingContainer}>
          <p>Carregando informações do funcionário...</p>
        </div>
      </>
    );
  }

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
            onClick={() => (window.location.href = "/cadastrarFuncionario")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-arrow-left"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
          </motion.button>
          <h1 className={style.title}>Atualizar Funcionário</h1>
        </div>
        <div className={style.formsWrapper}>
          <motion.div className={style.formContainer}>
            <h2 className={style.formTitle}>Dados Pessoais</h2>
            <form className={style.form} onSubmit={handleSubmitDados}>
              <div className={style.inputGroup}>
                <label htmlFor="nome">Nome Completo</label>
                <input
                  type="text"
                  name="nome"
                  id="nome"
                  defaultValue={funcionario.nomeCompleto}
                  placeholder="Nome do funcionário"
                />
              </div>
              <div className={style.inputGroup}>
                <label htmlFor="cpf">CPF</label>
                <input
                  type="text"
                  name="cpf"
                  id="cpf"
                  readOnly
                  defaultValue={funcionario.cpf}
                  placeholder="CPF"
                />
              </div>
              <div className={style.inputGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  defaultValue={funcionario.email}
                  placeholder="Email"
                />
              </div>
              <div className={style.inputGroup}>
                <label htmlFor="telefone">Telefone</label>
                <input
                  type="text"
                  name="telefone"
                  id="telefone"
                  defaultValue={funcionario.telefone}
                  placeholder="Telefone"
                />
              </div>
              <div className={style.inputGroup}>
                <label htmlFor="observacao">Observação</label>
                <textarea
                  name="observacao"
                  id="observacao"
                  defaultValue={funcionario.observacao}
                  placeholder="Observação"
                />
              </div>
              <div className={style.inputGroup}>
                <label htmlFor="dataCadastro">Data de Cadastro</label>
                <input
                  type="text"
                  name="dataCadastro"
                  id="dataCadastro"
                  readOnly
                  defaultValue={funcionario.dataCadastro}
                />
              </div>
              <div className={style.buttonGroup}>
                <motion.button
                  type="submit"
                  className={style.submitButton}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Atualizar Dados
                </motion.button>
              </div>
            </form>
          </motion.div>
          <motion.div className={style.formContainer}>
            <h2 className={style.formTitle}>Dados da Empresa</h2>
            <form className={style.form} onSubmit={handleSubmitEmpresa}>
              <div className={style.inputGroup}>
                <label htmlFor="empresa">Empresa</label>
                <input
                  type="text"
                  name="empresa"
                  id="empresa"
                  defaultValue={funcionario.empresa || ""}
                  placeholder="Empresa"
                />
              </div>
              <div className={style.inputGroup}>
                <label htmlFor="tipoVisitante">Tipo de Visitante</label>
                <input
                  type="text"
                  name="tipoVisitante"
                  id="tipoVisitante"
                  readOnly
                  defaultValue={funcionario.tipo || ""}
                  placeholder="Tipo de Visitante"
                />
              </div>
              <div className={style.buttonGroup}>
                <motion.button
                  type="submit"
                  className={style.submitButton}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Atualizar Empresa
                </motion.button>
              </div>
              <motion.button
                type="button"
                className={style.secondaryButton}
                onClick={abrirModalSenha}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Alterar Senha
              </motion.button>
            </form>
          </motion.div>
        </div>
        {mensagemSucesso && (
          <p className={style.successMessage}>{mensagemSucesso}</p>
        )}
        {mensagemErro && <p className={style.errorMessage}>{mensagemErro}</p>}
        <div className={style.actionButtons}>
          <motion.button
            className={style.desativarButton}
            onClick={handleDesativarFuncionario}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Desativar
          </motion.button>
          <motion.button
            className={style.ativarButton}
            onClick={handleAtivarFuncionario}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Reativar
          </motion.button>
        </div>
      </motion.main>
      {mostrarModalSenha && (
        <div className={style.modalOverlay}>
          <div className={style.modal}>
            <form onSubmit={handleTrocarSenha} className={style.modalForm}>
              <h3 className={style.modalTitle}>Alterar Senha</h3>
              <input
                type="password"
                placeholder="Senha atual"
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
              />
              <input
                type="password"
                placeholder="Nova senha"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirmar nova senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
              />
              <div className={style.modalButtonGroup}>
                <button type="submit" className={style.submitButton}>
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={fecharModalSenha}
                  className={style.cancelButton}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AtualizarFuncionario;