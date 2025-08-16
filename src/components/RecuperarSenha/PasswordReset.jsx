import React from "react";
import { motion } from "framer-motion";
import style from "./PasswordReset.module.css";

function PasswordReset() {
  const handleEmailConfirmation = () => {
    console.log("Email de confirmação enviado!");
  };

  const handleSignIn = () => {
    window.location.href = "/"; 
  };

  return (
    <main className={style.mainContainer}>
      <motion.div
        className={style.formContainer}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className={style.title}>Redefinir Senha</h1>
        <p className={style.subtitle}>Vamos ajudar você a redefinir sua senha.</p>

        <div className={style.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email" 
            id="email"
            className={style.inputField}
            placeholder="Digite seu endereço de email"
            required
          />
        </div>

        <motion.button
          className={style.confirmButton}
          onClick={handleEmailConfirmation}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Confirmar Email
        </motion.button>

        <div className={style.divider} />

        <p className={style.rememberPasswordText}>
          Lembra da sua senha?
        </p>
        <motion.button
          className={style.backToSignInButton}
          onClick={handleSignIn}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Voltar para o Login
        </motion.button>
      </motion.div>
    </main>
  );
}

export default PasswordReset;
