import jsPDFInvoiceTemplate, { OutputType } from "jspdf-invoice-template";

async function generateActivityPDF(activityId) {
  try {
    // Buscar atividades e respostas do JSON Server
    console.log("API URL carregada:", import.meta.env.VITE_API_URL);

    const [activityResponse, responsesResponse] = await Promise.all([
      
      fetch(`${import.meta.env.VITE_API_URL}/activities/${activityId}`).then((res) => res.json()),
      fetch(`${import.meta.env.VITE_API_URL}/responses?activityId=${activityId}`).then((res) => res.json()),
    ]);

    const activity = activityResponse;
    const response = responsesResponse[0]; // Supondo que cada atividade tenha apenas uma resposta associada

    if (!activity || !response) {
      console.error("Atividade ou resposta não encontrada!");
      return;
    }

    const props = {
      outputType: OutputType.DataUriString,
      fileName: "Activity_PDF",
      logo: {
        src: "https://raw.githubusercontent.com/Danielalves33147/Imagens/main/TOKEN(4).png",
        width: 53.33,
        height: 26.66,
      },
      business: {
        name: "A tool for English learning",
        address: "Camaçari / Bahia / Brasil",
        email: "lovelace_suporte@hotmail.com",
        website: "www.lovelace.com",
      },
      contact: {
        label: `Aluno: ${response.user}`,
        name: activity.name,
        address: "Endereço do aluno",
        phone: "Telefone do aluno",
        email: "Email do aluno",
      },
      invoice: {
        label: "Invoice #: ",
        num: response.id,
        invDate: `Data: ${new Date().toLocaleDateString()}`,
        header: [
          { title: "#", style: { width: 10 } },
          { title: "Título", style: { width: 50 } },
          { title: "Respostas", style: { width: 50 } },
          { title: "Tempo", style: { width: 18 } },
          { title: "Score", style: { width: 18 } },
          { title: "Nível", style: { width: 18 } },
          { title: "ID", style: { width: 18 } },
        ],
        table: [
          [
            1,
            activity.name,
            response.answers.map((answer) => answer.text).join(", "),
            "0", // Tempo gasto, caso aplicável
            "0", // Pontuação, caso aplicável
            "Nível", // Nível da atividade, caso aplicável
            response.id,
          ],
        ],
      },
      footer: {
        text: "Lovelace Copyright 2024.",
      },
    };

    const pdfObject = jsPDFInvoiceTemplate(props);
    const pdfDataUri = pdfObject.dataUriString;

    const newWindow = window.open();
    newWindow.document.open();
    newWindow.document.write(`<iframe width='100%' height='100%' src='${pdfDataUri}'></iframe>`);
    newWindow.document.close();
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
  }
}

export default generateActivityPDF;
