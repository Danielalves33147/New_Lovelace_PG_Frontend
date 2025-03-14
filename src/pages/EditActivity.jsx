import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FormActivity from './FormActivity';

function EditActivity() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activity, setActivity] = useState(null);
    const [user, setUser] = useState(() => {
        const storedUser = sessionStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                console.log("API URL carregada:", import.meta.env.VITE_API_URL);
                const response = await fetch(`${import.meta.env.VITE_API_URL}/activities/id/${id}`);
                if (!response.ok) throw new Error("Atividade não encontrada.");
                const data = await response.json();

                // Verifica se o usuário logado é o criador da atividade
                if (user && user.id !== data.user_id) {
                    alert("Você não tem permissão para editar esta atividade.");
                    navigate("/ua"); // Redireciona para a área do usuário
                } else {
                    setActivity(data);
                }
            } catch (err) {
                console.error(err);
                navigate("/ua");
            }
        };

        fetchActivity();
    }, [id, user, navigate]);

    return (
        <>
            {activity ? <FormActivity activity={activity} /> : <p>Carregando atividade...</p>}
        </>
    );
}

export default EditActivity;
