/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TextArea from '../components/TextArea';
import QuestionBox from '../components/QuestionBox';
import styles from './FormActivity.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import Swal from "sweetalert2";
import { sonnerLoad, sonnerSuccess, sonnerError } from "../../services/alert_toast"; // Importando os Sonners

// Função para gerar código de acesso aleatório
function generateAccessCode(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function FormActivity({ activity = null }) {
    const navigate = useNavigate();

    // Obter o usuário logado do localStorage
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // Estado para armazenar atividade
    const [activities, setActivities] = useState({
        name: activity?.name || "",
        description: activity?.description || "",
        accessCode: activity?.access_code || generateAccessCode(),
        questions: activity?.questions || [],
    });

    // Atualizar os campos da atividade
    const handleChange = (e) => {
        setActivities({
            ...activities,
            [e.target.name]: e.target.value
        });
    };

    // Adicionar nova pergunta à atividade
    const addQuestion = () => {
        setActivities({
            ...activities,
            questions: [...activities.questions, { id: Date.now(), text: '' }]
        });
    };

    // Atualizar conteúdo das perguntas
    const handleQuestionChange = (id, field, value) => {
        const updatedQuestions = activities.questions.map(question => {
            if (question.id === id) {
                return { ...question, [field]: value };
            }
            return question;
        });
        setActivities({ ...activities, questions: updatedQuestions });
    };

    // Remover pergunta da atividade
    const removeQuestion = (id) => {
        const updatedQuestions = activities.questions.filter(question => question.id !== id);
        setActivities({ ...activities, questions: updatedQuestions });
    };

    // Enviar atividade para o backend (Criar/Editar)
    const submit = async (e) => {
        e.preventDefault();
        
        if (!user) {
            console.error("Usuário não autenticado.");
            return;
        }
    
        const updatedActivity = {
            name: activities.name,
            description: activities.description,
            access_code: activities.accessCode, 
            user_id: user.id,
            questions: activities.questions
        };
    
        const method = activity ? 'PUT' : 'POST';
        const url = activity
            ? `${import.meta.env.VITE_API_URL}/activities/${activity.id}`
            : `${import.meta.env.VITE_API_URL}/activities`;
    
        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedActivity),
            });
    
            const responseData = await response.json();
            
            // Debugging no console para ver a resposta real
            console.log("🛠️ Resposta da API:", responseData);
    
            if (!response.ok) {
                throw new Error(responseData.error || "Erro ao criar/editar a atividade.");
            }
    
            if (!responseData.activity || !responseData.activity.id) {
                throw new Error("A resposta do servidor não contém a atividade esperada.");
            }
    
            // ✅ Agora a navegação só ocorre se a resposta estiver correta
            navigate(`/a/${responseData.activity.id}`);
    
        } catch (error) {
            console.error('❌ Erro ao criar/editar a atividade:', error.message);
        }
    };
    
    

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={submit}>
                <header className={styles.header}>
                    <h1><a href="/ua">Lovelace</a></h1>
                    <p>{activity ? "Editar Atividade" : "Criar Atividade"}</p>
                    <button type='submit'>{activity ? "Salvar" : "Criar"}</button>
                </header>
                <div className={styles.headerForm}>
                    <TextArea
                        name="name"
                        placeholder="Nome da Atividade"
                        value={activities.name}
                        handleOnChange={handleChange}
                        required="required"
                    />
                    <TextArea
                        name="description"
                        placeholder="Descrição"
                        value={activities.description}
                        handleOnChange={handleChange}
                        required="required"
                    />
                    <p><strong>Código de Acesso:</strong> {activities.accessCode}</p>
                </div>
                <button className={styles.plus} type="button" onClick={addQuestion}>
                    <FontAwesomeIcon className={styles.plus_svg} icon={faPlus} />
                </button>
                <div className={styles.container_question}>
                    {activities.questions.length > 0 && activities.questions.map((question) => (
                        <QuestionBox
                            key={question.id}
                            id={question.id}
                            text={question.text}
                            handleQuestionChange={handleQuestionChange}
                            handleRemove={removeQuestion}
                        />
                    ))}
                </div>
            </form>
        </div>
    );
}

export default FormActivity;
