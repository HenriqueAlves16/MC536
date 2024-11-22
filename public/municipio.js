
function openTab(event, tabName) {
    // Esconde todos os conteúdos das abas
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));

    // Remove a classe 'active' de todos os botões
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => button.classList.remove('active'));

    // Exibe o conteúdo da aba selecionada
    document.getElementById(tabName).classList.add('active');

    // Marca o botão da aba como ativo
    event.currentTarget.classList.add('active');
}
  
  // Exibe a primeira aba por padrão
document.querySelector('.tab-button').click();
