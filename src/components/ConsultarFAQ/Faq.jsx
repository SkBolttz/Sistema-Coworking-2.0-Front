import style from "./Faq.module.css";
import Header from "../Header/Header";

function Faq() {
    return (
        <div>
            <Header />
            <div className={style.container}>
                <div className={style.header}>
                    <h1>FAQ</h1>
                </div>
            </div>
        </div>
    );
}

export default Faq