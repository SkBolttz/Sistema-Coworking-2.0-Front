import { useState } from "react";
import { motion } from "framer-motion";
import style from "./CadastroFuncionario.module.css";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setErrorMessage("");
    setIsSubmitting(true);
    setLoading(true);

    const nomeCompleto = e.target.elements["nome"].value.trim();
    const email = e.target.elements["email"].value.trim();
    const telefone = e.target.elements["telefone"].value.trim();
    const cpf = e.target.elements["cpf"].value.trim();
    const senha = e.target.elements["password"].value;
    const confirmarSenha = e.target.elements["confirmarSenha"].value;
    const observacao = e.target.elements["observacao"].value.trim();
    const fotoDocumentoFile = e.target.elements["foto"].files[0];
    const cnpj = e.target.elements["cnpj"].value.trim();

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

      await axios.post("https://sistema-coworking-20-production.up.railway.app/auth/registro", formData);

      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Erro no cadastro:", error);
      const mensagemErroAPI = error.response?.data?.detalhe;

      if (mensagemErroAPI === "O email fornecido já está em uso.") {
        setErrorMessage("Este email já está cadastrado.");
      } else if (mensagemErroAPI === "O CPF fornecido já está em uso.") {
        setErrorMessage("Este CPF já está cadastrado.");
      } else if (
        mensagemErroAPI === "Nome de usuario deve ter entre 10 e 40 caracteres"
      ) {
        setErrorMessage("O nome de usuário deve ter entre 10 e 40 caracteres.");
      } else if (mensagemErroAPI === "CPF deve ter 11 digitos") {
        setErrorMessage("O CPF deve ter 11 dígitos.");
      } else if (mensagemErroAPI === "Telefone deve ter 11 digitos") {
        setErrorMessage("O telefone deve ter 11 dígitos.");
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
                />
              </div>

              <div className={style.inputGroup}>
                <label htmlFor="confirmarSenha">Confirmar senha</label>
                <input
                  type="password"
                  name="confirmarSenha"
                  id="confirmarSenha"
                  placeholder="Confirme sua senha"
                />
              </div>

              <div className={style.inputGroup}>
                <label htmlFor="observacao">Observação (Opcional)</label>
                <input
                  type="text"
                  name="observacao"
                  id="observacao"
                  placeholder="Alguma observação importante?"
                />
              </div>

              <div className={style.inputGroup}>
                <label htmlFor="foto">Foto do documento</label>
                <input type="file" name="foto" id="foto" />
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
              onClick={() => (window.location.href = "/cadastrarFuncionario")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Retornar
            </motion.button>
          </div>
        </form>
      </motion.div>
    </main>
  );
}

export default PainelCadastro;
