"use strict"
let container = document.getElementById("containerContent")
let pre
let pos
let hours = 0
let minutes = 0
let seconds = 0
let time = 1000 // Quantidade milésimos que um segundo possue
let timer
let timerStatus = "stop"
let practiceText
let sec,deCont,decress,score
let ponto_por_palavra,acertos,resposta


function randomNumber (array){
    return Math.floor(Math.random() * array.length)
}

function start() {
    switch (timerStatus) {
        case "play":
            return
        default:
            timerStatus = "play"
            timer = setInterval(() => {
                timerStart()
            }, time); 
            break
    }
}

function stop() {
    timerStatus = "stop"
    clearInterval(timer)
}

function clearTimer(){
    clearInterval(timer)
    hours = 0
    minutes = 0
    seconds = 0
    document.getElementById('timer').innerText = '00:00:00'
}

function timerStart(){
    seconds++

    if (seconds == 60) {
        seconds = 0
        minutes++

        if (minutes == 60) {
            minutes = 0
            hours++
        }
    }

    let formatTimer = (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds)
    document.getElementById('timer').innerText = formatTimer

    return formatTimer
}

console.log("API URL carregada:", import.meta.env.VITE_API_URL);

// Carregar o JSON
fetch(`${import.meta.env.BASE_URL}content.json`)
  .then(response => response.json()) 
  .then(data => {
    console.log(data)
    practiceText = data.texts

    // Nova Promise para retornar o array
    return new Promise(resolve => {
        resolve()
    })
})
.then(() => {
    changeText(practiceText)
})

function pratica(){
    Swal.fire({
        title: 'Iniciar Atividade?',
        text: "A partir daqui não terá mais volta!",
        icon: 'warning',
        iconColor: '#F21B3F',
        background: 'white',
        showCancelButton: true,
        confirmButtonColor: '#F21B3F',
        border: 'none',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Iniciar'
      }).then((result) => {
        if (result.isConfirmed) {
            location.href="practice.html"
        }
      })
}

function logar(){
    var login = document.getElementById('login').value;
    var senha = document.getElementById('senha').value;

    if(login == "" | senha == ""){
        Swal.fire({
            text: 'Acesso Negado',
            title: 'Preencha todos os Campos',
            icon: 'warning',
            background: 'white',
            iconColor: '#F21B3F'
        })
    }else if(login == "admin" &&  senha == "admin"){  
            Swal.fire({
                text: 'Login Efetuado',
                title: 'Seja bem vindo ao Lovelace!',
                icon: 'success',
                background: 'white',
                iconColor: '#F21B3F'
            })
            .then(() => {
                location.href="index.html";
            })
        }else{
            Swal.fire({
                text: 'Acesso Negado',
                title: 'Usuario ou Senha incorretos!',
                icon: 'error',
                background: 'white',
                iconColor: '#F21B3F'
            })
        }
    }

// FAZER FUNCIONAR
function alerta(){
    Swal.fire({
        title: 'Iniciar Atividade?',
        text: "Um texto diferente e uma reposta diferente!",
        icon: 'warning',
        iconColor: '#F21B3F',
        background: 'white',
        showCancelButton: true,
        confirmButtonColor: '#F21B3F',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Iniciar'
      }).then((result) => {
        if (result.isConfirmed) {
            changeText()
        }else{
            location.href="index.html"
        }
      })
}

function cadLogin(){
    Swal.fire({
        title: 'Novo Usuario?',
        text: "Siga para se cadastrar e ter acesso a plataforma!",
        icon: 'question',
        iconColor: '#F21B3F',
        background: 'white',
        showCancelButton: true,
        confirmButtonColor: '#F21B3F',
        cancelButtonColor: '#d33',
        confirmButtonText: 'SIM'
      }).then((result) => {
        if (result.isConfirmed) {
            location.href="cads.html"


        }
      })
}

function nextText(){

    if (pos <= practiceText.length) {
        console.log("Entrou")
        container.innerHTML = `<p>${practiceText[pos].paragraph}</p>`
        console.log("Posicao do array: " + pos)
        pre = pos
        pos++
        
        if (pos > practiceText.length) {
            pos = 0
            container.innerHTML = `<p>${practiceText[pos].paragraph}</p>`
        }
    } 
    console.log("Segundo console.log: " + pos)
}
// Função para alterar o texto usando Array
function changeText(){
    stop()
    clearTimer()
    start()
    pos = randomNumber(practiceText)
    if (pos <= practiceText.length) {
        console.log("Entrou")
        container.innerHTML = `<p>${practiceText[pos].paragraph}</p>`
        console.log("Posicao do array: " + pos)
        pre = pos
        pos++
        
        if (pos >= practiceText.length) {
            pos = 0
            container.innerHTML = `<p>${practiceText[pos].paragraph}</p>`
        }
    } 
    console.log("Segundo console.log: " + pos)
    answerContainer = document.getElementById("submitAnswer").value= ""

}

function calc(answerContainer){
    
    let palavra_acertada = 0
    let minTime = 75,cont = 0
    let rank
    let resp = [["dia","gostos","autor"],                                               // 0  O dia e os gostos do autor
                ["viagem","ferias","franç","visitas","turísticos"],                     // 1  
                ["vida","importância","familia",],                                      // 2  
                ["importância","seus","sonhos","paixões"],                              // 3
                ["Sempre","enfrentar","seus","medos"],                                  // 4 
                ["importante","equilíbrio","paixões","felicidade","interesses"],        // 5
                ["facilidade","instalação","versatilidade"," VS Code","código"],        // 6
                ["contribuições","positivas","preocupações","negativas","equilíbrio"],  // 7
                ["importancia","programação","habilidade","crucial"],                   // 8
                ["Avanços","tecnologicos","Elon Musk"],                                 // 9
                ["Ponteiros","C","acessar","manipular","dados","memória"],              // 10
                ["Como","funciona","banco de dados",],                                  // 11
                ["O que","é","eletromecanica"],                                         // 12
                ["O que","é","como","funciona","CHATGPT"],                              // 13
                ["O que","é","como","funciona","CHATGPT"],                              // 14
                ["O que","é","como","funciona","CHATGPT"]                               // 15
               ]                          

    let qtd_de_palavras_chave = resp[pre].length
    
    
    switch(answerContainer){

        case "meow":
            score = 1
            rank = "-_-"
            location.href="https://www.youtube.com/watch?v=hvL1339luv0"
            break;

        case "he-man":
            score = 1
            rank = "-_-"
            location.href="https://www.youtube.com/watch?v=ZZ5LpwO-An4"
        break;

        case "leviousa":
            score = 1
            rank = "-_-"
            location.href="https://www.youtube.com/watch?v=reop2bXiNgk"
        break;
            default:

            while(cont <= qtd_de_palavras_chave){
                if(answerContainer.includes(resp[pre][cont])){
                    palavra_acertada ++
                    

                }
                cont++
            }
        
            ponto_por_palavra = 100 / qtd_de_palavras_chave
            acertos = ponto_por_palavra * palavra_acertada
        
            sec = seconds + (60*minutes) + (3600*hours)
        
            if(sec <= minTime){
                score = acertos
            }else{
                deCont = sec - minTime
                decress = (deCont / 30)*10
                score = acertos - decress 
            }
        
            if(score <= 0){
               rank = "Bad"
               score = 0
            }else if(score <= 34){
               rank = "Beginner"
            }else if(score <= 68){
               rank = "Intermediary"
            }else if(score <= 100){
               rank = "Advanced"
            }
            break;
    }

    document.getElementById("score").innerHTML = Math.round(score);
    document.getElementById("level").innerHTML = rank;
    document.getElementById("txt").innerHTML = practiceText[pre].textTitle;
    document.getElementById("time").innerHTML = document.getElementById("timer").innerHTML;
    document.getElementById("login").innerHTML = "admin";
    console.log(palavra_acertada)
}

// Fechar modal e parar o tempo
function sendAnswers() {
    stop()

    let resContainer = document.getElementById("resultContainer")
    let answerContainer = document.getElementById("submitAnswer").value.toLowerCase()

    console.log("CONTAGEM: " + pre)
   
    switch (answerContainer) {
        case "":
            Swal.fire({
                text: 'Preencha todos os Campos',
                title: 'Opa!!',
                icon: 'warning',
                background: 'white',
                iconColor: '#F21B3F'
            })
            console.log("Campo vazio.")
            break;

        default:
                calc(answerContainer)
                stop()
                resContainer.classList.add("show")
                resContainer.addEventListener('click', (e) => {
                    if (e.target.id =='dontSavePdf') {
                        resContainer.classList.remove("show")
                        answerContainer = document.getElementById("submitAnswer").value= ""
                        alerta()
                    }
                })
            
            break;
    }
}

const save=document.getElementById("save")

save.addEventListener("click",(evt)=>{

    let estilo = "<style>"
    estilo += "* {font-family: 'Noto Sans', sans-serif; box-sizing: border-box;font-size: 16px; ;}"

    estilo += ".modal { padding: 72px; display: flex;"
    estilo += "justify-content: center; align-items: center; flex-direction: column; gap: 16px; position: relative;}"

    estilo += "#resultContainer { with: 100%; font: 25px Calibri;}"
    estilo += "resultContainer, th, td {border: solid 2px #888; border-collapse: collapse;"
    estilo += "padding: 4px 8px; text-align: center;}"

    estilo += "#save {display: none;}"
    estilo += "#dontSavePdf {display: none;}"
    estilo += "footer {border-top: 1px solid #141115;}"
    estilo += "footer p span { color: #141115; font-weight: 700;}"
    estilo += ".paragraphmodal{display: none;}"
    estilo += "</style>"

printJS({
    printable: 'resultContainer',
    type: 'html',
    css: 'https://printjs-4de6.kxcdn.com/print.min.css',
    style: estilo,
    documentTitle: 'Lovelace - PDF',
  });
})