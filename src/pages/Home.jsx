import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import React from "react";

import { useUser } from "../../services/UserContext";  // Importando o contexto do usuário

import { load, success_cad, success, fail, ainda_nao} from "../../services/alert.js"; //Sweet Alert 2

//import { toast_load, toast_success_cad, toast_success, toast_fail} from "../../services/alert_toastfy.js"; // REACT TOASTFY

import { sonner_load, sonner_success_cad, sonner_success, sonner_fail, sonner_ainda_nao, sonner_conta_desativada} from "../../services/alert_toast.js"; // Sonner

export default function Home() {
  const [isActive, setIsActive] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [, setError] = useState("");
  const navigate = useNavigate();
  const loginRef = useRef(null)
  const firstSec = useRef(null)
  const ColabRef = useRef(null)

  const [message, setMessage] = useState('');

  const scrollToLogin = () => loginRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const scrollToSM = () => firstSec.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const scrollToColab = () => ColabRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const { setUserName } = useUser();  // Obtendo o setUserName (renomeado para clareza)
  

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
        const userData = sessionStorage.getItem("user");

        if (userData) {
            const storedUser = JSON.parse(userData);
            if (storedUser) {
                navigate("/ua");
            }
        }
    } catch (error) {
        console.error("Erro ao analisar JSON do usuário:", error);
        sessionStorage.removeItem("user"); // Remove o dado inválido para evitar problemas futuros
    }
}, [navigate]);




  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  function clearFields() {
    setEmail("");
    setPassword("");
    setName("");
  }

  const handleRegisterClick = () => {
    setIsActive(true);
  };

  const handleLoginClick = () => {
    setIsActive(false);
  };


  // Configurações do Toast para mensagens de successo e erro
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    heightAuto: false,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
    customClass: {
      popup: "toast-custom",
    },
  });

  const showToastSuccess = (message) => {
    Toast.fire({
      icon: "success",
      title: message,
    });
  };

  const showToastError = (message) => {
    Toast.fire({
      icon: "error",
      title: message,
    });
  };
  // Testando pg
  async function handleSignUp(e) {
    e.preventDefault();
    console.log("API_URL:", import.meta.env.VITE_API_URL);

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        if (!response.ok) {
            throw new Error("Erro ao cadastrar usuário.");
        }

        const user = await response.json();
        sessionStorage.setItem("user", JSON.stringify(user));
        navigate("/ua");
        sonner_success_cad();
    } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        sonner_fail();
    }
}

// PostGree Login Funciona
async function handleSignIn(e) {
  e.preventDefault();

  try {
      sonner_load(); // Inicia o carregamento

      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("🚀 Dados recebidos do backend:", data); // 👀 Depuração

      if (!response.ok) {
          if (response.status === 403) {
              sonner_conta_desativada(data.error);
          } else if (response.status === 401) {
              sonner_fail(data.error);
          } else {
              sonner_fail("Erro desconhecido ao fazer login.");
          }
          return;
      }

      if (!data || !data.data) {
          console.error("❌ Erro: Nenhum dado de usuário recebido.");
          sessionStorage.removeItem("user");
          return;
      }

      // ✅ Armazena os dados corretamente no sessionStorage
      sessionStorage.setItem("user", JSON.stringify(data.data));

      // ✅ Redireciona o usuário para a área logada
      navigate("/ua");
      sonner_success(data.message);

  } catch (error) {
      console.error("❌ Erro ao fazer login:", error);
      sonner_fail("Erro ao conectar ao servidor.");
  }
}



async function handleForgotPassword() {
    Swal.fire({
      title: "Esqueceu sua senha?",
      text: "Digite seu e-mail para redefinir a senha:",
      input: "email",
      inputPlaceholder: "lovelace@gmail.com",
      showCancelButton: true,
      confirmButtonText: "Enviar",
      confirmButtonColor: "#F21B3F",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: 'swal-button-confirm',
        cancelButton: 'swal-button-cancel'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const email = result.value;
        sonner_load();
  
        try {
          // Verificar se o e-mail existe no Firestore
          const userExists = await checkIfEmailExists(email);
  
          if (userExists) {
            // Enviar e-mail de redefinição de senha
            await sendPasswordResetEmail(auth, email);
            toast.success("Um e-mail de redefinição de senha foi enviado para " + email);
          } else {
            // Se o e-mail não existir, exibe uma mensagem de erro
            showToastError("O e-mail informado não está cadastrado.");
          }
        } catch (error) {
          console.error(error);
          showToastError("Ocorreu um erro ao processar a solicitação. Tente novamente mais tarde.");
        }
      }
    });
}

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Lovelace</h1>
        <nav>
          <ul>
            <li><button onClick={scrollToColab} id={styles.sobreNos}>Sobre nós</button></li>
            <li><button onClick={scrollToLogin}>Fazer Login</button></li>
            <li><button onClick={scrollToLogin}>Criar Conta</button></li>
          </ul>
        </nav>
      </header>
      <section className={styles.mainContent}>
      <img src="/img/image1.svg" alt="Ada Lovelace" />

        <div>
          <h1>Lovelace</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eget
            tortor ac turpis viverra luctus. In ornare tempus lacinia. Maecenas
            interdum felis quis arcu congue vulputate. Donec vitae posuere
            ligula, quis tristique dui. Mauris a sapien vitae dolor tincidunt
            rhoncus. Integer massa elit, lacinia non luctus at, condimentum at
            erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
            fringilla pretium commodo. Duis viverra, mauris non malesuada
            malesuada, turpis turpis consectetur ante, id lacinia lorem lacus
            eget diam. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Praesent in est eu felis ornare luctus auctor ut elit. Nam placerat
            urna eu nisi blandit ornare.
          </p>
          <button onClick={scrollToSM}>Achou legal? Saiba mais!</button>
        </div>
      </section>
      <section ref={firstSec} className={styles.secVideo}>
        <strong>Para você estudante!</strong>
        <div>
          <p>
            Você poderá escolher entre duas formas de praticar seu conhecimento
            em inglês.
            <br />
            <br />
            Podendo ser uma prática simples com um texto de leitura, onde basta
            você retirar as palavras chaves do texto! Isso tudo com direito a um
            resultado no final e para você poder medir o quão fluente você é,
            também poderá saber se corresponde a um dos três níveis de
            conhecimentos:
            <br />
            <br />
            <span>Beginner</span>, <span>Intermediary</span> e <span>Advanced</span>.
          </p>
          <video src=""></video>
        </div>
      </section>
      <div className={styles.paraProf}>
        <h1>
          <strong >Para professores</strong>
        </h1>
      </div>
      <section className={styles.secVideo}>
        <strong>Você poderá usar a nossa ferramenta de questionário!</strong>
        <div>
          <p>
            Basta adicionar sua questão, seu texto e explicar para seus alunos
            qual é o propósito daquela atividade! Ah! Lembre-se, essa ferramenta
            foi projetada para ser utilizada em sala de aula!
            <br />
            <br />
            Você terá acesso em tempo real das respostas dos alunos, um código
            de acesso para a atividade, edição pós-criação caso queira alterar o
            questionário.
          </p>
          <video src=""></video>
        </div>
      </section>
      <section ref={ColabRef} className={styles.collaborators}>
        <span>Esse é um projeto de iniciação científica!</span>
        <div className={styles.midlle}>
          <p>
            Idealizado e desenvolvido por três alunos do IFBA Campus Camaçari
            <br />
            <br />
            Nos dividimos em uma pequena equipe de estudantes do curso de
            ciência da computação.
            <br />
            <br />
            Esse projeto só foi possível graças a orientação da orientadora.
          </p>
          <h1>Lovelace</h1>
        </div>
        <div className={styles.cards}>
          <div>
            <img src="/img/pexels-moh-adbelghaffar-771742.jpg" alt="" />
            <p>Marcos Emanuel</p>
            <p>Ux/UI Designer</p>
          </div>
          <div>
            <img src="/img/pexels-andrewperformance1-697509.jpg" alt="" />
            <p>Melkysedeke Costa</p>
            <p>Desenvolvedor Fullstack</p>
          </div>
          <div>
            <img src="/img/pexels-olly-3785079.jpg" alt="" />
            <p>Daniel de Santana Alves</p>
            <p>Desenvolvedor Fullstack</p>
          </div>
          <div>
            <img src="/img/pexels-olly-774909.jpg" alt="" />
            <p>Lenade Barreto Santos Gil</p>
            <p>Orientadora</p>
          </div>
        </div>
      </section>
      <section ref={loginRef} className={`${styles.login} ${isActive ? styles.active : ""}`}>
        <div className={`${styles.form_container} ${styles.sign_up}`}> 
          <form onSubmit={handleSignUp}>
            <h1>Criar Conta</h1>
            <div className={styles.social_icons}>
                <a
                  className={styles.icon}
                  onClick={(e) => {
                    e.preventDefault(); // Previne o comportamento padrão do link
                    ainda_nao(); // Chama a função ainda_não
                  }}
                >
                  <FontAwesomeIcon icon={faGoogle} style={{ color: "#DB4437" }} />
                </a>
              {/* <a href="#" className={styles.icon}><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#" className={styles.icon}><i className="fa-brands fa-github"></i></a>
              <a href="#" className={styles.icon}><i className="fa-brands fa-linkedin-in"></i></a> */}
            </div>
            <span>ou use seu e-mail para registro</span>
            <input
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className={styles.showpassword}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {showPassword ? (
                  <FontAwesomeIcon icon={faEye} />
                ) : (
                  <FontAwesomeIcon icon={faEyeSlash} />
                )}
              </button>
            </div>
            <button type="submit">Cadastrar</button>
          </form>
        </div>

        <div className={`${styles.form_container} ${styles.sign_in}`}>
          <form onSubmit={handleSignIn}>
            <h1>Entrar</h1>
            <div className={styles.social_icons}>
            <a
                  className={styles.icon}
                  onClick={(e) => {
                    e.preventDefault(); // Previne o comportamento padrão do link
                    sonner_ainda_nao(); // Chama a função ainda_não
                  }}
                >
                  <FontAwesomeIcon icon={faGoogle} style={{ color: "#DB4437" }} />
                </a>
              {/* <a href="#" className={styles.icon}><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#" className={styles.icon}><i className="fa-brands fa-github"></i></a>
              <a href="#" className={styles.icon}><i className="fa-brands fa-linkedin-in"></i></a> */}
            </div>
            <span>ou use sua senha de e-mail</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className={styles.showpassword}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {showPassword ? (
                  <FontAwesomeIcon icon={faEye} />
                ) : (
                  <FontAwesomeIcon icon={faEyeSlash} />
                )}
              </button>
            </div>
            <a onClick={handleForgotPassword} className={styles.link}>
              Esqueceu sua senha?
            </a>
            <button type="submit">Entrar</button>
          </form>
        </div>

        <div className={styles.toggle_container}>
          <div className={styles.toggle}>
            <div className={`${styles.toggle_panel} ${styles.toggle_left}`}>
              <h1>Bem-vindo de Volta!</h1>
              <p>
                Digite seus dados pessoais para usar todos os recursos do site
              </p>
              <button className={styles.hidden} onClick={handleLoginClick}>
                Entrar
              </button>
            </div>
            <div className={`${styles.toggle_panel} ${styles.toggle_right}`}>
              <h1>Olá, Amigo!</h1>
              <p>
                Registre-se com seus dados pessoais para usar todos os recursos
                do site
              </p>
              <button className={styles.hidden} onClick={handleRegisterClick}>
                Cadastrar
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}