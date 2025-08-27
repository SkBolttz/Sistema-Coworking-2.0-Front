"use client";
import { useEffect, useState } from "react";
import style from "./AtualizarSala.module.css";
import Header from "../Header/Header";
import { motion } from "framer-motion";
import axios from "axios";

const AtualizarSala = () => {
  const idSala = localStorage.getItem("salaId");
  
  const [sala, setSala] = useState(null);
  
  const [fotoPreview, setFotoPreview] = useState(null);
  
  const [mensagemSucesso, setMensagemSucesso] = useState(null);
  const [mensagemErro, setMensagemErro] = useState(null);

  const tiposDeSala = [
    "",
    "REUNIAO",
    "EVENTO",
    "PRIVADA",
    "PUBLICA",
    "TREINAMENTO",
    "SILENCIOSA",
    "CRIATIVA",
    "CALL",
    "LOUNGE",
    "ESTUDIO",
    "COWORKING",
    "DESENVOLVIMENTO",
    "MULTIMIDIA",
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  useEffect(() => {
    const fetchSala = async () => {
      try {
        const response = await axios.post(
          "https://sistema-coworking-20-production.up.railway.app/sala/dados",
          { id: idSala },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        setSala(response.data);
      } catch (error) {
        console.error("Erro ao buscar salas:", error);
        setMensagemErro("Não foi possível carregar os dados da sala.");
      }
    };

    fetchSala();
  }, [idSala]);

  useEffect(() => {
    if (sala?.fotoUrl) {
      axios
        .get(`https://sistema-coworking-20-production.up.railway.app/sala/imagens/sala/${sala.fotoUrl}`, {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          const imageUrl = URL.createObjectURL(response.data);
          setFotoPreview(imageUrl);
        })
        .catch((error) => {
          console.error("Erro ao buscar imagem:", error);
          setMensagemErro("Não foi possível carregar a imagem da sala.");
        });
    }
  }, [sala]);

  const handleSubmit = (event) => {
    event.preventDefault();

    setMensagemErro(null);
    setMensagemSucesso(null);

    const formData = new FormData(event.target);
    const salaAtualizada = {
      id: idSala,
      nome: formData.get("identificacao"),
      descricao: formData.get("descricao"),
      quantidade: formData.get("quantidade"),
      tipo: formData.get("tipo"),
      localizacao: formData.get("localizacao"),
    };
    const fotoFile = formData.get("foto");

    if (
      !salaAtualizada.nome ||
      !salaAtualizada.descricao ||
      !salaAtualizada.quantidade ||
      !salaAtualizada.localizacao
    ) {
      setMensagemErro("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const formDataAtualizada = new FormData();
    formDataAtualizada.append(
      "atualizarSala",
      new Blob([JSON.stringify(salaAtualizada)], { type: "application/json" })
    );

    if (fotoFile && fotoFile.name) {
      formDataAtualizada.append("file", fotoFile);
    }

    axios
      .put("https://sistema-coworking-20-production.up.railway.app/sala/atualizar", formDataAtualizada, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setMensagemSucesso("Sala atualizada com sucesso!");
      })
      .catch(() => {
        setMensagemErro("Nome de sala já cadastrado ou outro erro ocorreu.");
      });
  };

  const handleDesativarSala = () => {
    setMensagemErro(null);
    setMensagemSucesso(null);

    axios
      .put(
        `https://sistema-coworking-20-production.up.railway.app/sala/desativar`,
        { id: idSala },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        setMensagemSucesso("Sala desativada com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao desativar sala:", error);
        setMensagemErro("Erro ao desativar sala. Tente novamente.");
      });
  };

  const handleAtivarSala = () => {
    setMensagemErro(null);
    setMensagemSucesso(null);

    axios
      .put(
        `https://sistema-coworking-20-production.up.railway.app/sala/ativar`,
        { id: idSala },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        setMensagemSucesso("Sala ativada com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao ativar sala:", error);
        setMensagemErro("Erro ao ativar sala. Tente novamente.");
      });
  };

  if (!sala) {
    return (
      <>
        <Header />
        <div className={style.loadingContainer}>
          <p>Carregando informações da sala...</p>
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
            onClick={() => (window.location.href = "/cadastrarSala")}
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
          <h1 className={style.title}>Atualizar Sala</h1>
        </div>
        <div className={style.formAndImageContainer}>
          <motion.div className={style.formContainer}>
            <form className={style.form} onSubmit={handleSubmit}>
              <div className={style.inputGroup}>
                <label htmlFor="identificacao">Nome</label>
                <input
                  type="text"
                  name="identificacao"
                  id="identificacao"
                  defaultValue={sala.nome}
                  placeholder="Nome da sala"
                />
              </div>
              <div className={style.inputGroup}>
                <label htmlFor="descricao">Descrição</label>
                <input
                  type="text"
                  name="descricao"
                  id="descricao"
                  defaultValue={sala.descricao}
                  placeholder="Descrição da sala"
                />
              </div>
              <div className={style.inputGroup}>
                <label htmlFor="quantidade">Quantidade de Pessoas</label>
                <input
                  type="number"
                  name="quantidade"
                  id="quantidade"
                  defaultValue={sala.quantidade}
                  placeholder="Capacidade da sala"
                />
              </div>
              <div className={style.inputGroup}>
                <label htmlFor="tipo">Tipo</label>
                <select name="tipo" id="tipo" defaultValue={sala.tipo}>
                  {tiposDeSala.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>
              <div className={style.inputGroup}>
                <label htmlFor="localizacao">Localização</label>
                <input
                  type="text"
                  name="localizacao"
                  id="localizacao"
                  defaultValue={sala.localizacao}
                  placeholder="Localização da sala"
                />
              </div>
              <div className={style.inputGroup}>
                <label htmlFor="foto">Foto</label>
                <input
                  type="file"
                  name="foto"
                  id="foto"
                  onChange={(e) =>
                    setFotoPreview(URL.createObjectURL(e.target.files[0]))
                  }
                />
              </div>
              <div className={style.buttonGroup}>
                <motion.button
                  type="submit"
                  className={style.submitButton}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Atualizar Sala
                </motion.button>
              </div>
            </form>
          </motion.div>
          <motion.div
            className={style.imageContainer}
            variants={containerVariants}
          >
            {fotoPreview ? (
              <img
                src={fotoPreview}
                alt="Foto da Sala"
                className={style.roomImage}
              />
            ) : (
              <p className={style.noImageText}>Nenhuma imagem disponível</p>
            )}
          </motion.div>
        </div>
        {mensagemSucesso && (
          <p className={style.successMessage}>{mensagemSucesso}</p>
        )}
        {mensagemErro && <p className={style.errorMessage}>{mensagemErro}</p>}
      </motion.main>
      <div className={style.actionButtons}>
        <motion.button
          className={style.desativarButton}
          onClick={handleDesativarSala}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Desativar
        </motion.button>
        <motion.button
          className={style.ativarButton}
          onClick={handleAtivarSala}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Reativar
        </motion.button>
      </div>
    </>
  );
};

export default AtualizarSala;

