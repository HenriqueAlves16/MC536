export function renderizarTabela(dados) {
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