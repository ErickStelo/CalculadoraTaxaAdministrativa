$(document).ready(function(){
    $('.money').mask('000000000000000.00', {reverse: true});
    $("#resultados").hide();
    var log = "";

    $("#calcula").click(function(){
        if($("#vlaluguel").val()==""||$("#vlaluguel").val()==""||$("#vlaluguel").val()==0.00||$("#vlaluguel").val()==0.00){
            alert("Campos obrigatórios vazios ou com valor incorreto, verifique e tente novamente;");
        }else{
            var aluguel = parseFloat($("#vlaluguel").val());
            var repasse = parseFloat($("#vlrepasse").val());
            var vlcomissao = ((repasse*100)/aluguel).toFixed(3);
            var vltaxaadm = (100-vlcomissao).toFixed(3);
            var vlrepassereal = (aluguel-(aluguel*vltaxaadm/100)).toFixed(3);
            var vladmimob = ((aluguel*vltaxaadm)/100).toFixed(3);
            $(".hide").toggleClass();
            $("#resultados").fadeIn("fast");
            $("#vlcomissaoaproximada").text(vlcomissao);
            $("#vltaxaadm").text(vltaxaadm+" %");
            $("#vlrepassereal").text("R$ "+vlrepassereal);
            $("#vladmimob").text("R$ "+vladmimob);
            log += "Calculo Comissão:("+repasse+"*100)/"+aluguel+" = "+ vlcomissao + " | ";
            log += "Calculo % Taxa: 100-"+vlcomissao+" = "+vltaxaadm;
            console.log(log);
        }
    });
    $("#limpar").click(function(){
        $("#vlcomissaoaproximada").text("");
        $("#vltaxaadm").text("");
        $("#vlaluguel").val("");
        $("#vlrepasse").val("");
        $("#vlrepassereal").text("");
        $("#vladmimob").text("");
        $("#resultados").fadeOut("fast");
    });




});

