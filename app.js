function mostrarFormulario() {
    // Esconde todos os formulários
    const forms = document.querySelectorAll('.form-container');
    forms.forEach(form => form.style.display = 'none');

    // Mostra o formulário selecionado
    const entidade = document.getElementById('entidade').value;
    if (entidade) {
        document.getElementById(`form-${entidade}`).style.display = 'block';
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("entidade").addEventListener("change", () => {
        const forms = document.querySelectorAll('.form-container');
        forms.forEach(form => form.style.display = 'none');

        const entidade = document.getElementById('entidade').value;
        if (entidade) {
            document.getElementById(`form-${entidade}`).style.display = 'block';
        }
    });
});
