import { motion } from "framer-motion";
import style from "./Footer.module.css";

function Footer() {
  return (
    <motion.footer
      className={style.footer}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className={style.footerContent}>
        <p>&copy; 2025 Coworking System. Todos os direitos reservados.</p>
        <p className={style.desenvolvedor}>Desenvolvido por Henrique | Desenvolvedor Junior</p>
      </div>
    </motion.footer>
  );
}

export default Footer;
