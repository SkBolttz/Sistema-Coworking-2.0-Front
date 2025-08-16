import { motion } from "framer-motion";
import style from "./PaginaInicialAdmin.module.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Graphic from "../../Image/Graphic.png";
import Enterprise from "../../Image/Enterprise.png";
import AddRoom from "../../Image/AddRoom.png";
import AddStation from "../../Image/AddStation.png";
import AddUser from "../../Image/AddUser.png";
import axios from "axios";
import { useEffect, useState } from "react";

function PaginaInicial() {
  const [salasDisponiveis, setSalasDisponiveis] = useState(0);
  const [salasOcupadas, setSalasOcupadas] = useState(0);
  const [estacoesDisponiveis, setEstacoesDisponiveis] = useState(0);
  const [visitantesCadastrados, setVisitantesCadastrados] = useState(0);
  const [funcionariosCadastrados, setFuncionariosCadastrados] = useState(0);
  const [empresasCadastradas, setEmpresasCadastradas] = useState(0);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    async function salasLivres() {
      try {
        const resposta = await axios.get(
          "http://localhost:8080/sala/listar-disponiveis",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSalasDisponiveis(resposta.data.content.length || 0);
      } catch (error) {
        console.error("Erro ao buscar salas livres:", error);
      }
    }

    salasLivres();
  }, []);

  useEffect(() => {
    async function salasOcupadas() {
      try {
        const resposta = await axios.get(
          "http://localhost:8080/sala/listar-indisponiveis",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSalasOcupadas(resposta.data.content.length || 0);
      } catch (error) {
        console.error("Erro ao buscar salas :", error);
      }
    }

    salasOcupadas();
  }, []);

  useEffect(() => {
    async function estacoesDisponiveis() {
      try {
        const resposta = await axios.get(
          "http://localhost:8080/estacao/listar-ativas",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setEstacoesDisponiveis(resposta.data.content.length || 0);
      } catch (error) {
        console.error("Erro ao buscar estacao :", error);
      }
    }

    estacoesDisponiveis();
  }, []);

  useEffect(() => {
    async function visitantesCadastrados() {
      try {
        const resposta = await axios.get(
          "http://localhost:8080/visitante/listar",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setVisitantesCadastrados(resposta.data.content.length || 0);
      } catch (error) {
        console.error("Erro ao buscar visitante:", error);
      }
    }

    visitantesCadastrados();
  }, []);

  useEffect(() => {
    async function funcionariosCadastrados() {
      try {
        const resposta = await axios.get(
          "http://localhost:8080/visitante/listar/funcionario",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setFuncionariosCadastrados(resposta.data.content.length || 0);
      } catch (error) {
        console.error("Erro ao buscar funcionário:", error);
      }
    }

    funcionariosCadastrados();
  }, []);

  useEffect(() => {
    async function empresasCadastradas() {
      try {
        const resposta = await axios.get(
          "http://localhost:8080/empresa/listar-ativas",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setEmpresasCadastradas(resposta.data.content.length || 0);
      } catch (error) {
        console.error("Erro ao buscar empresa:", error);
      }
    }

    empresasCadastradas();
  }, []);

  return (
    <div>
      <Header />

      <motion.main
        className={style.mainContainer}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className={style.actionCardsSection}
          variants={containerVariants}
        >
          <motion.button
            className={style.actionCard}
            onClick={() => (window.location.href = "/cadastrarEmpresa")}
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={style.actionCardIcon}>
              <img src={Enterprise} alt="Cadastrar Empresa" />
            </div>
            <p>Cadastrar Empresa</p>
          </motion.button>

          <motion.button
            className={style.actionCard}
            onClick={() => (window.location.href = "/cadastrarEstacao")}
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={style.actionCardIcon}>
              <img src={AddStation} alt="Cadastrar Estação" />
            </div>
            <p>Cadastrar Estação</p>
          </motion.button>

          <motion.button
            className={style.actionCard}
            onClick={() => (window.location.href = "/cadastrarFuncionario")}
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={style.actionCardIcon}>
              <img src={AddUser} alt="Cadastrar Funcionário" />
            </div>
            <p>Cadastrar Funcionário</p>
          </motion.button>

          <motion.button
            className={style.actionCard}
            onClick={() => (window.location.href = "/cadastrarSala")}
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={style.actionCardIcon}>
              <img src={AddRoom} alt="Cadastrar Sala" />
            </div>
            <p>Cadastrar Sala</p>
          </motion.button>
        </motion.div>

        <motion.div className={style.dashboardSection} variants={itemVariants}>
          <h2 className={style.dashboardTitle}>DASHBOARD</h2>

          <div className={style.dashboardContent}>
            <div className={style.graphicContainer}>
              <img src={Graphic} alt="Gráfico de Dados" />
            </div>

            <ul className={style.statsList}>
              <li>
                Empresas Cadastradas: <span>{empresasCadastradas}</span>
              </li>
              <li>
                Usuários Cadastrados: <span>{visitantesCadastrados}</span>
              </li>
              <li>
                Funcionários Cadastrados: <span>{funcionariosCadastrados}</span>
              </li>
            </ul>
          </div>

          <ul className={style.legendList}>
            <li>
              <span
                className={`${style.legendColorBox} ${style.cor_livre}`}
              ></span>
              Salas Livres: {salasDisponiveis}
            </li>
            <li>
              <span
                className={`${style.legendColorBox} ${style.cor_ocupada}`}
              ></span>
              Salas Ocupadas: {salasOcupadas}
            </li>
            <li>
              <span
                className={`${style.legendColorBox} ${style.cor_outros}`}
              ></span>
              Estações Cadastradas: {estacoesDisponiveis}
            </li>
          </ul>
        </motion.div>
      </motion.main>

      <Footer />
    </div>
  );
}

export default PaginaInicial;
