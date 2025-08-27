import style from "./FormCadastroEstacao.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Header from "../Header/Header";

function FormCadastroEstacao() {
  const [monitor, setMonitor] = useState(false);
  const [tecladoMouse, setTecladoMouse] = useState(false);
  const [cadeira, setCadeira] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState(false);
  const [dadosVazios, setDadosVazios] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [salas, setSalas] = useState([]);

  const handleMonitorChange = (event) => {
    setMonitor(event.target.checked);
  };

  const handleTecladoMouseChange = (event) => {
    setTecladoMouse(event.target.checked);
  };

  const handleCadeiraChange = (event) => {
    setCadeira(event.target.checked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSucesso(false);
    setErro(false);
    setDadosVazios(false);
    setIsSubmitting(true);

    const form = event.target;
    const nome = form.elements["identificao"].value.trim();
    const descricao = form.elements["descricao"].value.trim();
    const sala = form.elements["sala"].value;
    const fotoFile = form.elements["foto"].files[0];

    if (!nome || !descricao || !sala || !fotoFile) {
      setDadosVazios(true);
      setIsSubmitting(false);
      return;
    }

    const estacao = {
      identificacao: nome,
      descricao,
      sala: { id: parseInt(sala) },
      monitor,
      tecladoMouse,
      cadeiraErgonomica: cadeira,
    };
    const formData = new FormData();
    formData.append(
      "estacao",
      new Blob([JSON.stringify(estacao)], { type: "application/json" })
    );
    formData.append("file", fotoFile);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErro(true);
        console.error("Authorization token not found.");
        return;
      }

      await axios.post("https://sistema-coworking-20-production.up.railway.app/estacao/cadastrar", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSucesso(true);
      form.reset();
    } catch (error) {
      console.error("Error registering station:", error);
      setErro(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchSalas = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Authorization token not found.");
          return;
        }

        const response = await axios.get(
          "https://sistema-coworking-20-production.up.railway.app/sala/listar-disponiveis",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const salasRecebidas = response.data.content || response.data;
        setSalas(salasRecebidas);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchSalas();
  }, []);

  return (
    <>
      <Header />
      <div className={style.mainContainer}>
        <motion.div
          className={style.topBar}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.button
            className={style.returnButton}
            onClick={() => window.history.back()}
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
          <h2 className={style.title}>Cadastro de Estação</h2>
          <div className={style.placeholder} />
        </motion.div>

        <motion.div
          className={style.formContainer}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <form onSubmit={handleSubmit} className={style.form}>
            <div className={style.inputGroup}>
              <label htmlFor="identificao">Identificação da Estação</label>
              <input type="text" id="identificao" name="identificao" />
            </div>

            <div className={style.inputGroup}>
              <label htmlFor="descricao">Descrição</label>
              <input type="text" id="descricao" name="descricao" />
            </div>

            <div className={style.checkboxGroup}>
              <label className={style.checkboxLabel}>
                <input
                  type="checkbox"
                  name="monitorCheck"
                  checked={monitor}
                  onChange={handleMonitorChange}
                />
                Possui monitor
              </label>

              <label className={style.checkboxLabel}>
                <input
                  type="checkbox"
                  name="tecladMouseCheck"
                  checked={tecladoMouse}
                  onChange={handleTecladoMouseChange}
                />
                Possui teclado e mouse
              </label>

              <label className={style.checkboxLabel}>
                <input
                  type="checkbox"
                  name="CadeiraCheck"
                  checked={cadeira}
                  onChange={handleCadeiraChange}
                />
                Possui cadeira ergonômica
              </label>
            </div>

            <div className={style.inputGroup}>
              <label htmlFor="sala">Sala</label>
              <select name="sala" id="sala" className={style.select}>
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

            <div className={style.inputGroup}>
              <label htmlFor="foto">Foto da Estação</label>
              <input
                type="file"
                id="foto"
                name="foto"
                className={style.fileInput}
              />
            </div>

            {sucesso && (
              <p className={`${style.message} ${style.sucesso}`}>
                Estação cadastrada com sucesso!
              </p>
            )}
            {erro && (
              <p className={`${style.message} ${style.erro}`}>
                Erro ao cadastrar Estação!
              </p>
            )}
            {dadosVazios && (
              <p className={`${style.message} ${style.dadosVazios}`}>
                Todos os campos devem ser preenchidos!
              </p>
            )}

            <motion.button
              type="submit"
              className={style.buttonSubmit}
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? "Cadastrando..." : "Cadastrar Estação"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </>
  );
}

export default FormCadastroEstacao;
