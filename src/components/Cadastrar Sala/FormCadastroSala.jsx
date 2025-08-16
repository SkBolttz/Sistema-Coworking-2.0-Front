import style from "./FormCadastroSala.module.css";
import Header from "../Header/Header";
import axios from "axios";
import { useState } from "react";
import { motion } from "framer-motion";

const tiposDeSala = [
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

function FormCadastroSala() {
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState(false);
  const [dadosVazios, setDadosVazios] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSucesso(false);
    setErro(false);
    setDadosVazios(false);
    setIsSubmitting(true);

    const form = event.target;
    const nome = form.elements["identificacao"].value.trim();
    const descricao = form.elements["descricao"].value.trim();
    const quantidade = form.elements["quantidade"].value;
    const tipo = form.elements["tipo"].value;
    const localizacao = form.elements["localizacao"].value.trim();
    const fotoFile = form.elements["foto"].files[0];

    if (
      !nome ||
      !descricao ||
      !quantidade ||
      !tipo ||
      !fotoFile ||
      !localizacao
    ) {
      setDadosVazios(true);
      setIsSubmitting(false);
      return;
    }

    const sala = {
      nome: nome,
      descricao: descricao,
      quantidade: quantidade,
      tipo: tipo,
      localizacao: localizacao,
    };

    const formData = new FormData();
    formData.append(
      "sala",
      new Blob([JSON.stringify(sala)], { type: "application/json" })
    );
    formData.append("file", fotoFile);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErro(true);
        console.error("Authorization token not found.");
        return;
      }

      await axios.post("http://localhost:8080/sala/criar", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSucesso(true);
      form.reset();
    } catch (error) {
      console.error("Error registering room:", error);
      setErro(true);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h2 className={style.title}>Cadastro de Sala</h2>
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
              <label htmlFor="identificacao">Identificação da Sala</label>
              <input type="text" id="identificacao" name="identificacao" />
            </div>

            <div className={style.inputGroup}>
              <label htmlFor="descricao">Descrição</label>
              <input type="text" id="descricao" name="descricao" />
            </div>

            <div className={style.inputGroup}>
              <label htmlFor="quantidade">Quantidade de assentos</label>
              <input type="number" id="quantidade" name="quantidade" />
            </div>

            <div className={style.inputGroup}>
              <label htmlFor="tipo">Informe o tipo da Sala</label>
              <select name="tipo" id="tipo" className={style.select}>
                {tiposDeSala.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            <div className={style.inputGroup}>
              <label htmlFor="foto">Foto da Sala</label>
              <input type="file" id="foto" name="foto" accept="image/*" className={style.fileInput} />
            </div>

            <div className={style.inputGroup}>
              <label htmlFor="localizacao">Localização da Sala</label>
              <input type="text" id="localizacao" name="localizacao" />
            </div>

            {/* Mensagens de feedback do usuário */}
            {sucesso && (
              <p className={`${style.message} ${style.sucesso}`}>Sala cadastrada com sucesso!</p>
            )}
            {erro && <p className={`${style.message} ${style.erro}`}>Erro ao cadastrar Sala!</p>}
            {dadosVazios && (
              <p className={`${style.message} ${style.dadosVazios}`}>
                Todos os campos devem ser preenchidos!
              </p>
            )}

            {/* Botão de submissão com animações e estado de loading */}
            <motion.button
              type="submit"
              className={style.buttonSubmit}
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? "Cadastrando..." : "Cadastrar Sala"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </>
  );
}

export default FormCadastroSala;
