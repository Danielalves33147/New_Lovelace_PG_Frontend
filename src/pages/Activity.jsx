import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faCheck, faEdit } from '@fortawesome/free-solid-svg-icons';
import styles from './Activity.module.css';

function Activity() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activity, setActivity] = useState(null);
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [iconChanged, setIconChanged] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Obter usuário logado do sessionStorage
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("🚨 Erro ao analisar JSON do usuário:", error);
            }
        }
    
        // Garantir que a URL da API esteja definida corretamente
        const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
        if (!apiUrl) {
            console.error("⚠️ Erro: VITE_API_URL não foi definido.");
            return;
        }
    
        console.log("📡 API URL carregada:", apiUrl);
    
        fetch(`${apiUrl}/activities/id/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro ao buscar atividade: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data) {
                    setActivity(data);
                } else {
                    console.warn("⚠️ Atividade não encontrada na resposta da API.");
                }
            })
            .catch(error => {
                console.error("❌ Erro ao carregar atividade:", error);
            });
    }, [id]);
    

    const copiarCodigo = () => {
        const codigoElement = document.getElementById('codigo');
        const codigoTexto = codigoElement.innerText;

        navigator.clipboard.writeText(codigoTexto)
            .then(() => {
                setTooltipVisible(true);
                setIconChanged(true);

                setTimeout(() => {
                    setTooltipVisible(false);
                    setIconChanged(false);
                }, 2000);
            })
            .catch((err) => console.error('Erro ao copiar código:', err));
    };

    if (!activity) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1><a href="/">Lovelace</a></h1>
            </header>
            <div className={styles.card}>
                <h1>{activity.name}</h1>
                <h2>{activity.description}</h2>
                <div className={styles.code_box}>
                    <div className={styles.code_text}>
                        <h3>Código de Acesso: <span id='codigo'>{activity.access_code}</span></h3>
                        <h3>ID da Atividade: <span>{activity.id}</span></h3>
                    </div>
                    <button onClick={copiarCodigo} className={styles.copyButton}>
                        <FontAwesomeIcon 
                            className={styles.copy} 
                            icon={iconChanged ? faCheck : faCopy} 
                        />
                        {tooltipVisible && (
                            <span className={`${styles.tooltip} ${styles.tooltipVisible}`}>
                                Código copiado!
                            </span>
                        )}
                    </button>
                </div>
                <ul>
                    {activity.questions.map((question) => (
                        <li key={question.id}>
                            <pre>{question.text}</pre>
                        </li>
                    ))}
                </ul>
                
                {/* Mostrar botão de edição apenas se o usuário for o criador da atividade */}
                {user && user.id === activity.user_id && (
                    <button 
                        className={styles.editButton} 
                        onClick={() => navigate(`/eA/${activity.id}`)}
                    >
                        <FontAwesomeIcon icon={faEdit} /> Editar Atividade
                    </button>
                )}
            </div>
        </div>
    );
}

export default Activity;
