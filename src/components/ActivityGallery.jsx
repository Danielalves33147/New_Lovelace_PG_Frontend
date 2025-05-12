import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ActivityGallery.module.css';
import { toast } from 'sonner';
import Swal from "sweetalert2";

function ActivityGallery() {
    const [activities, setActivities] = useState([]);
    const [storedUser, setStoredUser] = useState(null);

    const apiUrl = import.meta.env.VITE_API_URL.startsWith("http")
        ? import.meta.env.VITE_API_URL
        : `https://${import.meta.env.VITE_API_URL}`;

        useEffect(() => {
            let isMounted = true;
        
            const storedUserString = localStorage.getItem("user");
        
            if (storedUserString) {
                const parsedUser = JSON.parse(storedUserString);
                setStoredUser(parsedUser);
                console.log("🧪 Usuário logado (parsedUser):", parsedUser);
        
                const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
                fetch(`${apiUrl}/activities?userId=${parsedUser.id}`)
                    .then(resp => resp.json())
                    .then(data => {
                        if (isMounted) {
                            setActivities(Array.isArray(data) ? data : []);
                        }
                    })
                    .catch(err => console.error("Erro ao carregar atividades:", err));
            }
        
            return () => {
                isMounted = false;
            };
        }, []);
        
        

    const deleteActivity = async (activityId) => {
        if (!storedUser) {
            toast.error("Usuário não autenticado.");
            return;
        }

        const { value: confirmationText } = await Swal.fire({
            title: "Tem certeza?",
            text: "Uma vez deletada, é impossivel recupera-la, se entender isso confirme escrevendo 'Entendo o que estou fazendo'",
            input: "text",
            inputPlaceholder: "Digite aqui...",
            showCancelButton: true,
            confirmButtonColor: "#f21b3f",
            cancelButtonColor: "#aaa",
            confirmButtonText: "Excluir",
            cancelButtonText: "Cancelar",
            icon: "warning",
        });

        if (confirmationText !== "Entendo o que estou fazendo") {
            toast.warning("Exclusão cancelada.");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/activities/${activityId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: storedUser.id }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Erro ao excluir atividade.");
            }

            toast.success("Atividade excluída com sucesso!");
            setActivities(activities.filter(activity => activity.id !== activityId));

        } catch (error) {
            toast.error("Erro ao excluir atividade: " + error.message);
        }
    };

    return (
        <section className={styles.gallery}>
            <div className={styles.galleryContainer}>
                {activities.length > 0 ? (
                    activities.map(activity => (
                        <div key={activity.id} className={styles.activityCard}>
                            <h2>{activity.name}</h2>
                            <div className={styles.links}>
                                <p>{activity.created_at ? new Date(activity.created_at).toLocaleDateString('pt-BR') : "Data não disponível"}</p>
                                <div>
                                    <Link to={`/eA/${activity.id}`} className={styles.linkButton}>Acompanhar</Link>
                                    {storedUser?.id === activity.user_id && (
                                        <button onClick={() => deleteActivity(activity.id)} className={styles.deleteButton}>
                                            Deletar
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Você ainda não criou nenhuma atividade.</p>
                )}
            </div>
        </section>
    );
}

export default ActivityGallery;
