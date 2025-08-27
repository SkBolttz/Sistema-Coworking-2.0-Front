import style from "./PaginaInicial.module.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import CalendarClock from "../../Image/CalendarClock.png";
import Enterprise from "../../Image/Enterprise.png";
import Laptop from "../../Image/Laptop.png";
import Search from "../../Image/Search.png";
import Graphic from "../../Image/Graphic.png";


function PaginaInicial() {

  return (
    <div>
      <Header />
      <main className={style.mainContainer}>
        <section className={style.actionCardsSection}>
          <button
            onClick={() => (window.location.href = "/consultaReserva")}
            className={style.actionCard}
          >
            <div className={style.actionCardIcon}>
              <img src={CalendarClock} alt="Calendar Clock" />
            </div>
            <p>Suas Reservas</p>
          </button>

          <button className={style.actionCard} onClick={() => (window.location.href = "/estacoesLivres")}>
            <div className={style.actionCardIcon}>
              <img src={Laptop} alt="Laptop" />
            </div>
            <p>Verificar Estações Livres</p>
          </button>

          <button className={style.actionCard} onClick={() => (window.location.href = "/salasLivres")}>
            <div className={style.actionCardIcon}>
              <img src={Laptop} alt="Laptop" />
            </div>
            <p>Verificar Salas Disponíveis</p>
          </button>

          <button className={style.actionCard} onClick={() => (window.location.href = "/consultarPerfil")}>
            <div className={style.actionCardIcon}>
              <img src={Search} alt="Search" />
            </div>
            <p>Consultar Perfil</p>
          </button>

          <button className={style.actionCard} onClick={() => (window.location.href = "/consultarEmpresa")}>
            <div className={style.actionCardIcon}>
              <img src={Enterprise} alt="Enterprise" />
            </div>
            <p>Consultar Empresa</p>
          </button>

          <button className={style.actionCard} onClick={() => (window.location.href = "/faq")}>
            <div className={style.actionCardIcon}>
              <img src={Enterprise} alt="Enterprise" />
            </div>
            <p>FAQ</p>
          </button>
        </section>

        <section className={style.dashboardSection}>
          <h2 className={style.dashboardTitle}>DASHBOARD</h2>

          <div className={style.dashboardContent}>
            <div className={style.graphicContainer}>
              <img src={Graphic} alt="Graphic" />
            </div>

            <div className={style.statsList}>
              <ul>
                <li>Usuários Cadastrados: <span>30</span></li>

              </ul>
            </div>
          </div>

          <ul className={style.legendList}>
            <li>
              <span className={`${style.legendColorBox} ${style.cor_livre}`}></span>
              Salas Livres: <span>15</span>
            </li>
            <li>
              <span className={`${style.legendColorBox} ${style.cor_ocupada}`}></span>
              Salas Ocupadas: <span>09</span>
            </li>
            <li>
              <span className={`${style.legendColorBox} ${style.cor_outros}`}></span>
              Estações Livres: <span>62%</span>
            </li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default PaginaInicial;
