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
    const fieldsets = document.querySelectorAll('#secoes_checklist fieldset');
    const selectExibirComo = document.getElementById('exibir-como-select');
    const btnAplicarExibicao = document.querySelector('#form-exibir-como button[type="button"]');
    const navDiretrizes = document.getElementById('navegacaoDiretrizes');
    const tituloSecoes = document.querySelectorAll('#secoes_checklist h2');

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
        } else {
        }
        aplicarExibicao();
    }

    function aplicarExibicao() {
        const modo = selectExibirComo.value;

        if (modo === 'secao') {
            navDiretrizes.style.display = 'flex';
            
            Array.from(tituloSecoes).forEach(h2 => {
                h2.style.display = 'none';
            });

            let btnAtivo = null;
            navButtons.forEach(btn => {
                if (btn.classList.contains('active')) {
                    btnAtivo = btn;
                }
            });

            let secaoParaMostrarId = null;
            if (btnAtivo) {
                secaoParaMostrarId = 'secao_' + btnAtivo.id.replace('tab-', '');
            } else if (secoes.length > 0) {
                secaoParaMostrarId = secoes[0].id;
            }

            secoes.forEach(secao => {
                secao.style.display = (secao.id === secaoParaMostrarId) ? 'block' : 'none';
            });
        } else if (modo === 'lista') {
            navDiretrizes.style.display = 'none';
            
            Array.from(tituloSecoes).forEach(h2 => {
                h2.style.display = 'flex';
            });

            diretrizCheckboxes.forEach(cb => {
                const secaoId = cb.id.replace('filtro_', 'secao_');
                const secao = document.getElementById(secaoId);
                if (secao) {
                    secao.style.display = cb.checked ? 'block' : 'none';
                }
            });
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

    btnAplicarExibicao.addEventListener('click', function() {
        aplicarExibicao();
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

            aplicarExibicao();
        });
    });

    fieldsets.forEach(fieldset => {
        const inputs = fieldset.querySelectorAll('select, input');
        const badge = fieldset.querySelector('.classificacao');

        const isRequisito = badge && badge.classList.contains('requisito');
        const isRecomendacao = badge && badge.classList.contains('recomendacao');

        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                fieldset.classList.add('focused');
                if (isRequisito) {
                    fieldset.classList.add('primary');
                }
                if (isRecomendacao) {
                    fieldset.classList.add('secondary');
                }
            });

            input.addEventListener('blur', () => {
                fieldset.classList.remove('focused', 'primary', 'secondary');
            });
        });
    });
    atualizarExibirTudoCheckbox();

    window.addEventListener('beforeprint', () => {
        const container = document.getElementById('secoes_checklist');
        
        container.querySelectorAll('input').forEach(input => {
            let p = input.nextElementSibling;
            if (!p || !p.classList.contains('print-value')) {
            p = document.createElement('p');
            p.classList.add('print-value');
            input.insertAdjacentElement('afterend', p);
            }
            p.textContent = input.value;
        });

        container.querySelectorAll('select').forEach(select => {
            let p = select.nextElementSibling;
            if (!p || !p.classList.contains('print-value')) {
            p = document.createElement('p');
            p.classList.add('print-value');
            select.insertAdjacentElement('afterend', p);
            }
            p.textContent = select.options[select.selectedIndex].text;
        });
    });
});