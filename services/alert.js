import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
let notificationCount = 0;
import { sendPasswordResetEmail } from "firebase/auth";


export function load(){
    Swal.fire({
        title: 'Carregando...',
        text: 'Por favor, aguarde...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      
      // Simula um processo de carregamento
      setTimeout(() => { //
        // Fecha a notificação após 2 segundos
        Swal.close();
      }, 2000);
}

export function success(){
    // Notificação de Sucesso com redirecionamento
    Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Bem Vindo.',
        position: 'center',
        showConfirmButton: false,
        timer: 3000,
        toast: true
      })
}

export function success_cad(){
  // Notificação de Sucesso com redirecionamento
  Swal.fire({
      icon: 'success',
      title: 'Sucesso!',
      text: 'Cadastro.',
      position: 'center',
      showConfirmButton: false,
      timer: 3000,
      toast: true
    })
}

export function fail(){
// Exibe a notificação de erro

  Swal.fire({
    icon: 'error',
    title: 'Ops! Algo deu errado...',
    text: 'Revise as informações e tente novamente.',
    position: 'center',
    showConfirmButton: false,
    timer: 4000,
    toast: true
  });

}

export function ainda_nao(){

  Swal.fire({
    title: 'Ainda estamos trabalhando nisso!',
    html: 'Por favor, aguarde...',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
      
      // Fecha o alerta após 3 segundos (3000 milissegundos)
      setTimeout(() => {
        Swal.close();
      }, 3000);
    }
  }); 
}

////////////////////////////////////////////////////////////////////////////////
// REACT TO
////////////////////////////////////////////////////////////////////////////////