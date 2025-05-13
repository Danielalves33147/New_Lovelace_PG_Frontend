import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ActivitySection.module.css';
import Dictionary from './Dictionary';
import Swal from "sweetalert2";
import { toast } from 'sonner';
import jsPDFInvoiceTemplate, { OutputType } from 'jspdf-invoice-template';

const ActivitySection = () => {
    const [accessCodePDF, setAccessCodePDF] = useState('');
    const [accessCode, setAccessCode] = useState('');
    const [inputVisible, setInputVisible] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleAccessActivity = async (e) => {
        e.preventDefault();
    
        if (!inputVisible) {
            setInputVisible(true);
            setError(null);
            setTimeout(() => {
                setInputVisible(false);
                setAccessCode('');
            }, 7000);
        } else if (accessCode.trim()) {
            try {
                console.log("API URL carregada:", import.meta.env.VITE_API_URL);
    
                const apiUrl = import.meta.env.VITE_API_URL.replace(/\/$/, ''); // Remove barra final, se houver
                const response = await fetch(`${apiUrl}/activities/access/${accessCode}`);
    
                if (!response.ok) {
                    throw new Error("Atividade não encontrada.");
                }
    
                const data = await response.json();
                if (!data.id) {
                    throw new Error("ID da atividade não recebido.");
                }
    
                navigate(`/aA/${data.id}`);
            } catch (err) {
                console.error("Erro ao acessar a atividade:", err);
                setError('Erro ao acessar a atividade.');
            }
        } else {
            setError('Por favor, insira um código de acesso.');
        }
    };
    

    function pratica() {
        Swal.fire({
            title: 'Iniciar Atividades?',
            text: "Uma atividade onde o tempo influencia na pontuação.",
            icon: 'warning',
            iconColor: '#F21B3F',
            background: 'white',
            showCancelButton: false,
            confirmButtonColor: '#F21B3F',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Iniciar',
        }).then((result) => {
            if (result.isConfirmed) {
                navigate('/prt');
            }
        });
    }

    const generateActivityPDF = async (activityAccessCode) => {
        toast.promise(
            new Promise(async (resolve, reject) => {
                try {
                    const apiUrl = import.meta.env.VITE_API_URL.replace(/\/$/, ''); // Remove barra final extra
                    console.log("API URL carregada:", apiUrl);
    
                    // Buscar atividade pelo código de acesso
                    const activityResponse = await fetch(`${apiUrl}/activities/access/${activityAccessCode}`);
                    if (!activityResponse.ok) return reject("Atividade não encontrada.");
                    const activity = await activityResponse.json();
                    if (!activity.id) return reject("ID da atividade não encontrado.");
    
                    console.log("🔹 Atividade carregada:", activity);
    
                    // Buscar respostas associadas
                    const responsesResponse = await fetch(`${apiUrl}/responses/activity/${activity.id}`);
                    if (!responsesResponse.ok) return reject("Erro ao buscar respostas.");
                    const responses = await responsesResponse.json();
    
                    console.log("📥 Respostas carregadas:", responses);
    
                    const hasResponses = responses.length > 0;
    
                    // Formatando respostas corretamente
                    const formattedResponses = hasResponses
                        ? responses.map((response) => [
                            response.user_name || "Usuário desconhecido",
                            response.answers?.length ? response.answers.join(", ") : "Sem respostas",
                            response.date ? new Date(response.date).toLocaleDateString() : "-",
                            response.date ? new Date(response.date).toLocaleTimeString() : "-"
                        ])
                        : [["Nenhuma resposta disponível", "-", "-", "-"]];
    
                    // Buscar usuário criador da atividade
                    const userResponse = await fetch(`${apiUrl}/users/${activity.user_id}`);
                    if (!userResponse.ok) return reject("Erro ao buscar criador da atividade.");
                    const user = await userResponse.json();
    
                    console.log("👤 Criador da atividade:", user);
    
                    // Gerar PDF
                    const currentDate = new Date();
                    const formattedDate = currentDate.toLocaleDateString();
                    const formattedTime = currentDate.toLocaleTimeString();
    
                    const props = {
                        outputType: OutputType.DataUriString,
                        returnJsPDFDocObject: true,
                        fileName: "Activity_Response",
                        orientationLandscape: false,
                        logo: {
                            src: "https://raw.githubusercontent.com/Danielalves33147/Imagens/main/TOKEN(4).png",
                            type: 'PNG',
                            width: 50,
                            height: 20
                        },
                        business: {
                            name: "Lovelace - English Learning",
                            address: "Camaçari / Bahia / Brasil",
                            phone: "Plataforma desenvolvida em 2023",
                            email: "suporte@lovelace.com",
                        },
                        contact: {
                            label: `Responsável: ${user.name || "Desconhecido"}`,
                        },
                        invoice: {
                            label: "Código de Acesso: ",
                            num: `${activity.access_code}`,
                            invDate: `Data de Impressão: ${formattedDate}`,
                            invGenDate: `Horário: ${formattedTime}`,
                            header: [
                                { title: "Aluno(a)", style: { width: 50 } },
                                { title: "Respostas", style: { width: 100 } },
                                { title: "Data", style: { width: 25 } },
                                { title: "Hora", style: { width: 25 } }
                            ],
                            table: formattedResponses,
                            tableStyles: {
                                cellPadding: 10,
                                padding: { top: 10, bottom: 10 },
                            },
                        },
                        footer: {
                            text: "Lovelace Copyright 2024.",
                        },
                        pageEnable: true,
                    };
    
                    const pdfObject = jsPDFInvoiceTemplate(props);
                    const pdfDataUri = pdfObject.dataUriString;
    
                    // Criar uma nova aba para exibir o PDF
                    const newWindow = window.open();
                    newWindow.document.open();
                    newWindow.document.write(`<iframe width='100%' height='100%' src='${pdfDataUri}'></iframe>`);
                    newWindow.document.close();
    
                    resolve("PDF gerado com sucesso!");
                } catch (error) {
                    console.error("🚨 Erro ao gerar PDF:", error);
                    reject("Erro ao gerar o PDF.");
                }
            }),
            {
                loading: "Gerando PDF... Aguarde",
                success: "PDF gerado com sucesso!",
                error: "Erro ao gerar PDF."
            }
        );
    };
    

    return (
        <section className={styles.activitySection}>
            <section className={styles.predefinedActivities}>
                <h2>Prática</h2>
                <p>Experimente atividades pré-estabelecidas para aprimorar suas habilidades.</p>
                <button onClick={pratica}><a>Go ahead</a></button>
            </section>

            <section className={styles.customActivity}>
                <h2>Atividade Personalizada</h2>
                <p>Crie suas próprias atividades adaptadas aos seus objetivos.</p>
                <button>
                    <a href="/ce">Criar</a>
                </button>
            </section>

            <section className={styles.findActivity}>
                <h2>Gerar Documento PDF</h2>
                <p> Gere um relatório PDF com os estudantes que responderam sua atividade.</p>
                <input
                    type="text"
                    placeholder="Insira o Código de Acesso"
                    value={accessCode}
                    onChange={(e) => setAccessCodePDF(e.target.value)}
                />
                <button onClick={() => generateActivityPDF(accessCodePDF)}>Criar</button>
            </section>

            <section className={styles.accessActivity}>
                <h2>Acessar Atividade</h2>
                <p>Insira um código de acesso para desbloquear uma atividade.</p>
                <form onSubmit={handleAccessActivity}>
                    {inputVisible && (
                        <input
                            type="text"
                            placeholder="Código de Acesso"
                            value={accessCode}
                            onChange={(e) => setAccessCode(e.target.value)}
                            required
                        />
                    )}
                    <button type="submit">
                        {inputVisible ? 'Acessar' : 'Código'}
                    </button>
                </form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </section>

            <Dictionary />
        </section>
    );
};

export default ActivitySection;
