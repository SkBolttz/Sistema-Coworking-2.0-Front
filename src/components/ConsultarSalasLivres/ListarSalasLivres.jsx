/* eslint-disable react-hooks/rules-of-hooks */
import style from "./ListarSalasLivres.module.css";
import Header from "../Header/Header";
import axios from "axios";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

function listarSalasLivres() {
  const [salas, setSalas] = useState([]);
  const [imagens, setImagens] = useState({});
  const [pesquisa, setPesquisa] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [loading, setLoading] = useState(true);
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

  const buscarSalas = async (pagina = 0) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://sistema-coworking-20-production.up.railway.app/sala/listar-disponiveis?page=${pagina}&size=6`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const salasRecebidas = response.data.content || response.data;
      setSalas(salasRecebidas);
      setTotalPaginas(response.data.totalPages);
      setPaginaAtual(pagina);

      const imagensTemp = {};
      const promises = salasRecebidas.map(async (sala) => {
        try {
          const res = await axios.get(
            `https://sistema-coworking-20-production.up.railway.app/sala/imagens/sala/${sala.fotoUrl}`,
            {
              responseType: "blob",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const imageUrl = URL.createObjectURL(res.data);
          imagensTemp[sala.id] = imageUrl;
        } catch (imageError) {
          console.error(
            `Erro ao buscar imagem para a sala ${sala.id}:`,
            imageError
          );
          imagensTemp[sala.id] =
            "https://placehold.co/400x300/e0e0e0/ffffff?text=Sem+Imagem";
        }
      });
      await Promise.all(promises);
      setImagens(imagensTemp);
    } catch (fetchError) {
      console.error("Erro ao buscar salas:", fetchError);
      setError(
        "Não foi possível carregar as salas. Tente novamente mais tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarSalas();
  }, []);

  const obterDadosSala = async (sala) => {
    try {
      await axios.post(
        `https://sistema-coworking-20-production.up.railway.app/sala/dados`,
        { id: sala.id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      localStorage.setItem("salaId", sala.id);
      window.location.href = "/AtualizarSala";
    } catch (error) {
      console.error("Erro ao buscar dados da sala:", error);
    }
  };

  const salasFiltradas = salas.filter((sala) => {
    const nomeSala = (sala.nome || "").toLowerCase();
    const pesquisaSala = pesquisa.toLowerCase();

    const correspondePesquisa = nomeSala.includes(pesquisaSala);

    return correspondePesquisa;
  });

  return (
    <>
      <Header />
      <main className={style.mainContainer}>
        <motion.div
          className={style.topBar}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
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

          <div className={style.controls}>
            <div className={style.searchContainer}>
              <input
                type="text"
                placeholder="Pesquisar sala..."
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
                className={style.searchInput}
              />
            </div>
            <div className={style.statusButtons}></div>
          </div>
        </motion.div>

        {loading ? (
          <p className={style.loadingText}>Carregando salas...</p>
        ) : error ? (
          <p className={style.errorText}>{error}</p>
        ) : salasFiltradas.length > 0 ? (
          <motion.div
            className={style.cardsWrapper}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {salasFiltradas.map((sala) => (
              <motion.div
                key={sala.id}
                className={style.cardCreate}
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
              >
                <img
                  className={style.imagem}
                  src={
                    imagens[sala.id] ||
                    "https://placehold.co/400x300/e0e0e0/ffffff?text=Sem+Imagem"
                  }
                  alt={`Sala ${sala.nome}`}
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/400x300/e0e0e0/ffffff?text=Sem+Imagem";
                  }}
                />
                <div className={style.cardContent}>
                  <h3 className={style.titulo}>{sala.nome}</h3>
                  <p className={style.descricao}>{sala.descricao}</p>
                  <p className={style.status}>
                    Status:{" "}
                    <span
                      className={
                        sala.disponivel
                          ? style.statusActive
                          : style.statusInactive
                      }
                    >
                      {sala.disponivel ? "Disponivel" : "Indisponivel"}
                    </span>
                  </p>
                  <button
                    className={style.botaoInfo}
                    onClick={() => obterDadosSala(sala)}
                  >
                    Verificar informações
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          !loading &&
          !error && (
            <p className={style.noResultsText}>Nenhuma sala encontrada.</p>
          )
        )}

        {totalPaginas > 1 && (
          <div className={style.paginationContainer}>
            <motion.button
              className={style.paginationButton}
              disabled={paginaAtual === 0}
              onClick={() => buscarSalas(paginaAtual - 1)}
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
              onClick={() => buscarSalas(paginaAtual + 1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Próxima
            </motion.button>
          </div>
        )}
      </main>
    </>
  );
}

export default listarSalasLivres;
