import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import styles from './ActivityResponses.module.css';

function ActivityResponses() {
    const { id } = useParams();
    const [activity, setActivity] = useState(null);
    const [responses, setResponses] = useState([]);
    const [user, setUser ] = useState(null);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const storedUser  = JSON.parse(sessionStorage.getItem('user'));
            if (storedUser ) {
                setUser (storedUser );
            } else {
                navigate("/");
            }
        } catch (error) {
            console.error("Erro ao analisar o usuário do sessionStorage:", error);
            navigate("/");
        }
    }, [navigate]);

    useEffect(() => {
        // Garante que a API URL está definida corretamente
        const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
        if (!apiUrl) {
            console.error("⚠️ Erro: VITE_API_URL não foi definido.");
            return;
        }
    
        console.log("📡 API URL carregada:", apiUrl);
    
        const fetchActivityData = async () => {
            try {
                // Fetch da atividade
                const activityResponse = await fetch(`${apiUrl}/activities/${id}`);
                if (!activityResponse.ok) throw new Error(`Erro ao buscar atividade: ${activityResponse.status}`);
                const activityData = await activityResponse.json();
                setActivity(activityData);
    
                // Fetch das respostas da atividade
                const responsesResponse = await fetch(`${apiUrl}/responses?activityId=${id}`);
                if (!responsesResponse.ok) throw new Error(`Erro ao buscar respostas: ${responsesResponse.status}`);
                const responsesData = await responsesResponse.json();
                setResponses(responsesData);
    
            } catch (err) {
                console.error("❌ Erro ao buscar dados da atividade:", err);
            }
        };
    
        fetchActivityData();
        const intervalId = setInterval(fetchActivityData, 5000);
    
        return () => clearInterval(intervalId);
    }, [id]);
    

    if (!activity) {
        return <div>Carregando atividade...</div>;
    }

    const toggleExpand = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 onClick={handleGoBack}>Lovelace</h1>
                <div className={styles.userInfo}>
                    {user ? (
                        <>
                            <p>{user.name}</p>
                            <div>
                                <img 
                                    src={user.profileImage || '/defaultProfile.png'} 
                                    alt="Avatar do usuário" 
                                    className={styles.userImage} 
                                />
                            </div>
                        </>
                    ) : (
                        <p></p>
                    )}
                </div>
            </header>
            <h1>Respostas para: {activity.name}</h1>
            <p>{activity.description}</p>
            <div className={styles.responsesSection}>
                {responses.length > 0 ? (
                    responses.map((response, index) => (
                        <div key={response.id} className={styles.responseCard} onClick={() => toggleExpand(index)} style={{ cursor: 'pointer' }}>
                            <h3>
                                Resposta {index + 1} por {response.user}:
                            </h3>
                            <p className={styles.date}>Data: {new Date(response.date).toLocaleDateString()}</p>
                            <FontAwesomeIcon className={styles.chevron} icon={expandedIndex === index ? faChevronUp : faChevronDown} />
                            {expandedIndex === index && ( 
                                <div className={styles.answers}>
                                    {activity.questions.map((question, i) => (
                                        <div key={question.id} className={styles.questionBlock}>
                                            <p className={styles.question}><strong>{i + 1}. {question.text}</strong></p>
                                            <p className={styles.answer}>{response.answers[i]?.text || 'Sem resposta'}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>Nenhuma resposta foi enviada ainda.</p>
                )}
            </div>
        </div>
    );
}

export default ActivityResponses;