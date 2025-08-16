import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import style from "./CadastrarFuncionario.module.css";
import Header from "../Header/Header";

function CadastrarFuncionario() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  useEffect(() => {
    const listarFuncionarios = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          "http://localhost:8080/visitante/listar/funcionario?page=0&size=1000",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setFuncionarios(response.data.content);
      } catch (fetchError) {
        console.error("Erro ao buscar funcionários:", fetchError);
        setError(
          "Não foi possível carregar os funcionários. Tente novamente mais tarde."
        );
      } finally {
        setIsLoading(false);
      }
    };

    listarFuncionarios();
  }, []);

  const funcionariosFiltrados = funcionarios.filter((funcionario) => {
    const nomeFuncionario = (funcionario.nomeCompleto || "").toLowerCase();
    const pesquisaFuncionario = pesquisa.toLowerCase();
    const statusMatch =
      filtroStatus === "" || funcionario.ativo === filtroStatus;

    return nomeFuncionario.includes(pesquisaFuncionario) && statusMatch;
  });

  const handleUpdate = (funcionarioId) => {
    localStorage.setItem("funcionarioId", funcionarioId);
    window.location.href = "/AtualizarFuncionario";
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
            onClick={() => (window.location.href = "/admin")}
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
          <div className={style.controls}>
            <div className={style.searchContainer}>
              <input
                type="text"
                placeholder="Pesquisar funcionário"
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
                className={style.searchInput}
              />
            </div>
            <div className={style.statusButtons}>
              <button
                onClick={() => setFiltroStatus("")}
                className={filtroStatus === "" ? style.activeFilter : ""}
              >
                Todas
              </button>
              <button
                onClick={() => setFiltroStatus(true)}
                className={filtroStatus === true ? style.activeFilter : ""}
              >
                Ativas
              </button>
              <button
                onClick={() => setFiltroStatus(false)}
                className={filtroStatus === false ? style.activeFilter : ""}
              >
                Inativas
              </button>
            </div>
          </div>
          <motion.button
            className={style.createButton}
            onClick={() => (window.location.href = "/cadastroFuncionario")}
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
              className="lucide lucide-plus"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            Cadastrar novo funcionário
          </motion.button>
        </motion.div>

        {isLoading && (
          <p className={style.loadingText}>Carregando funcionários...</p>
        )}
        {error && <p className={style.errorText}>{error}</p>}
        {!isLoading && !error && funcionariosFiltrados.length > 0 ? (
          <div className={style.tableContainer}>
            <motion.table
              className={style.table}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <thead className={style.tableHeader}>
                <tr>
                  <th>ID</th>
                  <th>Nome Completo</th>
                  <th>Email</th>
                  <th className={style.statusHeader}>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody className={style.tableBody}>
                {funcionariosFiltrados.map((funcionario) => (
                  <motion.tr
                    key={funcionario.id}
                    variants={itemVariants}
                    whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.03)" }}
                  >
                    <td>{funcionario.id}</td>
                    <td>{funcionario.nomeCompleto}</td>
                    <td>{funcionario.email}</td>
                    <td>
                      <span
                        className={
                          funcionario.ativo
                            ? style.statusActive
                            : style.statusInactive
                        }
                      >
                        {funcionario.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td>
                      <motion.button
                        className={style.buttonUpdate}
                        onClick={() => handleUpdate(funcionario.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Atualizar
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          </div>
        ) : (
          !isLoading &&
          !error && (
            <p className={style.noResultsText}>Nenhum funcionário encontrado</p>
          )
        )}
      </div>
    </>
  );
}

export default CadastrarFuncionario;
