import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Profile.module.css";

import { getAuth , updatePassword ,EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth"; 
import { getFirestore, doc, deleteDoc } from "firebase/firestore"; 
import { db } from "../../services/firebaseConfig.js"; 
import Swal from "sweetalert2";

import { toast } from 'sonner'

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newImage, setNewImage] = useState("");
  const [imageType, setImageType] = useState("url");
  const [showTooltip, setShowTooltip] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      console.log("CARREGOU USUSARIO");
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const saveChanges = async () => {
    if (newPassword && newPassword !== confirmPassword) {
        setErrorMessage("As senhas não coincidem.");
        return;
    }

    try {
        const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, ""); // Remove barra extra
        //console.log("📡 API URL carregada:", apiUrl);

        // Atualizar dados do usuário no backend
        const response = await fetch(`${apiUrl}/users/${user.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...user,
                password: newPassword || user.password,
                profileImage: user.profileImage || "/defaultProfile.png",
            }),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Erro ao atualizar perfil: ${errorMessage}`);
        }

        const updatedUser = await response.json();
        console.log("✅ Usuário atualizado:", updatedUser);

        sessionStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setSuccessMessage("Dados atualizados com sucesso!");
        setErrorMessage("");

    } catch (err) {
        console.error("❌ Erro ao atualizar perfil:", err);
        setErrorMessage("Erro ao atualizar os dados.");
    }
};


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewImage(event.target.result);
        setImageType("file");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e) => {
    setNewImage(e.target.value);
    setImageType("url");
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const saveImage = () => {
    setUser({ ...user, profileImage: newImage });
    sessionStorage.setItem(
      "user",
      JSON.stringify({ ...user, profileImage: newImage })
    );
    toggleModal();
  };

  // Apaga tb a do firebase
  const deleteUserAccount = async () => {
    const confirmResult = await Swal.fire({
        title: "Tem certeza?",
        text: "Esta ação não pode ser desfeita. Todas as suas atividades e respostas serão apagadas permanentemente!",
        icon: "warning",
        iconColor: "#F21B3F",
        showCancelButton: true,
        confirmButtonColor: "#F21B3F",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, excluir!",
        cancelButtonText: "Cancelar"
    });

    if (!confirmResult.isConfirmed) {
        return;
    }

    try {
        // Obtendo o usuário autenticado
        const storedUser = sessionStorage.getItem('user');
        if (!storedUser) {
            toast.error("Erro: Nenhum usuário autenticado.");
            return;
        }

        const user = JSON.parse(storedUser);
        console.log("🔹 Usuário autenticado para exclusão:", user);

        // Confirmação da senha antes de excluir
        const passwordConfirm = await Swal.fire({
            title: 'Confirmação de Senha',
            text: "Por favor, insira sua senha para confirmar a exclusão:",
            input: 'password',
            showCancelButton: true,
            confirmButtonColor: "#F21B3F",
            confirmButtonText: "Confirmar",
            cancelButtonText: "Cancelar",
            inputValidator: (value) => {
                if (!value) {
                    return 'Você precisa inserir sua senha!';
                }
            }
        });

        if (!passwordConfirm.value) {
            Swal.fire("Operação Cancelada", "A exclusão da conta foi cancelada.", "info");
            return;
        }

        //console.log("📡 API URL carregada:", import.meta.env.VITE_API_URL);
        
        // Enviando a solicitação para o backend com a senha para validação
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${user.id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: passwordConfirm.value }) // Enviando senha para confirmação
        });

        if (!response.ok) {
            const errorMsg = await response.text();
            throw new Error(`Erro ao excluir conta: ${errorMsg}`);
        }

        sessionStorage.removeItem("user"); // Remover usuário do armazenamento local
        navigate("/"); // Redirecionar para a página inicial

        toast.success("Sua conta foi excluída com sucesso!");

    } catch (error) {
        console.error("❌ Erro ao excluir conta:", error);
        toast.error("Erro ao excluir a conta. Verifique sua senha e tente novamente.", {
            duration: 4000,
            style: { backgroundColor: "#F21B3F", color: "#fff" }
        });
    }
};


  const handleLogout = async () => {
    try {
      // Deslogar do Firebase
      await signOut(auth);

      // Remover o usuário do sessionStorage
      sessionStorage.removeItem('user');

      // Definir o estado do usuário como vazio
      setUser({});

      // Log para verificar o estado atual de 'user'
      console.log("Logout realizado com sucesso. Estado atual do usuário:", storedUser);

      // Redirecionar para a página inicial
      navigate("/");
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  };

  if (!user) {
    return <p>Carregando...</p>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>
          <a href="/ua">Lovelace</a>
        </h1>
        <div className={styles.userInfo}>
          {user ? (
            <>
              <p>{user.name}</p>
              <div>
                <img
                  src={user.profileImage || "/defaultProfile.png"}
                  alt="Avatar do usuário"
                  className={styles.userImage}
                />
              </div>
            </>
          ) : (
            <p>loading...</p>
          )}
        </div>
      </header>
      <div className={styles.userProfile}>
        <div className={styles.profileHeader}>
          <div
            className={styles.profileImgContainer}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={toggleModal}
          >
            <img
              src={user.profileImage}
              alt="User  profile"
              className={styles.profileImg}
            />
            {showTooltip && (
              <div className={styles.tooltip}>Clique para alterar a foto</div>
            )}
          </div>
          <h2>{user.name}</h2>
        </div>
        <div className={styles.profileDetails}>
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleInputChange}
          />

          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleInputChange}
          />

          <label htmlFor="bio">Biografia</label>
          <textarea
            name="bio"
            value={user.bio}
            onChange={handleInputChange}
            placeholder="Biografia"
          />
          <label htmlFor="password">Alterar senha</label>
          <input
            type="password"
            name="password"
            value={newPassword}
            onChange={handlePasswordChange}
            placeholder="Sua nova senha"
          />

          <label htmlFor="confirmPassword">Confirmação a senha</label>
          <input
            type="password"
            name="confirmPassword"
            value={newPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="Confirme sua nova senha"
          />

          {errorMessage && (
            <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>
          )}
          {successMessage && (
            <p style={{ color: "green", textAlign: "center" }}>
              {successMessage}
            </p>
          )}

          <button onClick={saveChanges}>Salvar Alterações</button>
          <button onClick={handleLogout}>Desconectar</button>
          <button onClick={deleteUserAccount}>Excluir Conta</button>
        </div>

        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3>Alterar Foto de Perfil</h3>

              <label>
                Alterar por URL:
                <input
                  type="text"
                  value={imageType === "url" ? newImage : ""}
                  onChange={handleUrlChange}
                />
              </label>

              <label>
                Alterar por Arquivo:
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>

              <div>
                <button className={styles.closeModalButton} onClick={saveImage}>
                  Salvar Alterações
                </button>
                <button
                  className={styles.closeModalButton}
                  onClick={toggleModal}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
