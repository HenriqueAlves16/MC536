function mostrarFormulario() {
    // Esconde todos os formulários
    const forms = document.querySelectorAll('.form-container');
    forms.forEach(form => form.style.display = 'none');

    // Mostra o formulário selecionado
    const entidade = document.getElementById('entidade').value;
    if (entidade) {
        document.getElementById(`form-${entidade}-container`).style.display = 'block';
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message; // Define a mensagem
    toast.classList.add('show'); // Adiciona a classe que mostra o toast

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Seletor de entidades ao documento carregar
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("entidade").addEventListener("change", () => {
        const forms = document.querySelectorAll('.form-container');
        forms.forEach(form => form.style.display = 'none');

        const entidade = document.getElementById('entidade').value;
        if (entidade) {
            document.getElementById(`form-${entidade}-container`).style.display = 'block';
        }
    });
});

// Criando os event listeners para cada botão de submissão quando o documento carrega
document.addEventListener("DOMContentLoaded", () => {
    // Função genérica para lidar com o envio dos dados do formulário
    function handleFormSubmit(formId, url) {
        const form = document.getElementById(formId);
        
        form.addEventListener('submit', function (e) {
            e.preventDefault(); // Impede o envio padrão do formulário
            
            // Cria um objeto JSON a partir dos dados do formulário
            const formData = new FormData(form);
            const jsonData = {};
            formData.forEach((value, key) => {
                jsonData[key] = value; // Transforma os dados do formulário em JSON
            });

            // Envia os dados para o servidor
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Define o formato da requisição como JSON
                },
                body: JSON.stringify(jsonData), // Envia os dados como JSON
            })
            .then(response => response.text()) // Espera uma resposta do servidor
            .then(data => {
                showToast('Dados inseridos com sucesso!');
            })
            .catch(error => {
                showToast('Erro ao inserir dados!');
            });
        });
    }

    // Lista de formulários e URLs correspondentes
    const forms = [
        { formId: 'form-municipio', url: 'http://localhost:3000/inserir_municipio' },
        { formId: 'form-profissional', url: 'http://localhost:3000/inserir_profissional_saude' },
        { formId: 'form-doenca', url: 'http://localhost:3000/inserir_doenca' },
        { formId: 'form-paciente', url: 'http://localhost:3000/inserir_paciente' },
        { formId: 'form-unidade-saude', url: 'http://localhost:3000/inserir_unidade_saude' },
        { formId: 'form-investimento', url: 'http://localhost:3000/inserir_investimento' },
        { formId: 'form-diagnostico', url: 'http://localhost:3000/inserir_diagnostico' },
        { formId: 'form-atuacao', url: 'http://localhost:3000/inserir_atuacao' },
        { formId: 'form-atendimento', url: 'http://localhost:3000/inserir_atendimento' }
    ];

    // Chama a função handleFormSubmit para cada formulário
    forms.forEach(form => {
        handleFormSubmit(form.formId, form.url);
    });
});
