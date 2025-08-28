import { useState } from "react";
import { motion } from "framer-motion";
import style from "./PainelCadastro.module.css";
import axios from "axios";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

function CircularColor() {
  return (
    <Stack sx={{ color: "grey.500" }} spacing={2} direction="row">
      <CircularProgress color="success" />
    </Stack>
  );
}

function PainelCadastro() {
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [observacao, setObservacao] = useState("");
  const [fotoDocumentoFile, setFotoDocumentoFile] = useState(null);
  const [cnpj, setCnpj] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setErrorMessage("");
    setIsSubmitting(true);
    setLoading(true);

    if (
      !nomeCompleto ||
      !email ||
      !telefone ||
      !cpf ||
      !senha ||
      !confirmarSenha ||
      !fotoDocumentoFile
    ) {
      setErrorMessage("Por favor, preencha todos os campos obrigatórios.");
      setIsSubmitting(false);
      setLoading(false);
      return;
    }

    if (senha !== confirmarSenha) {
      setErrorMessage("As senhas digitadas não coincidem.");
      setIsSubmitting(false);
      setLoading(false);
      return;
    }

    if (cpf.length !== 11 || !/^\d+$/.test(cpf)) {
      setErrorMessage("O CPF deve conter exatamente 11 dígitos numéricos.");
      setIsSubmitting(false);
      setLoading(false);
      return;
    }

    if (telefone.length !== 11 || !/^\d+$/.test(telefone)) {
      setErrorMessage(
        "O telefone deve conter exatamente 11 dígitos numéricos."
      );
      setIsSubmitting(false);
      setLoading(false);
      return;
    }

    if (nomeCompleto.length < 10 || nomeCompleto.length > 40) {
      setErrorMessage(
        "O nome completo deve conter pelo menos 10 e no máximo 40 caracteres."
      );
      setIsSubmitting(false);
      setLoading(false);
      return;
    }

    if (senha.length < 8 || confirmarSenha.length < 8) {
      setErrorMessage("A senha deve conter pelo menos 8 caracteres.");
      setIsSubmitting(false);
      setLoading(false);
      return;
    }

    if (cnpj.length !== 0) {
      if (cnpj.length !== 14 || !/^\d+$/.test(cnpj)) {
        setErrorMessage("O CNPJ deve conter exatamente 14 dígitos numéricos.");
        setIsSubmitting(false);
        setLoading(false);
        return;
      }
    }

    try {
      const visitante = {
        nomeCompleto,
        email,
        telefone,
        cpf,
        senha,
        observacao,
        cnpj,
      };

      const formData = new FormData();
      formData.append(
        "visitante",
        new Blob([JSON.stringify(visitante)], { type: "application/json" })
      );
      formData.append("file", fotoDocumentoFile);

      axios.post(
        "https://sistema-coworking-20-production.up.railway.app/auth/registro",
        formData
      );

      setTimeout(() => {
        setLoading(false);
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      console.error("Erro no cadastro:", error);
      const mensagemErroAPI = error.response?.data?.detalhe;

      if (mensagemErroAPI === "O email fornecido já está em uso.") {
        setErrorMessage("Este email já está cadastrado.");
      } else if (mensagemErroAPI === "O CPF fornecido já está em uso.") {
        setErrorMessage("Este CPF já está cadastrado.");
      } else {
        setErrorMessage(
          "Ocorreu um erro inesperado ao tentar cadastrar. Tente novamente."
        );
      }
      setLoading(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={style.mainContainer}>
      <motion.div
        className={style.formContainer}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className={style.title}>Crie sua conta</h1>
        <p className={style.subtitle}>
          Preencha os campos abaixo para se cadastrar.
        </p>

        {loading && (
          <div className={style.loadingOverlay}>
            <CircularColor />
          </div>
        )}

        <form className={style.cadastroForm} onSubmit={handleSubmit}>
          <div className={style.formRow}>
            <div className={style.formColumn}>
              <div className={style.inputGroup}>
                <label htmlFor="nome">Nome completo</label>
                <input
                  type="text"
                  name="nome"
                  id="nome"
                  placeholder="Seu nome completo"
                  value={nomeCompleto}
                  maxLength={40}
                  onChange={(e) => setNomeCompleto(e.target.value)}
                  autoFocus
                />
              </div>

              <div className={style.inputGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  maxLength={320}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className={style.inputGroup}>
                <label htmlFor="telefone">Telefone</label>
                <input
                  type="text"
                  name="telefone"
                  id="telefone"
                  placeholder="Ex: 11987654321"
                  maxLength={11}
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                />
              </div>

              <div className={style.inputGroup}>
                <label htmlFor="cpf">CPF</label>
                <input
                  type="text"
                  name="cpf"
                  id="cpf"
                  placeholder="Somente números"
                  maxLength={11}
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                />
              </div>
            </div>

            <div className={style.formColumn}>
              <div className={style.inputGroup}>
                <label htmlFor="password">Senha</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Mínimo 6 caracteres"
                  value={senha}
                  maxLength={30}
                  onChange={(e) => setSenha(e.target.value)}
                />
              </div>

              <div className={style.inputGroup}>
                <label htmlFor="confirmarSenha">Confirmar senha</label>
                <input
                  type="password"
                  name="confirmarSenha"
                  id="confirmarSenha"
                  placeholder="Confirme sua senha"
                  value={confirmarSenha}
                  maxLength={30}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                />
              </div>

              <div className={style.inputGroup}>
                <label htmlFor="observacao">Observação (Opcional)</label>
                <input
                  type="text"
                  name="observacao"
                  id="observacao"
                  placeholder="Alguma observação importante?"
                  value={observacao}
                  maxLength={200}
                  onChange={(e) => setObservacao(e.target.value)}
                />
              </div>

              <div className={style.inputGroup}>
                <label htmlFor="foto">Foto do documento</label>
                <input
                  type="file"
                  name="foto"
                  id="foto"
                  onChange={(e) => setFotoDocumentoFile(e.target.files[0])}
                />
              </div>

              <div className={style.inputGroup}>
                <label htmlFor="cnpj">
                  CNPJ (Opcional, se for funcionário)
                </label>
                <input
                  type="text"
                  name="cnpj"
                  id="cnpj"
                  placeholder="CNPJ da empresa"
                  value={cnpj}
                  maxLength={14}
                  onChange={(e) => setCnpj(e.target.value)}
                />
              </div>
            </div>
          </div>

          {errorMessage && <p className={style.errorMessage}>{errorMessage}</p>}

          <div className={style.buttonGroup}>
            <motion.button
              type="submit"
              className={style.submitButton}
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? "Cadastrando..." : "Cadastrar"}
            </motion.button>
            <motion.button
              type="button"
              className={style.returnButton}
              onClick={() => (window.location.href = "/")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Retornar ao Login
            </motion.button>
          </div>
        </form>
      </motion.div>
    </main>
  );
}

export default PainelCadastro;
