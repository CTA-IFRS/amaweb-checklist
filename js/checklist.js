document.addEventListener('DOMContentLoaded', function() {
    const btnFiltros = document.getElementById('btn-abrir-filtros');
    const filtrosDiv = document.getElementById('filtros');
    const btnClose = filtrosDiv.querySelector('.btn-close');
    const formFiltros = document.getElementById('form-filtros');
    const btnRestaurar = document.getElementById('btn-restaurar');
    const diretrizCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="filtro_"]:not(#filtro_requisitos):not(#filtro_recomendacoes)');
    const exibirTudo = document.getElementById('filtro_exibir_tudo');
    const filtroRequisitos = document.getElementById('filtro_requisitos');
    const filtroRecomendacoes = document.getElementById('filtro_recomendacoes');
    const navItems = document.querySelectorAll('#navegacaoDiretrizes li.nav-item');
    const navButtons = document.querySelectorAll('#navegacaoDiretrizes button');
    const secoes = document.querySelectorAll('[id^="secao_"]');

    btnFiltros.addEventListener('click', function() {
        filtrosDiv.style.display = 'block';
    });

    btnClose.addEventListener('click', function() {
        filtrosDiv.style.display = 'none';
    });

    function atualizarExibirTudoCheckbox() {
        let todosMarcados = true;
        diretrizCheckboxes.forEach(cb => {
            if (!cb.checked) {
                todosMarcados = false;
            }
        });
        exibirTudo.checked = todosMarcados;
    }

    function aplicarFiltros() {
        let primeiroAtivo = null;

        diretrizCheckboxes.forEach(checkbox => {
            const secaoId = checkbox.id.replace('filtro_', 'secao_');
            const secao = document.getElementById(secaoId);
            const navBtn = document.getElementById('tab-' + checkbox.id.replace('filtro_', ''));
            const navItem = navBtn ? navBtn.closest('li.nav-item') : null;

            const mostrarSecao = checkbox.checked;

            if (secao) secao.style.display = 'none';
            if (navItem) navItem.style.display = mostrarSecao ? 'inline-block' : 'none';

            if (mostrarSecao && !primeiroAtivo) {
                primeiroAtivo = navBtn;
            }
        });

        const allFieldsets = document.querySelectorAll('fieldset');
        allFieldsets.forEach(fieldset => {
            const badge = fieldset.querySelector('.classificacao');
            if (badge) {
                const isRequisito = badge.classList.contains('requisito');
                const isRecomendacao = badge.classList.contains('recomendacao');

                let mostrar = true;
                if (isRequisito && !filtroRequisitos.checked) mostrar = false;
                if (isRecomendacao && !filtroRecomendacoes.checked) mostrar = false;

                fieldset.style.display = mostrar ? 'grid' : 'none';
            }
        });

        navButtons.forEach(btn => btn.classList.remove('active'));
        if (primeiroAtivo) {
            primeiroAtivo.classList.add('active');
            const secaoId = 'secao_' + primeiroAtivo.id.replace('tab-', '');
            secoes.forEach(secao => {
                secao.style.display = secao.id === secaoId ? 'block' : 'none';
            });
        } else {
            secoes.forEach(secao => (secao.style.display = 'none'));
        }
    }

    navItems.forEach(item => (item.style.display = 'inline-block'));
    secoes.forEach((secao, index) => {
        secao.style.display = index === 0 ? 'block' : 'none';
    });
    navButtons.forEach((btn, index) => {
        btn.classList.toggle('active', index === 0);
    });

    formFiltros.addEventListener('submit', function (e) {
        e.preventDefault();
        aplicarFiltros();
        filtrosDiv.style.display = 'none';
    });

    exibirTudo.addEventListener('change', function () {
        diretrizCheckboxes.forEach(cb => cb.checked = exibirTudo.checked);
    });

    diretrizCheckboxes.forEach(cb => {
        cb.addEventListener('change', function () {
            atualizarExibirTudoCheckbox();
        });
    });

    btnRestaurar.addEventListener('click', function () {
        diretrizCheckboxes.forEach(cb => cb.checked = true);
        exibirTudo.checked = true;
        filtroRequisitos.checked = true;
        filtroRecomendacoes.checked = true;
    });

    navButtons.forEach(button => {
        button.addEventListener('click', function () {
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const targetId = 'secao_' + this.id.replace('tab-', '');
            secoes.forEach(secao => {
                secao.style.display = secao.id === targetId ? 'block' : 'none';
            });
        });
    });
});