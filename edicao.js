function renderizarTabela(dados, entidade) {
    const colunas = Object.keys(dados[0]);

    // Cabeçalho da tabela
    const cabeçalho = `
        <thead>
            <tr>
                <th class="acoes">Ações</th>
                ${colunas.map(col => `<th>${col}</th>`).join('')}
            </tr>
        </thead>`;

    // Linhas da tabela com botões na mesma iteração
    const linhas = dados.map(row => {
        const id = row[colunas[0]]; // Primeiro campo como ID
        const botoes = `
            <td class="acoes">
                <button class="btn-delete" data-id="${id}" data-entidade="${entidade}">❌</button>
                <button class="btn-edit" data-id="${id}" data-entidade="${entidade}">✏️</button>
            </td>`;
        const colunasHTML = colunas.map(col => `<td contenteditable="true" data-coluna="${col}">${row[col]}</td>`).join('');

        return `<tr data-id="${id}">${botoes}${colunasHTML}</tr>`;
    }).join('');

    // Retorno da tabela
    return `
        <div class="tabela-container">
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
        adicionarListeners(entidade);
    } catch (error) {
        dadosVisualizacao.innerHTML = `<p>Erro: ${error.message}</p>`;
    }
}

// Adiciona listeners para os botões de exclusão e edição
function adicionarListeners(entidade) {
    const deleteButtons = document.querySelectorAll('.btn-delete');
    const editButtons = document.querySelectorAll('.btn-edit');
    // Função para lidar com botões de exclusão
    deleteButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const row = button.closest('tr'); // Obtém a linha associada ao botão
            const id = row.getAttribute('data-id'); // ID obtido do atributo da linha
            console.log(`Deletando registro com ID: ${id}`);

            try {
                const response = await fetch(`http://localhost:3000/delete/${entidade}/${id}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Erro ao excluir registro.');
                alert('Registro excluído com sucesso!');
                carregarDados(entidade); // Recarrega os dados após exclusão
            } catch (error) {
                alert(error.message);
            }
        });
    });

    // Função para lidar com botões de edição
    editButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const row = button.closest('tr'); // Obtém a linha associada ao botão
            const id = row.getAttribute('data-id'); // ID obtido do atributo da linha
            const updates = {};

            // Itera pelas células editáveis e coleta os valores
            row.querySelectorAll('[contenteditable="true"]').forEach(cell => {
                updates[cell.getAttribute('data-coluna')] = cell.textContent.trim();
            });

            console.log(`Atualizando registro com ID: ${id}`, updates);

            try {
                const response = await fetch(`http://localhost:3000/update/${entidade}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updates),
                });
                if (!response.ok) throw new Error('Erro ao atualizar registro.');
                alert('Registro atualizado com sucesso!');
                carregarDados(entidade); // Recarrega os dados atualizados
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
