"use client";
import { useEffect, useState } from "react";
import style from "./AtualizarEstacao.module.css";
import Header from "../Header/Header";
import { motion } from "framer-motion";
import axios from "axios";

const AtualizarEstacao = () => {
  const [estacao, setEstacao] = useState(null);
  const [salas, setSalas] = useState([]);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [mensagemSucesso, setMensagemSucesso] = useState(null);
  const [mensagemErro, setMensagemErro] = useState(null);
  const idEstacao = localStorage.getItem("estacaoId");

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  useEffect(() => {
    const fetchEstacao = async () => {
      try {
        const response = await axios.post(
          "https://sistema-coworking-20-production.up.railway.app/estacao/obter",
          { id: idEstacao },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        setEstacao(response.data);
      } catch (error) {
        console.error("Erro ao buscar estação:", error);
        setMensagemErro("Não foi possível carregar os dados da estação.");
      }
    };

    const fetchSalas = async () => {
      try {
        const response = await axios.get(
          "https://sistema-coworking-20-production.up.railway.app/sala/listar-disponiveis",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const salasRecebidas = response.data.content || response.data;
        setSalas(salasRecebidas);
      } catch (error) {
        console.error("Erro ao buscar salas:", error);
        setMensagemErro("Não foi possível carregar as salas disponíveis.");
      }
    };

    fetchSalas();
    fetchEstacao();
  }, [idEstacao]);

  useEffect(() => {
    if (estacao?.fotoUrl) {
      axios
        .get(
          `https://sistema-coworking-20-production.up.railway.app/estacao/imagens/estacao/${estacao.fotoUrl}`,
          {
            responseType: "blob",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          const imageUrl = URL.createObjectURL(response.data);
          setFotoPreview(imageUrl);
        })
        .catch((error) => {
          console.error("Erro ao buscar imagem:", error);
          setMensagemErro("Não foi possível carregar a imagem da estação.");
        });
    }
  }, [estacao]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setMensagemSucesso(null);
    setMensagemErro(null);

    const formData = new FormData(event.target);

    const estacaoAtualizada = {
      id: idEstacao,
      identificador: formData.get("identificacao"),
      descricao: formData.get("descricao"),
      sala:
        formData.get("sala") && formData.get("sala") !== "NaN"
          ? { id: parseInt(formData.get("sala")) }
          : null,
      monitor: formData.get("monitor") === "on",
      tecladoMouse: formData.get("tecladoMouse") === "on",
      cadeiraErgonomica: formData.get("cadeira") === "on",
    };

    if (!estacaoAtualizada.identificador || !estacaoAtualizada.descricao) {
      setMensagemErro("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const formDataAtualizada = new FormData();
    formDataAtualizada.append(
      "estacao",
      new Blob([JSON.stringify(estacaoAtualizada)], {
        type: "application/json",
      })
    );

    if (formData.get("foto") && formData.get("foto").name) {
      formDataAtualizada.append("file", formData.get("foto"));
    }

    axios
      .put("https://sistema-coworking-20-production.up.railway.app/estacao/atualizar", formDataAtualizada, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setMensagemSucesso("Estação atualizada com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao atualizar estação:", error);
        setMensagemErro("Erro ao atualizar estação. Tente novamente.");
      });
  };

  const handleDesativarEstacao = () => {
    setMensagemSucesso(null);
    setMensagemErro(null);
    axios
      .put(
        `https://sistema-coworking-20-production.up.railway.app/estacao/desativar`,
        { id: idEstacao },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setMensagemSucesso("Estação desativada com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao desativar estação:", error);
        setMensagemErro("Erro ao desativar estação. Tente novamente.");
      });
  };

  const handleAtivarEstacao = () => {
    setMensagemSucesso(null);
    setMensagemErro(null);
    axios
      .put(
        `https://sistema-coworking-20-production.up.railway.app/estacao/ativar`,
        { id: idEstacao },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setMensagemSucesso("Estação ativada com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao ativar estação:", error);
        setMensagemErro("Erro ao ativar estação. Tente novamente.");
      });
  };

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
            onClick={() => (window.location.href = "/cadastrarEstacao")}
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
          <h1 className={style.title}>Atualizar Estação</h1>
        </div>
        
        <div className={style.formAndImageContainer}>
          <motion.div className={style.formContainer}>
            <form className={style.form} onSubmit={handleSubmit}>
              <div className={style.inputGroup}>
                <label htmlFor="identificacao">Identificação</label>
                <input
                  type="text"
                  name="identificacao"
                  id="identificacao"
                  defaultValue={estacao?.identificacao || ""}
                  placeholder="Nome da estação"
                />
              </div>

              <div className={style.inputGroup}>
                <label htmlFor="descricao">Descrição</label>
                <input
                  type="text"
                  name="descricao"
                  id="descricao"
                  defaultValue={estacao?.descricao || ""}
                  placeholder="Descrição da estação"
                />
              </div>

              <div className={style.inputGroup}>
                <label htmlFor="sala">Sala</label>
                <select
                  name="sala"
                  id="sala"
                  defaultValue={estacao?.sala?.id?.toString() || ""}
                >
                  <option value="">Selecione uma sala</option>
                  {Array.isArray(salas) && salas.length > 0 ? (
                    salas.map((sala) => (
                      <option key={sala.id} value={sala.id.toString()}>
                        {sala.nome}
                      </option>
                    ))
                  ) : (
                    <option disabled>Nenhuma sala disponível</option>
                  )}
                </select>
              </div>

              <div className={style.checkboxGroup}>
                <div className={style.checkboxItem}>
                  <input
                    type="checkbox"
                    name="monitor"
                    id="monitor"
                    defaultChecked={estacao?.monitor}
                  />
                  <label htmlFor="monitor">Possui Monitor</label>
                </div>

                <div className={style.checkboxItem}>
                  <input
                    type="checkbox"
                    name="tecladoMouse"
                    id="tecladoMouse"
                    defaultChecked={estacao?.tecladoMouse}
                  />
                  <label htmlFor="tecladoMouse">Possui Teclado e Mouse</label>
                </div>

                <div className={style.checkboxItem}>
                  <input
                    type="checkbox"
                    name="cadeira"
                    id="cadeira"
                    defaultChecked={estacao?.cadeiraErgonomica}
                  />
                  <label htmlFor="cadeira">Possui Cadeira Ergonômica</label>
                </div>
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
                  Atualizar Estação
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
                alt="Foto da Estação"
                className={style.stationImage}
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
          onClick={handleDesativarEstacao}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Desativar
        </motion.button>
        <motion.button
          className={style.ativarButton}
          onClick={handleAtivarEstacao}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Reativar
        </motion.button>
      </div>
    </>
  );
};

export default AtualizarEstacao;
