function renderizarTabela(dados, entidade) {
    const colunas = Object.keys(dados[0]);

    // Cabeçalho da tabela
    const cabeçalho = `
        <thead>
            <tr>${colunas.map(col => `<th>${col}</th>`).join('')}</tr>
        </thead>`;

    // Linhas da tabela com IDs para associar aos botões
    const linhas = dados.map(
        (row, index) => `
            <tr data-id="${row.id}" data-index="${index}">
                ${colunas.map(col => `<td contenteditable="true" data-coluna="${col}">${row[col]}</td>`).join('')}
            </tr>`
    ).join('');

    // Botões fora da tabela
    const botoes = dados.map(
        (row, index) => `
            <div class="acoes" data-index="${index}">
                <button class="btn-delete" data-id="${row.id}" data-entidade="${entidade}">❌</button>
                <button class="btn-edit" data-id="${row.id}" data-entidade="${entidade}">✏️</button>
            </div>`
    ).join('');

    // Retorno da tabela e botões
    return `
        <div class="tabela-container">
            <!-- Botões para cada linha da tabela -->
            <div class="botoes-container">
                ${botoes}
            </div>
            <!-- Tabela com as linhas e cabeçalho -->
            <table class="tabela">
                ${cabeçalho}
                <tbody>${linhas}</tbody>
            </table>
        </div>`;
}

// Função para carregar os dados de uma entidade
async function carregarDados(entidade) {
    if (!entidade) return;
    
    const dadosVisualizacao = document.getElementById("dados-visualizacao");
    try {
        const url = `http://localhost:3000/visualizar_${entidade}`;
        const response = await fetch(url, { method: 'GET' });
        if (!response.ok) throw new Error('Erro ao carregar dados.');
        const dados = await response.json();
        dadosVisualizacao.innerHTML = renderizarTabela(dados, entidade);
//        adicionarListeners(entidade);
    } catch (error) {
        dadosVisualizacao.innerHTML = `<p>Erro: ${error.message}</p>`;
    }
}

// Adiciona listeners para os botões de exclusão e edição
function adicionarListeners(entidade) {
    const deleteButtons = document.querySelectorAll('.btn-delete');
    const editButtons = document.querySelectorAll('.btn-edit');

    deleteButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const id = button.getAttribute('data-id');
            try {
                const response = await fetch(`http://localhost:3000/delete/${entidade}/${id}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Erro ao excluir registro.');
                alert('Registro excluído com sucesso!');
                carregarDados(entidade);
            } catch (error) {
                alert(error.message);
            }
        });
    });

    editButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const id = button.getAttribute('data-id');
            const row = button.closest('tr');
            const updates = {};

            row.querySelectorAll('[contenteditable="true"]').forEach(cell => {
                updates[cell.getAttribute('data-coluna')] = cell.textContent.trim();
            });

            try {
                const response = await fetch(`http://localhost:3000/update/${entidade}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updates),
                });
                if (!response.ok) throw new Error('Erro ao atualizar registro.');
                alert('Registro atualizado com sucesso!');
                carregarDados(entidade);
            } catch (error) {
                alert(error.message);
            }
        });
    });
}


document.addEventListener("DOMContentLoaded", () => {
    const entidadeSelect = document.getElementById("entidade");
    const dadosVisualizacao = document.getElementById("dados-visualizacao");

    entidadeSelect.addEventListener("change", () => {
        const entidade = entidadeSelect.value;

        // Chamar a função genérica para carregar os dados
        carregarDados(entidade, (dados) => {
            if (!dados || dados.length === 0) {
                dadosVisualizacao.innerHTML = "<p>Nenhum dado encontrado.</p>";
                return;
            }
            dadosVisualizacao.innerHTML = renderizarTabela(dados);
        });
    });
});
