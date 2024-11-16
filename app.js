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

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('form-doenca').addEventListener('submit', function (e) {
        e.preventDefault(); // Impede o envio padrão do formulário

        // Cria um objeto JSON a partir dos dados do formulário
        const jsonData = {
            nome_doenca: document.getElementById('nome_doenca').value,
            letalidade: document.getElementById('letalidade').value,
            contagioso: document.getElementById('contagioso').value,
        };

        // Envia os dados para o servidor
        fetch('http://localhost:3000/inserir_doenca', {
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
});


