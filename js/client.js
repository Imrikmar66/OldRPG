//Cette variable est globale car on en auras vraiment besoin dans de nombreuse fonction. Elle définit le personnage du client actuel
var joueur;
var characters = [];
var map;
(function($){
	//var socket = io.connect(':1337'); //Mis dans socket.io.js
	
	//Liste des personnages
	var posInArray = 0;
	//Facteur pour le décalage canvas en fonction de la taille de l'écran
	var xFactor;
	var yFactor;
	//Variable du contexte de dessin
	var ctx;
	var canvas;
	//Autres variables
	var arrow;

	
	//Mise a jour des joueurs déja présent dans la partie
	socket.on("updateCharactersAndMap", function(allCharacters, theMap){
		//On récupère la map, puis on réassigne les attributs qui utilise la classe "Image" qui n'existe pas coté serveur !
		map = theMap;
		map.img = new Image();
		map.img.src = map.saveImgSrc;
		map.noWalk = new Image();
		map.noWalk.src = map.saveNoWalkSrc;
		map.pathImg = new Image();
		map.pathImg.src = map.savePathImgSrc;
		//
		
		//on réassigne les méthodes qui sont perdue dans le passage vers le serveur
		theMap.__proto__ = Map.prototype;
		
		for(var i=0; i<allCharacters.length; i++){
			//on réassigne les méthodes qui sont perdue dans le passage vers le serveur
			allCharacters[i].__proto__ = Character.prototype;
			//Actualisation du tableau des perso local
			characters.push(allCharacters[i]);
			//Update characters
		}
		
		//Demande a tout les joueurs un update (tout rafraichir)
		socket.emit("action", {action : "joueur.update(joueur, true)"});
		
		//Gestion canvas
	    canvas = document.getElementById("mon_canvas");
		$canvas = $("#mon_canvas");
		
		canvas.width  = map.width*map.tileW;
		canvas.height = map.height*map.tileH;
	
		//Calcul des facteurs de décalage du à la taille du canvas différente de la taille de l'écran
		xFactor = window.innerWidth/canvas.width;
		yFactor = window.innerHeight/canvas.height;
		ctx = canvas.getContext("2d");
	
		//Gestion affichage interface utilisateur
		arrow = new ClickArrow();
		
		//Démarrer la partie
		startGame();
	})
	
	function startGame(){
		//on élève l'élement game_closed qui cache la carte
		$("#game_closed").remove();
		
		//Add character
		joueur = new Character("armin", "img/armin.png", "img/armin.jpg", 32, 32, 2, canvas.width, canvas.height, map);
		var myId = joueur.id;
		
		//Attribution des event en jeu
		$canvas.mousedown(function(event){
			if(event.button == 2){	//click droit
				var posX = event.pageX - (joueur.width/2);
				var posY = event.pageY - (joueur.height/2);
				//On utilise les facteurs précedemment calculées
				posX /= xFactor;
				posY /= yFactor;
				joueur.move(posX, posY, map, true, joueur);
			
				//On dessine la fleche
				arrow.drawAnimation(posX, posY, map);
			}
			
		});
		
		$(window).keydown(function(event){
			event.preventDefault();
			if(event.keyCode == 40){//bas
				joueur.canvasPos.y = 0;
				joueur.keyBordMove(joueur.position.x, joueur.position.y + map.tileH, map, true, joueur);
			}
			else if(event.keyCode == 38){ //haut
				joueur.canvasPos.y = 3 * joueur.height;
				joueur.keyBordMove(joueur.position.x, joueur.position.y - map.tileH, map, true, joueur);
			}
			else if(event.keyCode == 39){//droite
				joueur.canvasPos.y = 2 * joueur.height;;
				joueur.keyBordMove(joueur.position.x + map.tileW, joueur.position.y, map, true, joueur);
			}
			else if(event.keyCode == 37){//gauche
				joueur.canvasPos.y = joueur.height;;
				joueur.keyBordMove(joueur.position.x - map.tileW, joueur.position.y, map, true, joueur);
			}
		}).keyup(function(){
			clearInterval(joueur.interval);
			socket.emit("action", {action : "clearInterval(characters[getIndexId(characters, " + myId + ")].interval)"});
		});
		
		//Envoie au serveur le personnage
		socket.emit("createNewCharacter", joueur);
		
		//Le serveur renvoie la liste actyualisé des personnages
		socket.on("createCharacter", function(character){
			//on réactualise le tableau des perso local
			character.__proto__ = Character.prototype;
			characters.push(character);
		});
		
		//Si un joueur se deconnecte, effacer le personnage dans le tableau
		socket.on("deleteCharacter", function(character){
			var index = getIndexId(characters, character.id);
			if (index > -1) {
			    characters.splice(index, 1);
			}
		})
		
		//si une action est effectué par un autre utilisateur on la recopie
		socket.on("action", function(array){
			eval(array.action);
		});
			
		//Boucle de dessin du canvas - Faire un tableau d'objet à afficher important !
		mainInterval();
		function mainInterval(){
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			//Dessin de la carte
			map.draw(ctx, 0, 0);
			//dessin du joueur
			joueur.draw(ctx, joueur.position.x, joueur.position.y);
			//dessin interface utilisateur
			arrow.draw(ctx, arrow.position.x, arrow.position.y);
			//dessin des autres joueur
			for(var i=0; i < characters.length; i++){
				characters[i].draw(ctx);
			}
			requestAnimationFrame(function(){ mainInterval() });
		}
	}
	
})(jQuery);

//Rafraichis l'affichage de l'interface. Est appelé en grande partie lors de changement sur l'état de la vie ou du mana
function refreshInterfaceAff(){
	$("."+joueur.lifeClass).parent().css("width", Math.floor((joueur.life/joueur.maxLife)*118));
	$("."+joueur.manaClass).parent().css("width", Math.floor((joueur.mana/joueur.maxMana)*118));
	$("#lifeInfoValue").html(joueur.life);
	$("#lifeInfoMax").html(joueur.maxLife);
	$("#manaInfoValue").html(joueur.mana);
	$("#manaInfoMax").html(joueur.maxMana);
}

/*
//Boucle d'actualisation
setInterval(function(){
	socket.emit("actualize", joueur);
}, 10)

//Le serveur renvoie les infos (pour l'instant de deplacement)actualisée
socket.on("actualized", function(character){
	//si le tableau n'est pas vide(sinon erreur), mettre a jour les paramètres
	if(characters.length > 0){
		characters[getIndexId(characters, character.id)].position.x = character.position.x;
		characters[getIndexId(characters, character.id)].position.y = character.position.y;
	}
});
*/