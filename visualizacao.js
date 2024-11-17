document.addEventListener("DOMContentLoaded", () => {
    const entidadeSelect = document.getElementById("entidade");
    const dadosVisualizacao = document.getElementById("dados-visualizacao");

    entidadeSelect.addEventListener("change", async () => {
        const entidade = entidadeSelect.value;
        console.log(entidade);  // Verifique no console se o valor está correto

        if (entidade === "municipio") {  // Verifique se a opção selecionada é 'municipio'
            try {
                const response = await fetch('http://localhost:3000/visualizar_municipio', { method: 'GET' });

                if (!response.ok) throw new Error("Erro ao carregar dados.");

                const dados = await response.json();
                dadosVisualizacao.innerHTML = renderizarTabela(dados);
            } catch (error) {
                dadosVisualizacao.innerHTML = `<p>Erro: ${error.message}</p>`;
            }
        }
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

        return `<table border="1">${cabeçalho}<tbody>${linhas}</tbody></table>`;
    }
});
