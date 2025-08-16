import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import style from "./CadastrarEstacao.module.css";
import Header from "../Header/Header";

function CadastrarEstacao() {
  const [estacoes, setEstacoes] = useState([]);
  const [imagens, setImagens] = useState({});
  const [pesquisa, setPesquisa] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const fetchEstacoes = async (pagina = 0) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:8080/estacao/listar-todas?page=${pagina}&size=6`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setEstacoes(response.data.content || response.data);
      setTotalPaginas(response.data.totalPages);
      setPaginaAtual(pagina);

      const imagensTemp = {};
      const promises = (response.data.content || []).map(async (estacao) => {
        try {
          const imageResponse = await axios.get(
            `http://localhost:8080/estacao/imagens/estacao/${estacao.fotoUrl}`,
            {
              responseType: "blob",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const imageUrl = URL.createObjectURL(imageResponse.data);
          imagensTemp[estacao.id] = imageUrl;
        } catch (imageError) {
          console.error(
            `Erro ao buscar imagem para a estação ${estacao.id}:`,
            imageError
          );
          imagensTemp[estacao.id] =
            "https://placehold.co/400x250/E0E0E0/555555?text=Sem+Imagem";
        }
      });
      await Promise.all(promises);
      setImagens(imagensTemp);
    } catch (fetchError) {
      console.error("Erro ao buscar estações:", fetchError);
      setError(
        "Não foi possível carregar as estações. Tente novamente mais tarde."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEstacoes();
  }, []);

  const obterDadosEstacao = (estacao) => {
    localStorage.setItem("estacaoId", estacao.id);
    window.location.href = "/AtualizarEstacao";
  };

  const estacoesFiltradas = estacoes.filter((estacao) => {
    const nomeEstacao = (estacao.identificacao || "").toLowerCase();
    const pesquisaEstacao = pesquisa.toLowerCase();
    const statusMatch = filtroStatus === "" || estacao.ativo === filtroStatus;

    return nomeEstacao.includes(pesquisaEstacao) && statusMatch;
  });

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
                placeholder="Pesquisar estação"
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
            onClick={() => (window.location.href = "/formCadastroEstacao")}
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
            Cadastrar uma nova Estação
          </motion.button>
        </motion.div>

        {isLoading && (
          <p className={style.loadingText}>Carregando estações...</p>
        )}
        {error && <p className={style.errorText}>{error}</p>}
        {!isLoading && !error && estacoesFiltradas.length > 0 ? (
          <motion.div
            className={style.cardsWrapper}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {estacoesFiltradas.map((estacao) => (
              <motion.div
                key={estacao.id}
                className={style.cardCreate}
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
              >
                <img
                  className={style.imagem}
                  src={imagens[estacao.id]}
                  alt={`Estação ${estacao.identificacao}`}
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/400x250/E0E0E0/555555?text=Sem+Imagem";
                  }}
                />
                <div className={style.cardContent}>
                  <h3 className={style.titulo}>{estacao.identificacao}</h3>
                  <p className={style.descricao}>{estacao.descricao}</p>
                  <p
                    className={`${style.status} ${
                      estacao.ativo ? style.statusActive : style.statusInactive
                    }`}
                  >
                    Status: {estacao.ativo ? "Ativa" : "Inativa"}
                  </p>
                  <button
                    className={style.botaoInfo}
                    onClick={() => obterDadosEstacao(estacao)}
                  >
                    Verificar informações
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          !isLoading &&
          !error && (
            <p className={style.noResultsText}>Nenhuma estação encontrada</p>
          )
        )}

        {totalPaginas > 1 && (
          <div className={style.paginationContainer}>
            <motion.button
              className={style.paginationButton}
              disabled={paginaAtual === 0}
              onClick={() => fetchEstacoes(paginaAtual - 1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Anterior
            </motion.button>
            <span className={style.pageInfo}>
              Página {paginaAtual + 1} de {totalPaginas}
            </span>
            <motion.button
              className={style.paginationButton}
              disabled={paginaAtual + 1 >= totalPaginas}
              onClick={() => fetchEstacoes(paginaAtual + 1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Próxima
            </motion.button>
          </div>
        )}
      </div>
    </>
  );
}

export default CadastrarEstacao;
