import { Toaster, toast } from 'sonner'

////////////////////////////////////////////////////////////////////////////////
// REACT TOASTFY //
////////////////////////////////////////////////////////////////////////////////

export function toast_load() {
    const loadingToast = toast.loading("Carregando... Por favor, aguarde...", {
       autoClose: 5000,
       closeOnClick: false,
       draggable: false,
       closeButton: false
    });
  
    // Simula um processo de carregamento
    setTimeout(() => {
       // Fecha a notificação após 2 segundos
       toast.dismiss(loadingToast);
    }, 4000);
  }
  
  export function toast_sucess() {
    toast.success("Bem Vindo.", {
      //position: "top-center",
       autoClose: 3000,
       hideProgressBar: true,
       closeOnClick: true,
       pauseOnHover: true,
       draggable: false
    });
    
  }
  
  export function toast_sucess_cad() {
    toast.success("Cadastro realizado com sucesso.", {
       //position: "top-center",
       autoClose: 3000,
       hideProgressBar: true,
       closeOnClick: true,
       pauseOnHover: true,
       draggable: false
    });
  }
  
  export function toast_fail() {
    toast.error("Ops! Algo deu errado... Revise as informações e tente novamente.", {
       //position: "top-center",
       autoClose: 4000,
       hideProgressBar: true,
       closeOnClick: true,
       pauseOnHover: true,
       draggable: false
    })
}

////////////////////////////////////////////////////////////////////////////////
// SONNER   //
////////////////////////////////////////////////////////////////////////////////

export function sonner_load() {
   const promise = () => new Promise((resolve) => setTimeout(() => resolve({ name: 'Login' }), 3000));

   toast.promise(promise, {
      loading: 'Carregando... Por favor, aguarde...',
      error: 'Erro ao carregar.',
   });
}

export function sonner_success() {
   toast.success("Bem Vindo.", {
      duration: 3000
   });
}

export function sonner_success_cad() {
   toast.success("Cadastro realizado com sucesso.", {
      duration: 3000
   });
}

export function sonner_fail() {
   toast.error("Ops! Algo deu errado... Revise as informações e tente novamente.", {
      duration: 3000
   });
}

export function sonner_ainda_nao() {
  // Exibe uma notificação de carregamento com fechamento automático
  toast("Ainda estamos trabalhando nisso! Por favor, aguarde...", {
   duration: 3000 // Duração de 3 segundos
 });
 }

 export function sonner_conta_desativada() {
   toast.warning("Sua conta está desativada. Entre em contato com o suporte.", {
      duration: 3000
   });
}


export async function sonnerLoad(action) {
   return new Promise((resolve, reject) => {
       const loadingToast = toast.loading("Salvando atividade...");

       setTimeout(async () => {
           try {
               const result = await action();
               toast.dismiss(loadingToast); // Remove o loading
               resolve(result);
           } catch (error) {
               toast.dismiss(loadingToast);
               reject(error);
           }
       }, 3000);
   });
}

// Exibe o Sonner de sucesso ao salvar atividade
export function sonnerSuccess() {
   toast.success("Atividade salva com sucesso!");
}

// Exibe o Sonner de erro ao salvar atividade
export function sonnerError() {
   toast.error("Erro ao salvar atividade.");
}