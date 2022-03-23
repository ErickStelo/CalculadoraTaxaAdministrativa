Vue.use(VueMask.VueMaskPlugin);

// Or as a directive
Vue.directive('mask', VueMask.VueMaskDirective);

var app = new Vue({
    el: '#app',
    data: {
        opcaoCalculo: null,
        historicoCalculos: [],
        valores: {
            vl_aluguel: 0,
            vl_repasse: 0,
            vl_taxa: 0,
            vlf_comissaoaproximada: 0,
            vlf_taxaadm: 0,
            vlf_repassereal: 0,
            vlf_admimob: 0,
        },
        money: {
            decimal: ',',
            thousands: '.',
            prefix: 'R$ ',
            suffix: '',
            precision: 2,
            masked: false /* doesn't work with directive */
        },
        percent: {
            decimal: ',',
            thousands: '.',
            prefix: '',
            suffix: ' %',
            precision: 2,
            masked: false /* doesn't work with directive */
        },
    },
    methods: {
        calcular: () => {

            var formatMoney = function(valor) {
                valor = parseFloat(valor);
                var valueF = new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                }).format(valor);
                return valueF

            }

            var vl_aluguel = app.clearFix(app.valores.vl_aluguel, 'decimal');
            var vl_repasse = app.clearFix(app.valores.vl_repasse, 'decimal');
            var vl_taxa = app.clearFix(app.valores.vl_taxa, 'decimal');

            if (vl_aluguel === 0) {
                alert("Campos obrigatórios vazios ou com valor incorreto, verifique e tente novamente;");
            } else {
                var log = "";

                if (app.opcaoCalculo == 1) {
                    var aluguel = vl_aluguel;
                    var repasse = vl_repasse;
                    var vlcomissao = ((repasse * 100) / aluguel).toFixed(3);
                    var vltaxaadm = (100 - vlcomissao).toFixed(5);
                    var vlrepassereal = (aluguel - (aluguel * vltaxaadm / 100)).toFixed(3);
                    var vladmimob = ((aluguel * vltaxaadm) / 100).toFixed(3);
                    app.valores.vlf_comissaoaproximada = vlcomissao
                    app.valores.vlf_taxaadm = `${vltaxaadm}%`
                    app.valores.vlf_repassereal = formatMoney(vlrepassereal);
                    // app.valores.vlf_repassereal = `R$ ${vlrepassereal}`
                    // app.valores.vlf_admimob = `R$ ${vladmimob}`;
                    app.valores.vlf_admimob = formatMoney(vladmimob);

                } else if (app.opcaoCalculo == 2) {
                    var aluguel = vl_aluguel;
                    var taxa = (vl_taxa / 100);
                    var vl_adm = aluguel * taxa;
                    var vlrepassereal = (aluguel - vl_adm).toFixed(3);

                    app.valores.vlf_taxaadm = `${vl_taxa}%`
                    app.valores.vlf_repassereal = formatMoney(vlrepassereal)
                    app.valores.vlf_admimob = formatMoney(vl_adm);

                    log += "Calculo % ADM:(" + taxa + "*100)/" + aluguel + " = " + vl_adm;
                }

                var localHistory = localStorage.getItem('historicoCalculos');

                if (localHistory === null) {
                    localHistory = [];
                } else {
                    localHistory = JSON.parse(localHistory);
                }

                localHistory.push({
                    tipoCalculo: app.opcaoCalculo,
                    ...app.valores
                })

                app.historicoCalculos = localHistory;
                localStorage.setItem('historicoCalculos', JSON.stringify(localHistory))

            }
        },
        clearFix: function(campo, tipo) {
            if (tipo === 'decimal' && typeof campo === 'string') {
                let vl = campo.replaceAll('R$ ', '');
                vl = vl.replaceAll('.', '');
                vl = vl.replaceAll(',', '.');

                return parseFloat(vl)
            }
        },

        getHistoricoFromLocalStorage: function() {
            var localHistory = localStorage.getItem('historicoCalculos');

            if (localHistory != null) {
                this.historicoCalculos = JSON.parse(localHistory);
            }

        },
        clearHistorico: function() {
            localStorage.removeItem('historicoCalculos');
            app.historicoCalculos = [];
        },

        limparCampos: function() {
            app.valores = {
                vl_aluguel: 0,
                vl_repasse: 0,
                vl_taxa: 0,
                vlf_comissaoaproximada: 0,
                vlf_taxaadm: 0,
                vlf_repassereal: 0,
                vlf_admimob: 0,
            };
        }

    },
    beforeMount: function() {
        this.getHistoricoFromLocalStorage();
    }
});

var modalSelecaoCalculo = new bootstrap.Modal(document.getElementById('selecaoTipoCalculo'));
modalSelecaoCalculo.show();