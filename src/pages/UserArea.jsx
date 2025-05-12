import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ActivityGallery from "../components/ActivityGallery";
import styles from "./UserArea.module.css";
import ActivitySection from "../components/ActivitySection";
import Materials from "../components/Materials";

import { auth, db } from "../../services/firebaseConfig.js"; 
import { signOut } from "firebase/auth";

import { load, success, fail, ainda_nao} from "../../services/alert.js";

import { Toaster, toast } from 'sonner';

import { useUser } from "../../services/UserContext.jsx";  // Importa o UserContext


export default function UserArea() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const { login } = useUser();
  const storedUser = (() => {
    try {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error("Erro ao analisar JSON do usuário:", error);
        localStorage.removeItem("user");
        return null;
    }
  })();
  


  useEffect(() => {
    try {
        if (storedUser ) {
            login(storedUser.name, storedUser.id);
            setUser(storedUser);
            // console.log("STORED USERRRRRRRRR",storedUser);
            // console.log("ID LOCAL",storedUser.id);
            // console.log("NOME ",storedUser.name);
        } else {
            navigate("/");
        }
    } catch (error) {
        console.error("Erro ao analisar o usuário do sessionStorage:", error);
        navigate("/");
    }
    }, [navigate]);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleLogout = async () => {
    try {
      // Deslogar do Firebase
      await signOut(auth);

      // Remover o usuário do sessionStorage
      localStorage.removeItem('user');

      // Definir o estado do usuário como vazio
      setUser({});

      // Log para verificar o estado atual de 'user'

      toast.success("Logout realizado com sucesso.");

      // Redirecionar para a página inicial
      navigate("/");
    } catch (error) {
      console.error("Erro ao deslogar:", error);
      toast.fail("Erro ao deslogar:", error);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>
          <a href="/ua">Lovelace</a>
        </h1>
        <div className={styles.userInfo}>
          {user ? (
            <>
              <p onClick={toggleMenu}>{user.name}</p>
              <div>
                <img
                  onClick={toggleMenu}
                  src={user.profileImage || "/defaultProfile.png"}
                  alt="Avatar do usuário"
                  className={styles.userImage}
                />
                {menuVisible && (
                  <div className={styles.dropdownMenu}>
                    <ul>
                      <li onClick={() => navigate("/profile")}>Perfil</li>
                      <li onClick={handleLogout}>Logout</li>
                    </ul>
                  </div>
                )}
              </div>
            </>
          ) : (
            <p>loading...</p>
          )}
        </div>
      </header>
      <ActivityGallery />
      <ActivitySection />
      <Materials />
    </div>
  );
}
