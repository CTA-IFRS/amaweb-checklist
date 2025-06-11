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
    const navButtons = document.querySelectorAll('#navegacaoDiretrizes a');
    const secoes = document.querySelectorAll('[id^="secao_"]');
    const fieldsets = document.querySelectorAll('#secoes_checklist fieldset');
    const selectExibirComo = document.getElementById('exibir-como-select');
    const btnAplicarExibicao = document.querySelector('#form-exibir-como button[type="button"]');
    const navDiretrizes = document.getElementById('navegacaoDiretrizes');
    const tituloSecoes = document.querySelectorAll('#secoes_checklist h2');
    const container = document.getElementById('secoes_checklist');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const confirmModal = document.getElementById('confirmModal');
    const btnVoltar = document.getElementById('btn-voltar');
    const btnContinuar = document.getElementById('btn-continuar');
    const btnImprimir = document.getElementById('btnImprimir');

    btnFiltros.addEventListener('click', function() {
        if (btnFiltros.getAttribute('aria-expanded') === 'false') {
            filtrosDiv.style.display = 'block';
            btnFiltros.setAttribute('aria-expanded', 'true');
        } else {
            filtrosDiv.style.display = 'none';
            btnFiltros.setAttribute('aria-expanded', 'false');
        }
    });

    btnClose.addEventListener('click', function() {
        filtrosDiv.style.display = 'none';
        btnFiltros.setAttribute('aria-expanded', 'false');
    });

    btnCloseModal.addEventListener('click', function() {
        confirmModal.style.display = 'none';
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

    let secoesFiltradas = Array.from(document.querySelectorAll('input[type="checkbox"][id^="filtro_"]:checked'))
    .map(cb => {
        const secaoId = 'secao_' + cb.id.replace('filtro_', '');
        return document.getElementById(secaoId);
    })
    .filter(Boolean);

    let indiceAtual = 0;

    function aplicarExibicao() {
        const modo = selectExibirComo.value;

        if (modo === 'secao') {
            navDiretrizes.style.display = 'flex';
            
            Array.from(tituloSecoes).forEach(h2 => {
                h2.style.display = 'none';
            });

            const checkboxesMarcados = Array.from(document.querySelectorAll('input[type="checkbox"][id^="filtro_"]:checked'));
            secoesFiltradas = checkboxesMarcados.map(cb => {
                const secaoId = 'secao_' + cb.id.replace('filtro_', '');
                return document.getElementById(secaoId);
            }).filter(Boolean);

            let btnAtivo = null;
            navButtons.forEach(btn => {
                if (btn.classList.contains('active')) {
                    btnAtivo = btn;
                }
            });

            let secaoParaMostrarId = null;
            if (btnAtivo) {
                const id = 'secao_' + btnAtivo.id.replace('tab-', '');
                secaoParaMostrarId = document.getElementById(id);
                indiceAtual = secoesFiltradas.findIndex(secao => secao.id === id);
            }

            if (!secaoParaMostrarId || indiceAtual === -1) {
                indiceAtual = 0;
                secaoParaMostrarId = secoesFiltradas[indiceAtual];
            }
            
            secoes.forEach(secao => secao.style.display = 'none');
            if (secaoParaMostrarId) {
                secaoParaMostrarId.style.display = 'block';
            }

            atualizarBotoesNavegacao();

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

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            navButtons.forEach(b => b.classList.remove('active'));
            navButtons.forEach(b => b.ariaSelected = 'false');
            btn.classList.add('active');
            btn.ariaSelected = 'true';

            const secaoId = 'secao_' + btn.id.replace('tab-', '');
            const secao = document.getElementById(secaoId);

            if (selectExibirComo.value === 'secao') {
                const index = secoesFiltradas.findIndex(s => s.id === secaoId);
                if (index !== -1) {
                    irParaSecao(index);
                }
            } else {
                secao.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    function irParaSecao(novoIndice) {
        if (novoIndice >= 0 && novoIndice < secoesFiltradas.length) {
            secoesFiltradas[indiceAtual].style.display = 'none';
            indiceAtual = novoIndice;
            secoesFiltradas[indiceAtual].style.display = 'block';
            setAbaAtiva(indiceAtual);
            atualizarBotoesNavegacao();
        }
    }

    function voltarSecao() {
        if (indiceAtual > 0) {
            irParaSecao(indiceAtual - 1);
        }
    }

    function avancarSecao() {
        if (indiceAtual < secoesFiltradas.length - 1) {
            irParaSecao(indiceAtual + 1);
        }
    }

    function atualizarBotoesNavegacao() {
        if (indiceAtual === 0) {
            btnVoltar.classList.add('disabled-link');
            btnVoltar.setAttribute('aria-disabled', 'true');
        } else {
            btnVoltar.classList.remove('disabled-link');
            btnVoltar.setAttribute('aria-disabled', 'false');
        }

        if (indiceAtual >= secoesFiltradas.length - 1) {
            btnContinuar.classList.add('disabled-link');
            btnContinuar.setAttribute('aria-disabled', 'true');
        } else {
            btnContinuar.classList.remove('disabled-link');
            btnContinuar.setAttribute('aria-disabled', 'false');
        }

        const spanVoltar = btnVoltar.querySelector('span.visualmente-oculto');
        const spanContinuar = btnContinuar.querySelector('span.visualmente-oculto');

        if (secoesFiltradas.length > 1) {
            const nomeSegundaSecao = secoesFiltradas[1].querySelector('h2')?.textContent || 'próxima';
            spanContinuar.textContent = `para seção ${nomeSegundaSecao}`;
        } else {
            spanContinuar.textContent = 'para seção seguinte';
        }

        if (indiceAtual > 0) {
            const nomeSecaoVoltar = secoesFiltradas[indiceAtual - 1].querySelector('h2')?.textContent || 'anterior';
            spanVoltar.textContent = `para seção ${nomeSecaoVoltar}`;
        } else {
            spanVoltar.textContent = 'para seção anterior';
        }

        if (indiceAtual < secoesFiltradas.length - 1) {
            const nomeSecaoContinuar = secoesFiltradas[indiceAtual + 1].querySelector('h2')?.textContent || 'próxima';
            spanContinuar.textContent = `para seção ${nomeSecaoContinuar}`;
        } else {
            spanContinuar.textContent = 'para seção seguinte';
        }
    }

    btnVoltar.addEventListener('click', voltarSecao);
    btnContinuar.addEventListener('click', avancarSecao);

    function ativarComTecla(el, acao) {
        el.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                acao();
            }
        });
    }

    ativarComTecla(btnVoltar, voltarSecao);
    ativarComTecla(btnContinuar, avancarSecao);

    function getBotoesVisiveis() {
        return Array.from(navButtons).filter(btn => btn.offsetParent !== null);
    }

    function getIndexAtivo() {
        const visiveis = getBotoesVisiveis();
        return visiveis.findIndex(btn => btn.classList.contains('active'));
    }

    function setAbaAtiva(index) {
        const visiveis = getBotoesVisiveis();
        if (visiveis.length === 0 || index < 0 || index >= visiveis.length) return;

        visiveis.forEach(btn => {
            btn.classList.remove('active');
            btn.ariaSelected = 'false';
        });

        const ativo = visiveis[index];
        ativo.classList.add('active');
        ativo.ariaSelected = 'true';
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

    let testeAltoContraste = false;
    const body = document.body;

    window.addEventListener('beforeprint', () => {
        
        container.querySelectorAll('textarea').forEach(textarea => {
            let p = textarea.nextElementSibling;
            if (!p || !p.classList.contains('print-value')) {
            p = document.createElement('p');
            p.classList.add('print-value');
            textarea.insertAdjacentElement('afterend', p);
            }
            p.textContent = textarea.value;
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

        function updateDataHora() {
            var dataHora = new Date();
            document.getElementById("dataHora").innerHTML = dataHora.toLocaleString();
        }

        updateDataHora();
        setInterval(updateDataHora, 1000);

        tituloSecoes.forEach(h2 => {
            h2.style.display = 'flex';
        });

        diretrizCheckboxes.forEach(cb => {
            const secaoId = cb.id.replace('filtro_', 'secao_');
            const secao = document.getElementById(secaoId);
            if (secao) {
                secao.style.display = cb.checked ? 'block' : 'none';
            }
        });

        const secoesVisiveis = document.querySelectorAll('#secoes_checklist section[id^="secao_"]');
        const titulos = [];

        secoesVisiveis.forEach(secao => {
            if (secao.style.display !== 'none') {
                const h2 = secao.querySelector('h2');
                if (h2) {
                    titulos.push(h2.textContent.trim());
                }
            }
        });

        const pSecoesAnalisadas = document.getElementById('secoes_analisadas');
        if (pSecoesAnalisadas) {
            pSecoesAnalisadas.textContent = titulos.join(', ');
            pSecoesAnalisadas.innerHTML = '<strong>Seções analisadas: </strong> ' + titulos.join(', ');
        }

        if (body.classList.contains("alto-contraste")) {
            testeAltoContraste = true;
            body.classList.remove("alto-contraste");
        }
    });

    window.addEventListener('afterprint', () => {
        const modo = selectExibirComo.value;

        if (modo === 'secao') {

            tituloSecoes.forEach(h2 => {
                h2.style.display = 'none';
            });

            diretrizCheckboxes.forEach(cb => {
                const secaoId = cb.id.replace('filtro_', 'secao_');
                const secao = document.getElementById(secaoId);
                if (secao) {
                    secao.style.display = 'none';
                }
            });

            aplicarExibicao();
        }

        const pSecoesAnalisadas = document.getElementById('secoes_analisadas');
        if (pSecoesAnalisadas) {
            pSecoesAnalisadas.textContent = '';
        }

        if (testeAltoContraste) {
            document.body.classList.add("alto-contraste");
            testeAltoContraste = false;
        }
    });
    
    function showConfirmModal(message, callback) {
        const modal = document.getElementById('confirmModal');
        const msgElem = document.getElementById('confirmMessage');
        const btnYes = document.getElementById('btnConfirmYes');
        const btnNo = document.getElementById('btnConfirmNo');

        msgElem.textContent = message;
        modal.style.display = 'flex';

        function cleanUp() {
            btnYes.removeEventListener('click', onYes);
            btnNo.removeEventListener('click', onNo);
            modal.style.display = 'none';
        }

        function onYes() {
            cleanUp();
            callback(true);
        }

        function onNo() {
            cleanUp();
            callback(false);
        }

        btnYes.addEventListener('click', onYes);
        btnNo.addEventListener('click', onNo);
    }

    function dispararImprimir() {
        const secoesComCamposVazios = [];

        const diretrizCheckboxesMarcados = Array.from(document.querySelectorAll('input[type="checkbox"][id^="filtro_"]:checked:not(#filtro_requisitos):not(#filtro_recomendacoes)'));

        diretrizCheckboxesMarcados.forEach(cb => {
            const secaoId = cb.id.replace('filtro_', 'secao_');
            const secao = document.getElementById(secaoId);
            if (secao) {
                const selects = secao.querySelectorAll('select');
                let algumVazio = false;
                selects.forEach(select => {
                    if (!select.value || select.value.trim() === '') {
                        algumVazio = true;
                    }
                });
                if (algumVazio) {
                    const h2 = secao.querySelector('h2');
                    const titulo = h2 ? h2.textContent.trim() : 'Seção sem título';
                    secoesComCamposVazios.push(titulo);
                }
            }
        });

        if (secoesComCamposVazios.length > 0) {
            const msg = `Alguns campos não foram preenchidos nas seções: ${secoesComCamposVazios.join(', ')}. Deseja continuar?`;
            showConfirmModal(msg, function(userConfirmed) {
                if (userConfirmed) {
                    window.print();
                }
            });
        } else {
            window.print();
        }
    }
    btnImprimir.addEventListener('click', dispararImprimir);

    btnImprimir.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            dispararImprimir();
        }
    });

    function updatePieFromSelects() {
        const selects = document.querySelectorAll('#secoes_checklist select');
        const counts = { sim: 0, nao: 0, na: 0 };
        let total = 0;

        selects.forEach(select => {
            const val = select.value.toLowerCase();
            if (val === 'sim' || val === 'nao' || val === 'na') {
                counts[val]++;
                total++;
            }
        });

        if (total === 0) return;

        const pieSlices = document.getElementById("pieSlices");
        const legend = document.getElementById("legend");
        pieSlices.innerHTML = '';
        legend.innerHTML = '';

        const data = [
            { label: "Sim", value: counts.sim, color: "#104736" },
            { label: "Não", value: counts.nao, color: "#1C886B" },
            { label: "N/A", value: counts.na, color: "#42DBB8" }
        ];

        let currentAngle = 0;
        data.forEach(item => {
            if (item.value === 0) return;

            const angle = (item.value / total) * 360;

            if (angle > 180) {
                const half1 = document.createElement("div");
                half1.className = "hold";
                half1.style.transform = `rotate(${currentAngle}deg)`;

                const pie1 = document.createElement("div");
                pie1.className = "pie";
                pie1.style.backgroundColor = item.color;
                pie1.style.transform = `rotate(180deg)`;

                half1.appendChild(pie1);
                pieSlices.appendChild(half1);

                const half2 = document.createElement("div");
                half2.className = "hold";
                half2.style.transform = `rotate(${currentAngle + 180}deg)`;

                const pie2 = document.createElement("div");
                pie2.className = "pie";
                pie2.style.backgroundColor = item.color;
                pie2.style.transform = `rotate(${angle - 180}deg)`;

                half2.appendChild(pie2);
                pieSlices.appendChild(half2);
            } else {
                const hold = document.createElement("div");
                hold.className = "hold";
                hold.style.transform = `rotate(${currentAngle}deg)`;

                const pie = document.createElement("div");
                pie.className = "pie";
                pie.style.backgroundColor = item.color;
                pie.style.transform = `rotate(${angle}deg)`;

                hold.appendChild(pie);
                pieSlices.appendChild(hold);
            }

            currentAngle += angle;

            const legendItem = document.createElement("p");
            const percent = ((item.value / total) * 100).toFixed(1);
            legendItem.innerHTML = `<span class="color-box" style="background:${item.color}"></span><strong class="text-uppercase">${percent}% ${item.label}</strong>`;

            legend.appendChild(legendItem);
        });
    }

    document.querySelectorAll('#secoes_checklist select').forEach(select => {
        select.addEventListener('change', updatePieFromSelects);
    });

    updatePieFromSelects();

    function contarRespostas() {
        const resultados = {
            requisitos: { total: 0, preenchidos: 0 },
            recomendacoes: { total: 0, preenchidos: 0 }
        };

        if (!Array.isArray(secoesFiltradas)) return resultados;

        secoesFiltradas.forEach(secao => {
            const fieldsets = secao.querySelectorAll('fieldset');

            fieldsets.forEach(fieldset => {
                const select = fieldset.querySelector('select');
                const classificacao = fieldset.querySelector('.classificacao');

                if (!select || !classificacao) return;

                const tipo = classificacao.classList.contains('requisito') ? 'requisitos' : classificacao.classList.contains('recomendacao') ? 'recomendacoes' : null;

                if (!tipo) return;

                resultados[tipo].total++;

                if (select.value.trim() !== '') {
                    resultados[tipo].preenchidos++;
                }
            });
        });

        return resultados;
    }

    function atualizarResumoRespostas() {
        const resumo = contarRespostas();
        document.getElementById('resumoRespostas').textContent = `${resumo.requisitos.preenchidos}/${resumo.requisitos.total} REQUISITOS  |  ` + `${resumo.recomendacoes.preenchidos}/${resumo.recomendacoes.total} RECOMENDAÇÕES`;
    }
    
    document.querySelectorAll('select.form-select').forEach(select => {
        select.addEventListener('change', atualizarResumoRespostas);
    });

});