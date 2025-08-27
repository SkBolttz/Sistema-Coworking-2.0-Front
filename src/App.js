import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import PainelLogin from "./components/Login/PainelLogin";
import PainelCadastro from "./components/Cadastro/PainelCadastro";
import PaginaInicial from "./components/Pagina Inicial User/PaginaInicial";
import ConsultarReserva from "./components/ConsultarReserva/ConsultarReserva";
import PaginaInicialAdmin from "./components/Pagina Inicial Admin/PaginaInicialAdmin";
import CadastrarEstacao from "./components/Cadastrar Estacao/CadastrarEstacao";
import FormCadastroEstacao from "./components/Cadastrar Estacao/FormCadastroEstacao";
import CadastararSala from "./components/Cadastrar Sala/CadastrarSala";
import FormCadastroSala from "./components/Cadastrar Sala/FormCadastroSala";
import AtualizarSala from "./components/AtualizarSala/AtualizarSala";
import AtualizarEstacao from "./components/AtualizarEstacao/AtualizarEstacao";
import CadastrarFuncionario from "./components/CadastrarFuncionario/CadastrarFuncionario";
import CadastroFuncionario from "./components/CadastrarFuncionario/CadastroFuncionario";
import AtualizarFuncionario from "./components/AtualizarFuncionario/AtualizarFuncionario";
import CadastrarEmpresa from "./components/CadastrarEmpresa/CadastroEmpresa";
import CadastrarNovaEmpresa from "./components/CadastrarEmpresa/CadastrarNovaEmpresa";
import PasswordReset from "./components/RecuperarSenha/PasswordReset";
import AtualizarEmpresa from "./components/AtualizarEmpresa/AtualizarEmpresa";
import ListaEstacoesLivres from "./components/ConsultarEstacoesLivres/ListaEstacoesLivres";
import ListarSalasLivres from "./components/ConsultarSalasLivres/ListarSalasLivres";
import ConsultarPerfil from "./components/ConsultarPerfil/ConsultarPerfil";
import ConsultarEmpresa from "./components/ConsultarEmpresa/ConsultarEmpresa";
import Faq from "./components/ConsultarFAQ/Faq";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PainelLogin />} />
        <Route path="/cadastro" element={<PainelCadastro />} />
        <Route path="/home" element={<PaginaInicial />} />
        <Route path="/consultaReserva" element={<ConsultarReserva />} />
        <Route path="/admin" element={<PaginaInicialAdmin />} />
        <Route path="/cadastrarEstacao" element={<CadastrarEstacao />} />
        <Route path="/formCadastroEstacao" element={<FormCadastroEstacao />} />
        <Route path="/cadastrarSala" element={<CadastararSala />} />
        <Route path="/formCadastroSala" element={<FormCadastroSala />} />
        <Route path="/atualizarSala" element={<AtualizarSala />} />
        <Route path="/atualizarEstacao" element={<AtualizarEstacao />} />
        <Route path="/cadastrarFuncionario" element={<CadastrarFuncionario />} />
        <Route path="/cadastroFuncionario" element={<CadastroFuncionario />} />
        <Route path="/atualizarFuncionario" element={<AtualizarFuncionario />} />
        <Route path="/cadastrarEmpresa" element={<CadastrarEmpresa />} />
        <Route path="/cadastroEmpresa" element={<CadastrarNovaEmpresa />} />
        <Route path="/recuperarSenha" element={<PasswordReset />} />
        <Route path="/atualizarEmpresa" element={<AtualizarEmpresa />} />
        <Route path="/estacoesLivres" element={<ListaEstacoesLivres />} />
        <Route path="/salasLivres" element={<ListarSalasLivres />} />
        <Route path="/consultarPerfil" element={<ConsultarPerfil />} />
        <Route path="/consultarEmpresa" element={<ConsultarEmpresa />} />
        <Route path="/faq" element={<Faq />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
