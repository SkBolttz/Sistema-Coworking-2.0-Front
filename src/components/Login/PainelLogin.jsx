import { useState } from "react";
import { motion } from "framer-motion";
import style from "./PainelLogin.module.css";
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

function PainelLogin() {
  const [erroLogin, setErroLogin] = useState(false);
  const [dadosVazios, setDadosVazios] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const cpf = e.target.elements["cpf"].value;
      const senha = e.target.elements["senha"].value;

      if (!cpf || !senha) {
        setDadosVazios(true);
        return;
      }

      setErroLogin(false);
      setDadosVazios(false);
      setLoading(true);

      const resposta = await axios.post("https://sistema-coworking-20-production.up.railway.app/auth/login", {
        cpf,
        senha,
      });

      const respostaEmail = await axios.post(
        "https://sistema-coworking-20-production.up.railway.app/visitante/verificarEmail",
        { cpf },
      );

      localStorage.setItem("cpf", cpf);
      localStorage.setItem("token", resposta.data.token);

      setTimeout(() => {
        if (respostaEmail.data === true) {
          window.location.href = "/admin";
        } else {
          window.location.href = "/home";
        }
      }, 2000);
    } catch (error) {
      console.error(error);
      setErroLogin(true);
      setLoading(false);
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
        <h1 className={style.title}>Bem-vindo de volta!</h1>
        <p className={style.subtitle}>Faça login para continuar.</p>

        {loading && (
          <div className={style.loadingOverlay}>
            <CircularColor />
          </div>
        )}

        <form className={style.loginForm} onSubmit={handleSubmit}>
          <div className={style.inputGroup}>
            <label htmlFor="cpf">CPF</label>
            <input id="cpf" type="text" autoFocus maxLength={11} />
          </div>

          <div className={style.inputGroup}>
            <label htmlFor="senha">Senha</label>
            <input id="senha" type="password" placeholder="******"  maxLength={8}/>
          </div>

          {erroLogin && (
            <p className={style.errorMessage}>Login com dados incorretos!</p>
          )}
          {dadosVazios && (
            <p className={style.errorMessage}>
              Por favor, preencha todos os campos.
            </p>
          )}

          <motion.button
            type="submit"
            className={style.submitButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Entrar
          </motion.button>
        </form>

        <div className={style.footerActions}>
          <a href="/recuperarSenha" className={style.forgotPassword}>
            Esqueci minha senha
          </a>
          <button
            type="button"
            className={style.signupButton}
            onClick={() => (window.location.href = "/cadastro")}
          >
            Criar conta
          </button>
        </div>
      </motion.div>
    </main>
  );
}

export default PainelLogin;
