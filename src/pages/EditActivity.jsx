import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FormActivity from './FormActivity';

function EditActivity() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activity, setActivity] = useState(null);
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                // Garante que a API URL está corretamente definida
                const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
                if (!apiUrl) {
                    console.error("⚠️ Erro: VITE_API_URL não foi definido.");
                    return;
                }
    
                console.log("📡 API URL carregada:", apiUrl);
    
                const response = await fetch(`${apiUrl}/activities/id/${id}`);
                if (!response.ok) throw new Error("Atividade não encontrada.");
    
                const data = await response.json();
    
                // Aguarda a definição do usuário antes de verificar permissões
                if (!user) return;
    
                // 🔹 Verifica se o usuário logado é o criador da atividade
                if (user.id !== data.user_id) {
                    alert("🚫 Você não tem permissão para editar esta atividade.");
                    navigate("/ua"); // 🔄 Redireciona para a área do usuário
                    return;
                }
    
                setActivity(data);
            } catch (err) {
                console.error("❌ Erro ao buscar atividade:", err);
                navigate("/ua"); // 🔄 Redireciona em caso de erro
            }
        };
    
        if (user) {
            fetchActivity();
        }
    }, [id, user, navigate]);
    

    return (
        <>
            {activity ? <FormActivity activity={activity} /> : <p>Carregando atividade...</p>}
        </>
    );
}

export default EditActivity;
