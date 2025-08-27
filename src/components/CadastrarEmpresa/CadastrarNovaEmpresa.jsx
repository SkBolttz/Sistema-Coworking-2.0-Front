import style from "./CadastrarNovaEmpresa.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Header from "../Header/Header";

function CadastrarNovaEmpresa() {
  const [etapa, setEtapa] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState(false);
  const [dadosVazios, setDadosVazios] = useState(false);
  const [ramos, setRamos] = useState([]);
  const [responsaveis, setResponsaveis] = useState([]);

  const [razaoSocial, setRazaoSocial] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [nomeFantasia, setNomeFantasia] = useState("");
  const [ramoId, setRamoId] = useState("");
  const [ramoNome, setRamoNome] = useState("");
  const [responsavelId, setResponsavelId] = useState("");
  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [pais, setPais] = useState("");
  const [novoRamo, setNovoRamo] = useState("");

  const handlePrimeiraEtapa = (e) => {
    e.preventDefault();
    setDadosVazios(false);
    setSucesso(false);
    setErro(false);

    if (
      !razaoSocial.trim() ||
      !email.trim() ||
      !telefone.trim() ||
      !cnpj.trim() ||
      !nomeFantasia.trim() ||
      !ramoId ||
      !responsavelId
    ) {
      setDadosVazios(true);
      return;
    }

    setEtapa(2);
  };

  const enviarCadastroFinal = async (e) => {
    e.preventDefault();
    setDadosVazios(false);
    setSucesso(false);
    setErro(false);
    setIsSubmitting(true);

    if (!logradouro || !cidade || !estado || !pais) {
      setDadosVazios(true);
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErro(true);
        console.error("Authorization token not found.");
        return;
      }

      const empresa = {
        nomeFantasia,
        razaoSocial,
        cnpj,
        email,
        telefone,
        ramo: {
          id: parseInt(ramoId),
          ramo: ramoNome,
        },
        responsavel: {
          id: parseInt(responsavelId),
        },
        endereco: {
          logradouro,
          numero,
          complemento,
          cep,
          cidade,
          estado,
          pais,
        },
      };

      await axios.post("https://sistema-coworking-20-production.up.railway.app/empresa/cadastrar", empresa, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setSucesso(true);
      window.location.href = "/cadastrarEmpresa";
    } catch (error) {
      console.error("Erro ao cadastrar empresa:", error);
      setErro(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNovoRamo = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const valorRamo = novoRamo.trim();
    if (!valorRamo) {
      alert("Preencha o campo do ramo para cadastrar!");
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://sistema-coworking-20-production.up.railway.app/ramo/cadastrar",
        { ramo: valorRamo },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNovoRamo("");
      listarRamos();
      setRamoId("");
      setSucesso(true);
    } catch (error) {
      console.error("Erro ao cadastrar ramo:", error);
      setErro(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resgatarCep = async () => {
    if (cep.length === 8) {
      try {
        const { data } = await axios.get(
          `https://viacep.com.br/ws/${cep}/json/`
        );

        if (data.erro) {
          alert("CEP não encontrado.");
          return;
        }

        setLogradouro(data.logradouro);
        setComplemento(data.complemento);
        setCidade(data.localidade);
        setEstado(data.uf);
        setPais("Brasil");
      } catch (error) {
        console.error("Erro ao consultar o CEP:", error);
        setErro(true);
      }
    }
  };

  const listarRamos = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await axios.get(
        "https://sistema-coworking-20-production.up.railway.app/ramo/obter-ramos",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRamos(response.data);
    } catch (error) {
      console.error("Erro ao listar ramos:", error);
      setErro(true);
    }
  };

  const listarResponsaveis = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await axios.get(
        "https://sistema-coworking-20-production.up.railway.app/visitante/listar-visitantes-disponiveis",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResponsaveis(response.data);
    } catch (error) {
      console.error("Erro ao listar responsaveis:", error);
      setErro(true);
    }
  };

  useEffect(() => {
    listarRamos();
    listarResponsaveis();
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
          <h2 className={style.title}>Cadastro de Empresa</h2>
          <div className={style.placeholder} />
        </motion.div>

        {etapa === 1 && (
          <motion.div
            key="etapa-1"
            className={style.formContainer}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handlePrimeiraEtapa} className={style.form}>
              <h2 className={style.titleStep}>Etapa 1: Dados da Empresa</h2>

              <div className={style.row}>
                <div className={style.inputGroup}>
                  <label htmlFor="razaoSocial">Razão Social</label>
                  <input
                    type="text"
                    id="razaoSocial"
                    name="razaoSocial"
                    placeholder="Digite a Razão Social"
                    value={razaoSocial}
                    onChange={(e) => setRazaoSocial(e.target.value)}
                  />
                </div>
                <div className={style.inputGroup}>
                  <label htmlFor="nomeFantasia">Nome Fantasia</label>
                  <input
                    type="text"
                    id="nomeFantasia"
                    name="nomeFantasia"
                    placeholder="Digite o nome fantasia"
                    value={nomeFantasia}
                    onChange={(e) => setNomeFantasia(e.target.value)}
                  />
                </div>
              </div>

              <div className={style.row}>
                <div className={style.inputGroup}>
                  <label htmlFor="email">Email da empresa</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Digite o email empresarial"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className={style.inputGroup}>
                  <label htmlFor="telefone">Telefone da empresa</label>
                  <input
                    type="text"
                    id="telefone"
                    name="telefone"
                    placeholder="Digite o telefone empresarial"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    maxLength={11}
                  />
                </div>
              </div>

              <div className={style.inputGroup}>
                <label htmlFor="cnpj">CNPJ</label>
                <input
                  type="text"
                  id="cnpj"
                  name="cnpj"
                  placeholder="Digite seu CNPJ"
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  maxLength={14}
                />
              </div>

              <div className={style.row}>
                <div className={style.inputGroup}>
                  <label htmlFor="ramo">Ramo de Atividade</label>
                  <select
                    className={style.select}
                    name="ramo"
                    id="ramo"
                    value={ramoId}
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      if (selectedValue === "novo") {
                        setEtapa(0);
                      } else {
                        const selectedOption = e.target.options[e.target.selectedIndex];
                        setRamoId(selectedValue);
                        setRamoNome(selectedOption.text);
                      }
                    }}
                  >
                    <option value="">Selecione um ramo</option>
                    {ramos.map((ramo) => (
                      <option key={ramo.id} value={ramo.id.toString()}>
                        {ramo.ramo}
                      </option>
                    ))}
                    <option value="novo">+ Adicionar novo ramo</option>
                  </select>
                </div>
                <div className={style.inputGroup}>
                  <label htmlFor="responsavel">Responsável</label>
                  <select
                    className={style.select}
                    name="responsavel"
                    id="responsavel"
                    value={responsavelId}
                    onChange={(e) => setResponsavelId(e.target.value)}
                  >
                    <option value="">Selecione um responsável</option>
                    {Array.isArray(responsaveis) && responsaveis.length > 0 ? (
                      responsaveis.map((responsavel) => (
                        <option key={responsavel.id} value={responsavel.id}>
                          {responsavel.nomeCompleto}
                        </option>
                      ))
                    ) : (
                      <option disabled>Nenhum responsável disponível</option>
                    )}
                  </select>
                </div>
              </div>

              {dadosVazios && (
                <p className={`${style.message} ${style.erro}`}>
                  Preencha todos os campos antes de continuar.
                </p>
              )}
              {erro && (
                <p className={`${style.message} ${style.erro}`}>
                  Ocorreu um erro. Tente novamente mais tarde.
                </p>
              )}

              <div className={style.buttonGroup}>
                <motion.button
                  type="submit"
                  className={style.buttonSubmit}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Continuar
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
        
        {etapa === 2 && (
          <motion.div
            key="etapa-2"
            className={style.formContainer}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={enviarCadastroFinal} className={style.form}>
              <h2 className={style.titleStep}>Etapa 2: Endereço</h2>

              <div className={style.inputGroup}>
                <label htmlFor="cep">CEP</label>
                <input
                  type="text"
                  id="cep"
                  name="cep"
                  placeholder="Digite o CEP"
                  maxLength={8}
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  onBlur={resgatarCep}
                />
              </div>

              <div className={style.row}>
                <div className={style.inputGroup}>
                  <label htmlFor="logradouro">Logradouro</label>
                  <input
                    type="text"
                    id="logradouro"
                    name="logradouro"
                    placeholder="Logradouro"
                    value={logradouro}
                    onChange={(e) => setLogradouro(e.target.value)}
                  />
                </div>
                <div className={style.inputGroup}>
                  <label htmlFor="numero">Número</label>
                  <input
                    type="text"
                    id="numero"
                    name="numero"
                    placeholder="Número"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                  />
                </div>
              </div>

              <div className={style.inputGroup}>
                <label htmlFor="complemento">Complemento</label>
                <input
                  type="text"
                  id="complemento"
                  name="complemento"
                  placeholder="Complemento"
                  value={complemento}
                  onChange={(e) => setComplemento(e.target.value)}
                />
              </div>

              <div className={style.row}>
                <div className={style.inputGroup}>
                  <label htmlFor="cidade">Cidade</label>
                  <input
                    type="text"
                    id="cidade"
                    name="cidade"
                    placeholder="Cidade"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                  />
                </div>
                <div className={style.inputGroup}>
                  <label htmlFor="estado">Estado</label>
                  <input
                    type="text"
                    id="estado"
                    name="estado"
                    placeholder="Estado"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                  />
                </div>
              </div>

              <div className={style.inputGroup}>
                <label htmlFor="pais">País</label>
                <input
                  type="text"
                  id="pais"
                  name="pais"
                  placeholder="País"
                  value={pais}
                  onChange={(e) => setPais(e.target.value)}
                />
              </div>

              {dadosVazios && (
                <p className={`${style.message} ${style.erro}`}>
                  Preencha todos os campos antes de continuar.
                </p>
              )}
              {sucesso && (
                <p className={`${style.message} ${style.sucesso}`}>
                  Empresa cadastrada com sucesso!
                </p>
              )}
              {erro && (
                <p className={`${style.message} ${style.erro}`}>
                  Ocorreu um erro. Tente novamente mais tarde.
                </p>
              )}

              <div className={style.buttonGroup}>
                <motion.button
                  type="button"
                  className={style.buttonVoltar}
                  onClick={() => setEtapa(1)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Voltar
                </motion.button>
                <motion.button
                  type="submit"
                  className={style.buttonSubmit}
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSubmitting ? "Enviando..." : "Finalizar Cadastro"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}

        {etapa === 0 && (
          <motion.div
            key="etapa-0"
            className={style.formContainer}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handleNovoRamo} className={style.form}>
              <h2 className={style.titleStep}>Cadastrar novo Ramo</h2>
              <div className={style.inputGroup}>
                <label htmlFor="novoRamo">Informe o nome do ramo</label>
                <input
                  type="text"
                  id="novoRamo"
                  name="novoRamo"
                  placeholder="Digite o ramo"
                  value={novoRamo}
                  onChange={(e) => setNovoRamo(e.target.value)}
                />
              </div>

              <div className={style.buttonGroup}>
                <motion.button
                  type="button"
                  className={style.buttonVoltar}
                  onClick={() => setEtapa(1)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Voltar
                </motion.button>
                <motion.button
                  type="submit"
                  className={style.buttonSubmit}
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSubmitting ? "Cadastrando..." : "Cadastrar Ramo"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </>
  );
}

export default CadastrarNovaEmpresa;