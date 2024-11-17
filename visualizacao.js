async function carregarDados(entidade, renderizarCallback) {
    if (!entidade) {
        console.error("Entidade inválida.");
        return;
    }

    try {
        // Construir a URL dinamicamente com base na entidade
        const url = `http://localhost:3000/visualizar_${entidade}`;
        console.log(url)
        const response = await fetch(url, { method: 'GET' });

        if (!response.ok) {
            throw new Error(`Erro ao carregar dados para a entidade "${entidade}".`);
        }

        const dados = await response.json();
        renderizarCallback(dados);
    } catch (error) {
        console.error(`Erro ao buscar dados para "${entidade}":`, error.message);
        document.getElementById("dados-visualizacao").innerHTML = `<p>Erro: ${error.message}</p>`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const entidadeSelect = document.getElementById("entidade");
    const dadosVisualizacao = document.getElementById("dados-visualizacao");

    entidadeSelect.addEventListener("change", () => {
        const entidade = entidadeSelect.value;
        console.log(`Entidade selecionada: ${entidade}`);

        // Chamar a função genérica para carregar os dados
        carregarDados(entidade, (dados) => {
            if (!dados || dados.length === 0) {
                dadosVisualizacao.innerHTML = "<p>Nenhum dado encontrado.</p>";
                return;
            }
            dadosVisualizacao.innerHTML = renderizarTabela(dados);
        });
    });

    function renderizarTabela(dados) {
        if (!dados || dados.length === 0) {
            return "<p>Nenhum dado encontrado.</p>";
        }
    
        const colunas = Object.keys(dados[0]);
        const cabeçalho = `<thead><tr>${colunas.map(col => `<th>${col}</th>`).join("")}</tr></thead>`;
        const linhas = dados.map(
            row => `<tr>${colunas.map(col => `<td>${row[col]}</td>`).join("")}</tr>`
        ).join("");
    
        // Adicionando uma classe e um título (opcional)
        return `
            <table class="styled-table">
                <caption>Dados da Tabela</caption>
                ${cabeçalho}
                <tbody>
                    ${linhas}
                </tbody>
            </table>
        `;
    }    
});
