import React from "react";
import { motion } from "framer-motion";
import style from "./Header.module.css";
import axios from "axios";

function Header() {
  const emailDomain = "@coworking.com.br";
  const adminEmailDomain = "@coworkingadmin.com.br";

  const verificarInicio = async () => {
    try {
      const cpf = localStorage.getItem("cpf");
      const token = localStorage.getItem("token");

      if (!cpf || !token) {
        window.location.href = "/";
        return;
      }

      const resposta = await axios.post(
        "http://localhost:8080/visitante/dados",
        { cpf: cpf },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (
        resposta.data.email.includes(emailDomain) ||
        resposta.data.email.includes(adminEmailDomain)
      ) {
        window.location.href = "/admin";
      } else {
        window.location.href = "/home";
      }
    } catch (error) {
      console.error(
        "Erro ao verificar início ou buscar dados do visitante:",
        error
      );
      sairLogin();
    }
  };

  const sairLogin = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cpf");
    localStorage.removeItem("visitante");
    window.location.href = "/";
  };

  return (
    <motion.header
      className={style.header}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className={style.logoContainer}>
        <svg
          className={style.logo}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        <p className={style.logoText}>Coworking</p>
      </div>

      <nav className={style.links}>
        <a href="#" onClick={verificarInicio}>
          Início
        </a>
        <a href="/minhas-reservas">Minhas Reservas</a>
        <a href="/faq">FAQ</a>
      </nav>

      <div className={style.menu}>
        <motion.button
          type="button"
          onClick={sairLogin}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Sair
        </motion.button>
      </div>
    </motion.header>
  );
}

export default Header;
