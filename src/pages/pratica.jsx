import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import styles from './pratica.module.css'

import jsPDFInvoiceTemplate, { OutputType } from 'jspdf-invoice-template';
import { useUser } from '../../services/UserContext.jsx';  // Importar o contexto de usuário

import { ainda_nao } from "../../services/alert.js";

export default function Practice() {
  const navigate = useNavigate();
  const [practiceText, setPracticeText] = useState([]);
  const [currentText, setCurrentText] = useState("");
  const [currentTitle, setCurrentTitle] = useState(""); // Novo estado para o título
  const [timer, setTimer] = useState(0);
  const [timerStatus, setTimerStatus] = useState('stop');
  const [score, setScore] = useState(0);
  const [rank, setRank] = useState('');
  const [answers, setAnswers] = useState("");  // Novo estado para armazenar as respostas
  const timerRef = useRef(null);
  const inputRef = useRef(null);
  const { userName, userId } = useUser();  // Acessar o nome do usuário pelo contexto

  const currentDate = new Date();
  const invoiceDate = currentDate.toLocaleDateString();
  const invoiceTime = currentDate.toLocaleTimeString(); 


  function generateInvoicePDF({ clientAddress, clientPhone, clientEmail, invoiceNum, activityName, score, level, timeSpent, answers, userId }) {
    console.log("User ID:", userId);  // Adicione isso para depuração
    const props = {
        outputType: OutputType.DataUriString,
        onJsPDFDocCreation: (jsPDFDoc) => { /* Função de configuração adicional */ },
        returnJsPDFDocObject: true,
        fileName: "Invoice 2021",
        orientationLandscape: false,
        compress: true,
        logo: {
            src: "https://raw.githubusercontent.com/Danielalves33147/Imagens/main/TOKEN(4).png",
            type: 'PNG',
            width: 53.33,
            height: 26.66,
            margin: { top: 0, left: 0 }
        },
        business: {
            name: "A tool for english learning",
            address: "Camaçari / Bahia / Brasil",
            phone: "Plataforma desenvolvida em 2023",
            email: "suporte@lovelace.com",
            email_1: "contato@lovelace.com",
            website: "www.lovelace.com",
        },
        contact: {
            label: `Aluno(a) : ${userName}`,  // Usando o nome do usuário aqui
            name: clientAddress,
            address: clientAddress,
            phone: clientPhone,
            email: clientEmail,
        },
        invoice: {
            label: "Invoice #: ",
            num: invoiceNum,
            invDate: `Data: ${invoiceDate}`,
            invGenDate: `Hora: ${invoiceTime}`,
            header: [
                { title: "#", style: { width: 10 } },
                { title: "Titulo", style: { width: 50 } },
                { title: "Respostas", style: { width: 50 } },  // Coluna para Respostas
                { title: "Tempo", style: { width: 18 } },
                { title: "Score", style: { width: 18 } },
                { title: "Nivel", style: { width: 18 } },
                { title: "ID", style: { width: 18 } }
            ],
            table: [
                [
                    1,
                    activityName || "Título",
                    answers || "Sem resposta",  // Aqui as respostas do aluno são incluídas
                    timeSpent || 0,
                    score || 0,
                    level || "N/A",
                    userId || "ID Local"
                ],
                ...Array.from(Array(0), () => Array(7).fill("")) // Linhas adicionais (vazias)
            ],
        },
        footer: {
            text: "Lovelace Copyright 2024.",
        },
        pageEnable: true,
        pageLabel: "",
    };

    const pdfObject = jsPDFInvoiceTemplate(props);
    const pdfDataUri = pdfObject.dataUriString;
    const newWindow = window.open();
    newWindow.document.open();
    newWindow.document.write(`<iframe width='100%' height='100%' src='${pdfDataUri}'></iframe>`);
    newWindow.document.close();
    console.log("CRIADO ", pdfObject);
  }

  function dontSavePdf() {
    const resContainer = document.getElementById("resultContainer");
    resContainer.style.display="none";
  
    Swal.fire({
        title: 'Resultado não salvo!',
        text: 'Você decidiu não salvar o PDF.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: "#F21B3F",
        iconColor : "#F21B3F",
        confirmButtonText: 'Proximo texto.',
        cancelButtonText: 'Pagina Inicial!'
    }).then((result) => {
        if (result.isConfirmed) {
            // Se o usuário quiser continuar, recarregue a página
            window.location.reload(); // Recarregar a página
        } else {
            // Caso contrário, navegue para a página inicial
            navigate('/ua');
        }
    });
  } 

  function savePdf() {
    generateInvoicePDF({
      activityName: currentTitle || "Título", // Usa o título armazenado
      score: Math.round(score),
      level: rank,
      timeSpent: new Date(timer * 1000).toISOString().substr(11, 8),
      answers: answers,  // Passando as respostas para a função
      userId: userId 
    });
  }

  useEffect(() => {
    fetch('/content.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao carregar o JSON');
        }
        return response.json();
      })
      .then(data => {
        if (data && data.texts && data.texts.length > 0) {
          setPracticeText(data.texts);
          changeText(data.texts);
        }
      })
      .catch(error => console.error('Erro ao carregar o JSON:', error));
  }, []);

  useEffect(() => {
    let interval;
    if (timerStatus === 'play') {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else if (timerStatus === 'stop' && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerStatus, timer]);

  function start() {
    setTimerStatus('play');
  }

  function stop() {
    setTimerStatus('stop');
  }

  function clearTimer() {
    setTimer(0);
  }

  function changeText(texts) {
    stop();
    clearTimer();
    const randomIndex = Math.floor(Math.random() * texts.length);
    setCurrentText(texts[randomIndex].paragraph);
    setCurrentTitle(texts[randomIndex].textTitle); // Atualiza o título do texto atual
    start();
  }

  function testShow() {
    const resultContainer = document.getElementById("resultContainer");
    resultContainer.classList.toggle("show"); // Alternar a classe para testar
  }

  function sendAnswers() {
    stop();
    const answerContainer = inputRef.current.value.toLowerCase();

    if (!answerContainer) {
      Swal.fire({
        text: 'Preencha todos os Campos',
        title: 'Opa!!',
        icon: 'warning',
        background: 'white',
        iconColor: '#F21B3F'
      });
      return;
    }

    // Armazena as respostas do aluno
    setAnswers(answerContainer);
    calc(answerContainer);
    
    const resultContainer = document.getElementById("resultContainer");
    if (resultContainer) {
      resultContainer.style.display = "flex";
    }
  }

  function calc(answer) {
    
    const minTime = 75;
    let sec = timer;
    const respostas = [
      ["dia", "gostos", "autor"],
      ["viagem", "ferias", "frança", "visitas", "turísticos"],
      ["vida", "importância", "familia"],
      ["importância", "seus", "sonhos", "paixões"],
      ["Sempre", "enfrentar", "seus", "medos"],
      ["importante", "equilíbrio", "paixões", "felicidade", "interesses"],
      ["facilidade", "instalação", "versatilidade", "VS Code", "código"],
      ["contribuições", "positivas", "preocupações", "negativas", "equilíbrio"],
      ["importancia", "programação", "habilidade", "crucial"],
      ["Avanços", "tecnologicos", "Elon Musk"],
      ["Ponteiros", "C", "acessar", "manipular", "dados", "memória"],
      ["Como", "funciona", "banco de dados"],
      ["O que", "é", "eletromecanica"],
      ["O que", "é", "como", "funciona", "CHATGPT"],
      ["O que", "é", "como", "funciona", "CHATGPT"],
      ["O que", "é", "como", "funciona", "CHATGPT"]
    ];

    const currentTextIndex = practiceText.findIndex(text => text.paragraph === currentText);
    if (currentTextIndex === -1) return;

    const palavrasChave = respostas[currentTextIndex] || [];
    let palavra_acertada = 0;

    palavrasChave.forEach(palavra => {
      if (answer.includes(palavra)) {
        palavra_acertada++;
      }
    });

    const pontosPorPalavra = 100 / palavrasChave.length;
    const acertos = pontosPorPalavra * palavra_acertada;
    let decress = 0;

    if (sec > minTime) {
      const deCont = sec - minTime;
      decress = (deCont / 30) * 10;
    }

    let finalScore = acertos - decress;
    if (finalScore < 0) {
      finalScore = 0; // Define a pontuação mínima como zero
    }
    setScore(finalScore);

    if (finalScore <= 0) {
      setRank("Bad");
    } else if (finalScore <= 34) {
      setRank("Beginner");
    } else if (finalScore <= 68) {
      setRank("Intermediary");
    } else {
      setRank("Advanced");
    }
    console.log("PONTUAÇÃO",finalScore);
    
  }

  return (
    <div>
        <header className={styles.loveLog}>
          <img src="https://raw.githubusercontent.com/Danielalves33147/Imagens/main/TOKEN(4).png" alt="Lovelace Logo" className={styles.logoImage}/>
        </header>
      <div className={styles.temporizador}>
        <h3 className={styles.timer}>{new Date(timer * 1000).toISOString().substr(11, 8)}</h3>
      </div>
      <section className={styles.textContainer}>
        <div className={styles.containerContent}>
          <p>{currentText}</p>
        </div>
        <input id="submitAnswer" className={styles.submitAnswer} type="text" ref={inputRef} placeholder="As palavras chave do texto são..." required />
        <div className={styles.answerButtons}>
          <button className={styles.sendAnswer} onClick={sendAnswers}>Enviar resposta</button >  
          <button className={styles.changeText} onClick={() => changeText(practiceText)}>Mudar texto</button>
        </div>
      </section>
      <footer>
        <p>Desenvolvido por <span>Daniel de Santana</span>,<span> Marcos Emanuel </span> e <span> Melkysedeke Costa</span>.</p>
        <span className={styles.divider}></span>
        <p>Orientado pela <span>Prof. Dr. Lenade Barreto</span>.</p>
      </footer>
      <section id="resultContainer" className={`${styles.resultContainer}`}>
        <div className={styles.modal}> 
          <h1>Resultado</h1>
          <div className={styles.scoreContainer}>
            <h2 className={styles.scoreTitle}><span className={styles.score}>{Math.round(score)}</span>/100</h2>
          </div>
          <p className={styles.usuario}>Usuario: <span className={styles.login}>admin</span></p>
          <p className={styles.modalParagraph}>Seu nível: <span className={styles.level}>{rank}</span></p>
          <p className={styles.Text}>Texto Lido: <span className={styles.txt}>{practiceText.find(text => text.paragraph === currentText)?.textTitle}</span></p>
          <p className={styles.temp}>Tempo: <span className={styles.time}>{new Date(timer * 1000).toISOString().substr(11, 8)}</span></p>
      
          <p className={styles.paragraphmodal}>Deseja salvar o resultado em um PDF?</p>
          <div className={styles.resultButtons}>
            <button className={styles.save} onClick={savePdf}>Quero!</button>
            <button className={styles.dontSavePdf} onClick={dontSavePdf}>Não quero</button>
          </div>
        </div>
      </section>
    </div>
  );
}