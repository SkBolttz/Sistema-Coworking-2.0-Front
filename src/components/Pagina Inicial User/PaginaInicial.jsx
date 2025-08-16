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
      <div>
        <Header />
      </div>

      <div className={style.container}>
        <div>
          <div className={style.cardOne}>
            <div className={style.LowerCard}>
              <button
                onClick={() => (window.location.href = "/reservar")}
                className={style.cardButton}
              >
                <p className={style.imagem}>
                  <img src={CalendarClock} alt="Calendar Clock" />
                </p>
                <p>Reservar Sala</p>
              </button>
            </div>

            <div className={style.LowerCard}>
              <button className={style.cardButton}>
                <p className={style.imagem}>
                  <img src={Laptop} alt="Laptop" />
                </p>
                <p>Reservar Estacao</p>
              </button>
            </div>
            <div className={style.LowerCard}>
              <button className={style.cardButton}>
                <p className={style.imagem}>
                  <img src={Laptop} alt="Laptop" />
                </p>
                <p>Reservar Estacao</p>
              </button>
            </div>
          </div>

          <div className={style.cardTwo}>
            <div className={style.LowerCard}>
              <button className={style.cardButton}>
                <p className={style.imagem}>
                  <img src={Search} alt="Search" />
                </p>
                <p>Verificar Salas Disponiveis</p>
              </button>
            </div>
            <div className={style.LowerCard}>
              <button className={style.cardButton}>
                <p className={style.imagem}>
                  <img src={Enterprise} alt="Enterprise" />
                </p>
                <p>Consultar Empresa</p>
              </button>
            </div>
            <div className={style.LowerCard}>
              <button className={style.cardButton}>
                <p className={style.imagem}>
                  <img src={Enterprise} alt="Enterprise" />
                </p>
                <p>Consultar Empresa</p>
              </button>
            </div>
          </div>
        </div>

        <div className={style.Dashboard}>
          <div>
            <h2 className={style.DashboardTittle}>DASHBOARD</h2>
          </div>

          <div className={style.ContainerV2}>
            <div>
              <p className={style.imagemDash}>
                <img src={Graphic} alt="Graphic" />
              </p>
            </div>

            <div className={style.GraphicV2}>
              <ul>
                <li>
                  <p className={style.GraphicV2Parag}>
                    Empresas Cadastradas: 15
                  </p>
                </li>
                <li>
                  <p className={style.GraphicV2Parag}>
                    Usuario Cadastrados: 30
                  </p>
                </li>
              </ul>
            </div>
          </div>

          <div className={style.List}>
            <ul className={style.legenda}>
              <li>
                <span className={style.cor_livre}></span>Salas Livres
                <p>15</p>
              </li>
              <li>
                <span className={style.cor_ocupada}></span>Salas Ocupadas
                <p>09</p>
              </li>
              <li>
                <span className={style.cor_outros}></span>Outros
                <p>62%</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default PaginaInicial;
