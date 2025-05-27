document.addEventListener('DOMContentLoaded', function() {
    const btnFiltros = document.getElementById('btn-abrir-filtros');
    const filtrosDiv = document.getElementById('filtros');
    const btnClose = filtrosDiv.querySelector('.btn-close');

    btnFiltros.addEventListener('click', function() {
        filtrosDiv.style.display = 'block';
    });

    btnClose.addEventListener('click', function() {
        filtrosDiv.style.display = 'none';
    });
});