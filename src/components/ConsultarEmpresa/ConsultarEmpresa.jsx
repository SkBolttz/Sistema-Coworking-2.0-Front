("use client");
import style from "./ConsultarEmpresa.module.css";
import Header from "../Header/Header";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
function ConsultarEmpresa() {
  const cpf = localStorage.getItem("cpf");
  const [visitante, setVisitante] = useState(null);
  const [mensagemSucesso, setMensagemSucesso] = useState(null);
  const [mensagemErro, setMensagemErro] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  useEffect(() => {
    const fetchVisitante = async () => {
      try {
        const response = await axios.post(
          "https://sistema-coworking-20-production.up.railway.app/empresa/obter",
          { cpf: cpf },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        setVisitante(response.data);
      } catch (error) {
        console.error("Erro ao buscar visitante:", error);
        setMensagemErro("Não foi possível carregar os dados do visitante.");
      }
    };

    fetchVisitante();
  }, [cpf]);

  const handleSubmit = (event) => {
    event.preventDefault();

    setMensagemErro(null);
    setMensagemSucesso(null);

    const formData = new FormData(event.target);
    const perfilAtualizado = {
      nomeCompleto: formData.get("nomeCompleto"),
      email: formData.get("email"),
      telefone: formData.get("telefone"),
      observacao: formData.get("observacao"),
    };

    if (
      !perfilAtualizado.nomeCompleto ||
      !perfilAtualizado.email ||
      !perfilAtualizado.telefone ||
      !perfilAtualizado.observacao
    ) {
      setMensagemErro("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const formDataAtualizada = new FormData();
    formDataAtualizada.append(
      "atualizarVisitante",
      new Blob([JSON.stringify(perfilAtualizado)], { type: "application/json" })
    );

    axios
      .put("https://sistema-coworking-20-production.up.railway.app/visitante/atualizar", formDataAtualizada, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        setMensagemSucesso("Visitante atualizado com sucesso!");
      })
      .catch(() => {
        setMensagemErro("Nome de sala já cadastrado ou outro erro ocorreu.");
      });
  };

  if (!visitante) {
    return (
      <>
        <Header />
        <div className={style.loadingContainer}>
          <p>Carregando informações do visitante...</p>
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
            onClick={() => (window.location.href = "/home")}
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
          <h1 className={style.title}>Sua Empresa</h1>
        </div>
        <motion.div className={style.formContainer}>
          <form className={style.form} onSubmit={handleSubmit}>
            <div className={style.inputGroup}>
              <label htmlFor="razaoSocial">Razão Social</label>
              <input
                type="text"
                name="razaoSocial"
                id="razaoSocial"
                defaultValue={visitante.nomeCompleto}
                placeholder="Razão Social"
              />
            </div>
            <div className={style.inputGroup}>
              <label htmlFor="nomeFantasia">Nome Fantasia</label>
              <input
                type="text"
                name="nomeFantasia"
                id="nomeFantasia"
                defaultValue={visitante.cpf}
                placeholder="Nome Fantasia"
              />
            </div>
            <div className={style.inputGroup}>
              <label htmlFor="cnpj">CNPJ</label>
              <input
                type="text"
                name="cnpj"
                id="cnpj"
                defaultValue={visitante.email}
                disabled
                placeholder="CNPJ"
              />
            </div>
            <div className={style.inputGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="text"
                name="email"
                id="email"
                defaultValue={visitante.telefone}
                placeholder="Email"
              />
            </div>
            <div className={style.inputGroup}>
              <label htmlFor="telefone">Telefone</label>
              <input
                type="text"
                name="telefone"
                id="telefone"
                defaultValue={visitante.observacao}
                placeholder="Telefone"
              />
            </div>
            <div className={style.inputGroup}>
              <label htmlFor="responsavel">Responsável</label>
              <input
                type="text"
                name="responsavel"
                id="responsavel"
                defaultValue={visitante.observacao}
                placeholder="Responsável"
              />
            </div>
            <div className={style.inputGroup}>
              <label htmlFor="ramo">Ramo</label>
              <input
                type="text"
                name="ramo"
                id="ramo"
                defaultValue={visitante.observacao}
                placeholder="Ramo"
              />
            </div>
          </form>
          {mensagemSucesso && (
            <p className={style.successMessage}>{mensagemSucesso}</p>
          )}
          {mensagemErro && <p className={style.errorMessage}>{mensagemErro}</p>}
        </motion.div>
      </motion.main>
    </>
  );
}

export default ConsultarEmpresa;
