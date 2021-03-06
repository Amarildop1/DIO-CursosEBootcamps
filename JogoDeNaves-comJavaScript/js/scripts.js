/* INÍCIO DA FUNÇÃO start() */
function start() { 

	$("#inicio").hide();
	
	$("#fundoGame").append("<div id='jogador' class='anima1'></div>");
	$("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
	$("#fundoGame").append("<div id='inimigo2' class=''></div>");
	$("#fundoGame").append("<div id='amigo' class='anima3'></div>");
	$("#fundoGame").append("<div id='placar'></div>");
	$("#fundoGame").append("<div id='energia'></div>");

	/* VARIÁVEIS UTILIZADAS NO JOGO */
	var jogo = {};
	var velocidade = 5;
	var pontos = 0;
	var salvos = 0;
	var perdidos = 0;
	var energiaAtual = 3;
	var posicaoY = parseInt(Math.random() * 334);
	var TECLA = {
		W: 87,
		S: 83,
		D: 68
	};
	var podeAtirar = true;
	var fimDeJogo = false;

	jogo.pressionou = [];

	var somDisparo = document.getElementById("somDisparo");
	var somExplosao = document.getElementById("somExplosao");
	var musica = document.getElementById("musica");
	var somGameover = document.getElementById("somGameover");
	var somPerdido = document.getElementById("somPerdido");
	var somResgate = document.getElementById("somResgate");
	/* FINAL DAS VARIÁVEIS DO JOGO */


	/* Fundo musical */
	musica.addEventListener("ended", function(){ musica.currentTime = 0; musica.play(); }, false);
	musica.play();


	// Verifica se o usuário pressionou alguma tecla
	$(document).keydown(function(e){
		jogo.pressionou[e.which] = true;
	});

	$(document).keyup(function(e){
		jogo.pressionou[e.which] = false;
	});


	// Game Loop
	jogo.timer = setInterval(loop, 30);

	function loop() {
		moveFundo();
		moveJogador();
		moveInimigo1();
		moveInimigo2();
		moveAmigo()
		colisao();
		placar();
		energia();
	}


	// Função que movimenta o fundo do jogo
	function moveFundo() {
		esquerda = parseInt($("#fundoGame").css("background-position"));
		$("#fundoGame").css("background-position", esquerda - 1);
	} /* Final da função moveFundo() */


	/* Início da função que move o helicóptero do jogador */
	function moveJogador() {
		if (jogo.pressionou[TECLA.W]) {
			var topo = parseInt($("#jogador").css("top"));
			$("#jogador").css("top", topo - 10);

			if (topo <= 0) {
				$("#jogador").css("top", topo + 10);
			}
		}

		if (jogo.pressionou[TECLA.S]) {
			var topo = parseInt($("#jogador").css("top"));
			$("#jogador").css("top", topo + 10);

			if (topo >= 434) {
				$("#jogador").css("top",topo-10);
			}
		}

		if (jogo.pressionou[TECLA.D]) {
			disparo();
		}

	} /* Final da função que move o helicóptero do jogador */


	/* Início da função que move o helicóptero do inimigo */
	function moveInimigo1() {
		posicaoX = parseInt($("#inimigo1").css("left"));
		$("#inimigo1").css("left", posicaoX - velocidade);
		$("#inimigo1").css("top", posicaoY);

			if (posicaoX <= 0) { /* Recria a posicaoY para fazer o inimigo voltar ao inicio */
				posicaoY = parseInt(Math.random() * 334);
				$("#inimigo1").css("left", 694);
				$("#inimigo1").css("top", posicaoY);
			}
	} /* Final da função que move o helicóptero do inimigo */


	/* Início da função que move o caminhão do inimigo */
	function moveInimigo2() {
        posicaoX = parseInt($("#inimigo2").css("left"));
		$("#inimigo2").css("left", posicaoX - 3);

		if (posicaoX <= 0) {
			$("#inimigo2").css("left", 775);
		}
	} /* Final da função que move o caminhão do inimigo */


	/* Início da função que move o amigo */
	function moveAmigo() {
		posicaoX = parseInt($("#amigo").css("left"));
		$("#amigo").css("left", posicaoX+1);

		if (posicaoX > 906) {
			$("#amigo").css("left",0);
		}
	} /* Final da função que move o amigo */

	/* Faz o helicóptero do jogador disparar */
	function disparo() {

		if (podeAtirar == true) {
			somDisparo.play();
			podeAtirar = false;

			topo = parseInt($("#jogador").css("top"))
			posicaoX = parseInt($("#jogador").css("left"))
			tiroX = posicaoX + 190;
			topoTiro = topo + 50;
			$("#fundoGame").append("<div id='disparo'></div");
			$("#disparo").css("top", topoTiro);
			$("#disparo").css("left", tiroX);

			var tempoDisparo = window.setInterval(executaDisparo, 30);

		} //Fecha podeAtirar

		function executaDisparo() {
			posicaoX = parseInt($("#disparo").css("left"));
			$("#disparo").css("left", posicaoX + 15); 

			if (posicaoX > 900) {	
				window.clearInterval(tempoDisparo);
				tempoDisparo = null;
				$("#disparo").remove();
				podeAtirar = true;
			}
		} /* Final de executaDisparo() */

	} /* Final da função disparo() */


	/* Colisão entre Jogador, amigo e Inimigos */
	function colisao() {
		var colisao1 = ($("#jogador").collision($("#inimigo1")));
		var colisao2 = ($("#jogador").collision($("#inimigo2")));
		var colisao3 = ($("#disparo").collision($("#inimigo1")));
		var colisao4 = ($("#disparo").collision($("#inimigo2")));
		var colisao5 = ($("#jogador").collision($("#amigo")));
		var colisao6 = ($("#inimigo2").collision($("#amigo")));

		/* Colisão entre helicópteros | Jogador vs Inimigo*/
		if (colisao1.length > 0) {
			energiaAtual--;
			inimigo1X = parseInt($("#inimigo1").css("left"));
			inimigo1Y = parseInt($("#inimigo1").css("top"));
			explosao1(inimigo1X, inimigo1Y);
		
			posicaoY = parseInt(Math.random() * 334);
			$("#inimigo1").css("left", 694);
			$("#inimigo1").css("top", posicaoY);
		} /* Final da Colisão entre helicópteros | Jogador vs Inimigo*/


		/* Colisão entre helicóptero do jogador e caminhão inimigo */
		if (colisao2.length > 0) {
			energiaAtual--;
			inimigo2X = parseInt($("#inimigo2").css("left"));
			inimigo2Y = parseInt($("#inimigo2").css("top"));
			explosao2(inimigo2X, inimigo2Y);

			$("#inimigo2").remove();

			reposicionaInimigo2();

		} /* Final da Colisão entre helicóptero do jogador e caminhão inimigo */


		/* Colisão do tiro com o helicóptero inimigo */
		if (colisao3.length > 0) {
			pontos += 100;
			velocidade += 0.3;
			inimigo1X = parseInt($("#inimigo1").css("left"));
			inimigo1Y = parseInt($("#inimigo1").css("top"));

			explosao1(inimigo1X, inimigo1Y);
			$("#disparo").css("left", 950);

			posicaoY = parseInt(Math.random() * 334);
			$("#inimigo1").css("left", 694);
			$("#inimigo1").css("top", posicaoY);

		} /* Final da Colisão do tiro com o helicóptero inimigo */


		/* Colisão do tiro com o caminhão inimigo */
		if (colisao4.length > 0) {
			pontos += 50;
			inimigo2X = parseInt($("#inimigo2").css("left"));
			inimigo2Y = parseInt($("#inimigo2").css("top"));
			$("#inimigo2").remove();

			explosao2(inimigo2X, inimigo2Y);
			$("#disparo").css("left", 950);

			reposicionaInimigo2();

		} /* Final da Colisão do tiro com o caminhão inimigo */


		/* /* Colisão do helicóptero do jogador com amigo */
		if (colisao5.length > 0) {
			salvos++;
			somResgate.play();
			reposicionaAmigo();
			$("#amigo").remove();
		}


		/* Colisão entre amigo e caminhão inimigo */
		if (colisao6.length > 0) {
			perdidos++;
			amigoX = parseInt($("#amigo").css("left"));
			amigoY = parseInt($("#amigo").css("top"));
			explosao3(amigoX, amigoY);
			$("#amigo").remove();

			reposicionaAmigo();

		} /* Final da Colisão entre amigo e caminhão inimigo */


	} /* Final da função colisao() entre Jogador, amigo e Inimigos */


	/* Explosão 1 */
	function explosao1(inimigo1X, inimigo1Y) {
		somExplosao.play();
		$("#fundoGame").append("<div id='explosao1'></div");
		$("#explosao1").css("background-image", "url(imgs/explosao.png)");
		var div = $("#explosao1");
		div.css("top", inimigo1Y);
		div.css("left", inimigo1X);
		div.animate({width: 200, opacity: 0}, "slow"); /* animate() -> função do JQuery */
		
		var tempoExplosao = window.setInterval(removeExplosao, 1000);

		function removeExplosao() {

			div.remove();
			window.clearInterval(tempoExplosao);
			tempoExplosao = null;
		}

	} /* Final da função explosao1() */


	/* Função que reposiciona Inimigo2 | 5 segundos após uma colisão */
	function reposicionaInimigo2() {

		var tempoColisao4=window.setInterval(reposiciona4, 5000);

		function reposiciona4() {
			window.clearInterval(tempoColisao4);
			tempoColisao4 = null;

			if (fimDeJogo == false) {
				$("#fundoGame").append("<div id=inimigo2></div");
			}
		}
	} /* Final da Função que reposiciona Inimigo2 */


	/* Explosão 2 */
	function explosao2(inimigo2X, inimigo2Y) {
		somExplosao.play();
		$("#fundoGame").append("<div id='explosao2'></div");
		$("#explosao2").css("background-image", "url(imgs/explosao.png)");
		var div2 = $("#explosao2");
		div2.css("top", inimigo2Y);
		div2.css("left", inimigo2X);
		div2.animate({width: 200, opacity: 0}, "slow");

		var tempoExplosao2 = window.setInterval(removeExplosao2, 1000);

			function removeExplosao2() {
				div2.remove();
				window.clearInterval(tempoExplosao2);
				tempoExplosao2 = null;
			}

	} /* Final da função explosao2() */


	/* Função que reposiciona Amigo | 6 segundos após uma colisão */
	function reposicionaAmigo() {

		var tempoAmigo = window.setInterval(reposiciona6, 6000);

		function reposiciona6() {
			window.clearInterval(tempoAmigo);
			tempoAmigo = null;

			if (fimDeJogo == false) {
				$("#fundoGame").append("<div id='amigo' class='anima3'></div>");
			}
		}
	} /* Final da Função que reposiciona Amigo */


	/* Explosão 3 */
	function explosao3(amigoX, amigoY) {
		somPerdido.play();
		$("#fundoGame").append("<div id='explosao3' class='anima4'></div");
		$("#explosao3").css("top", amigoY);
		$("#explosao3").css("left", amigoX);
		var tempoExplosao3 = window.setInterval(resetaExplosao3, 1000);

		function resetaExplosao3() {
			$("#explosao3").remove();
			window.clearInterval(tempoExplosao3);
			tempoExplosao3 = null;
		}

	} /* Final da função explosao3() */


	/* função placar() */
	function placar() {
		$("#placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>");

	}


	/* Barra de Energia/Vidas do jogador */
	function energia() {

		if (energiaAtual == 3) {
			$("#energia").css("background-image", "url(imgs/energia3.png)");
		}

		if (energiaAtual == 2) {
			$("#energia").css("background-image", "url(imgs/energia2.png)");
		}

		if (energiaAtual == 1) {
			$("#energia").css("background-image", "url(imgs/energia1.png)");
		}

		if (energiaAtual == 0) {
			$("#energia").css("background-image", "url(imgs/energia0.png)");

			gameOver();
		}

	} /* Final da Barra de Energia/Vidas do jogador */


	/* GAME OVER */
	function gameOver() {
		fimDeJogo = true;
		musica.pause();
		somGameover.play();

		window.clearInterval(jogo.timer);
		jogo.timer = null;

		$("#jogador").remove();
		$("#inimigo1").remove();
		$("#inimigo2").remove();
		$("#amigo").remove();

		$("#fundoGame").append("<div id='fim'></div>");

		$("#fim").html("<h1> Game Over </h1><p>Sua pontuação foi: " + pontos + "</p>" + "<div id='reinicia' onClick=reiniciaJogo()><h3>Jogar Novamente ?</h3> <p> <span class='clique'> Clique aqui! </span> </p> </div>");

	} /* Final da função gameOver() */


} /* FINAL DA FUNÇÃO start() */


/* Reinicia o Jogo após um Game Over */
function reiniciaJogo() {
	somGameover.pause();
	$("#fim").remove();
	start();
}
