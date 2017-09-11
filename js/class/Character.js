function Character(name, urlSprite, urlImage, width, height, classId, canvasW, canvasH, map){
	this.id = Math.floor((Math.random()*1000000) + 1);
	this.name = name;
		//Visual
	this.urlSprite = urlSprite;
	this.urlImage = urlImage;
	this.width = width;
	this.height = height;
	this.canvasW = canvasW;
	this.canvasH = canvasH;
	this.canvasPos = {x:'', y:''};
	this.canvasPos.x = 0;
	this.canvasPos.y = 0;
	this.lifeClass = 'lifeInfo';
	this.manaClass = 'manaInfo';

	//Features
	this.type = new GameClass(classId);
	this.level = 0;
	this.strength = this.type.strength;
	this.toughness = this.type.thougness;
	this.speed = this.type.speed;
	this.maxLife = this.type.maxLife;
	this.maxMana = this.type.maxMana;
	this.life = this.maxLife;
	this.mana = this.maxMana;
	
	//Special
	this.keyboardIsAllowed = false;
	this.isTargetingCast = 0;
	this.cursorX = 0;
	this.cursorY = 0;
	
	//Bulle de dialogue
	this.say = '';
	this.sayBoxColor = 'rgb(255, 255, 255)';
	this.sayBoxW = 110;
	this.sayBoxH = 20;

	//Stuff
	this.weapon = this.type.baseWeapon;
	this.armor = this.type.baseArmor;

	//animation
	this.requestAnimation = '';
	
	//position
	this.position = {x:'', y:''};
	this.interval = null;
	
	this.isTargetingPosition = {x:0, y:0};
	
	
	//On va placer le personnage dans un endroit accessible (là ou la matrice de la carte est égale à 0)
	if(this.position.x == '' && this.position.y ==''){
	var newX = Math.floor(Math.random() * map.config[0].length);
	var newY = Math.floor(Math.random() * map.config.length);

	while (map.config[newY][newX] == 1){
		newX = Math.floor(Math.random() * map.config[0].length);
		newY = Math.floor(Math.random() * map.config.length);
	}
	
	this.position.x = newX*map.tileW; //- ((map.tileW/2) + (this.width/2));
	this.position.y = newY*map.tileH;  //- ((map.tileH/2) + (this.height/2));
	}
		
}
//
Character.prototype.draw = function(ctx){
	
	//Ciblage des sorts
	if(this.isTargetingCast > 0){
	    ctx.beginPath();
	    ctx.fillStyle = "rgba(0, 255, 255, 0.3)";
	    ctx.arc(joueur.position.x, joueur.position.y, this.isTargetingCast, 0, 2 * Math.PI);
	    ctx.fill();
	}
	
	//Dessin du personnage
	var img = new Image();
	img.src = this.urlSprite;
	ctx.drawImage(img, this.canvasPos.x, this.canvasPos.y, this.width, this.height, this.position.x, this.position.y, this.width, this.height);
	
	//Personnage parle
	if(this.say != ''){
		//dessin de la bulle et du texte
		ctx.font="16px Arial";
		ctx.fillStyle = this.sayBoxColor;
		ctx.fillText(this.say,this.position.x + this.width + 4, this.position.y - (this.height/2));
	}
	
	var lifePercent = this.life/this.maxLife;
	//dessin de la barre de vie
	ctx.fillStyle = 'rgb(0, 0, 0)';
	ctx.fillRect(this.position.x - 2, (this.position.y - 25), this.width + 2, 12);
	ctx.fillStyle = 'rgb(' + (255 - Math.floor(255*lifePercent)) + ', ' + Math.floor(255*lifePercent) + ', 0)';
	ctx.fillRect(this.position.x - 1, (this.position.y - 24), lifePercent*this.width, 10);
	
	var manaPercent = this.mana/this.maxMana;
	//dessin de la barre de mana
	ctx.fillStyle = 'rgb(0, 0, 0)';
	ctx.fillRect(this.position.x - 2, (this.position.y - 10), this.width + 2, 7);
	ctx.fillStyle = 'rgb(' + (255 - Math.floor(255*manaPercent)) + ', 0, 255)';
	ctx.fillRect(this.position.x - 1, (this.position.y - 9), manaPercent*this.width, 5);
}
//
Character.prototype.takeHit = function(damage, broadcast){
	if(broadcast == undefined){
		broadcast = true;
	}
	if(broadcast == true){
		socket.emit("action", {action : "characters[getIndexId(characters, " + this.id + ")].takeHit(" + damage + ", false )"});
	}
	damage = damage - (this.strength + this.armor.armor);
	(damage  < 0 )? damage = 0 : damage = damage;
	this.life = this.life - damage;
	if(this.life < 0){
		this.life = 0;
	}
	//affichage dans l'interface
	refreshInterfaceAff();
}
//
Character.prototype.heal = function(heal, broadcast){
	if(broadcast == undefined){
		broadcast = true;
	}
	if(broadcast == true){
		socket.emit("action", {action : "characters[getIndexId(characters, " + this.id + ")].heal(" + heal + ", false )"});
	}
	this.life = this.life + heal;
	if(this.life > this.maxLife){
		this.life = this.maxLife;
	}
	//affichage dans l'interface
	refreshInterfaceAff();
}
//
Character.prototype.useMana = function(mana, broadcast){
	if(broadcast == undefined){
		broadcast = true;
	}
	if(broadcast == true){
		socket.emit("action", {action : "characters[getIndexId(characters, " + this.id + ")].useMana(" + mana + ", false )"});
	}
	this.mana = this.mana - mana;
	if(this.mana < 0){
		this.mana = 0;
	}
	//affichage dans l'interface
	refreshInterfaceAff();
}
//
Character.prototype.upMana = function(mana, broadcast){
	if(broadcast == undefined){
		broadcast = true;
	}
	if(broadcast == true){
		socket.emit("action", {action : "characters[getIndexId(characters, " + this.id + ")].upMana(" + mana + ", false )"});
	}
	this.mana = this.mana + mana;
	if(this.mana > this.maxMana){
		this.mana = this.maxMana;
	}
	//affichage dans l'interface
	refreshInterfaceAff();
}
//
Character.prototype.die = function(){

}
//
Character.prototype.teleport = function(x, y, broadcast){
	if(broadcast == undefined){
		broadcast = true;
	}
	if(broadcast == true){
		socket.emit("action", {action : "characters[getIndexId(characters, " + this.id + ")].teleport(" + x + ", " + y + ", false )"});
	}
	this.position.x = Math.floor(x);
	this.position.y = Math.floor(y);
}
//
Character.prototype.update = function(character, broadcast){ 
	if(broadcast == undefined){
		broadcast = true;
	}
	if(broadcast == true){//Si on broadcast on veut seulement effectuer la commande pour les autres joueurs
		character = JSON.stringify(character);
		socket.emit("action", {action : "characters[getIndexId(characters, " + this.id + ")].update(" + character + ", false)"});
	}
	else{
		
		this.name = character.name;
		//Visual
		this.urlSprite = character.urlSprite;
		this.urlImage = character.urlImage;
		this.width = character.width;
		this.height = character.height;
		this.canvasW = character.canvasW;
		this.canvasH = character.canvasH;
		this.canvasPos.x = character.canvasPos.x;
		this.canvasPos.y = character.canvasPos.y;

		//Features
		this.level = character.level;
		this.strength = character.strength;
		this.toughness = character.thougness;
		this.speed = character.speed;
		this.maxLife = character.maxLife;
		this.maxMana = character.maxMana;
		this.life = character.life;
		this.mana = character.mana;
	
		//Special
		this.keyboardIsAllowed = character.keyboardIsAllowed;
	
		//position
		this.position = {x:'', y:''};
	
		this.position.x = character.position.x;
		this.position.y = character.position.y;
	}
	
}
//Deplacement a la souris
Character.prototype.move = function(x, y, map, broadcast, activePlayer){
	
	var _this = this;
	
	if(broadcast == true){
		socket.emit("action", {action : "characters[getIndexId(characters, " + _this.id + ")].move(" + x + ", " + y + ", map, false, joueur)"});
	}
	
	//On vérifie qui est en train de bouger: Joueur actif ou autre joueur (sert pour l'affichage du chemin)
	var isMe;
	
	if(_this.id == activePlayer.id){
		isMe = true;
	}
	else{
		isMe = false;
	}
	
	//On recherche un chemin
	var path = map.findPath(_this.position.x, _this.position.y, x, y, isMe).slice(); //Bizaremment sans le slice qui permet de cloner un tableau, le path semple être lié dans tout les objets !!!
	
	//Si on a la même destination qu'avant, on arrete
	if(isEqualDestination(path)){
		return;
	}
	
	//Nouvelle targetPos
	refreshDestintaion(path);
	
	//On coupe l'animation existante
	cancelAnimationFrame(_this.requestAnimation);
	
	//Si les coordonnées sont les mêmes, ne pas bouger
	if(Math.round(_this.position.x) == x && Math.round(_this.position.y) == y){
		return 0;
	}
	
	//Compteur pour grande frame (nombre de point dans le path finding)
	var stepCounter = 1;
	
	//Compteur pour petite frame (entre une position du path finding et la prochaine)
	var speedCounter = 0;
	
	//Compteur animation sprite horizontal
	var spriteH = 0;
	
	//On lance l'animation
	CharacterAnimation(map);
	
	//On vérifie c'est moi qui bouge
	if(isMe == true){
		map.pathArray.shift(); //Supprime l'affichage du premier point du chemin
	}
	function CharacterAnimation(map){
		
		//Petite frame	
		speedCounter++;
		
		//Petite fonction pour l'impression de déplacement
		if(speedCounter%_this.speed == 0){
			spriteH = 0;
		}
		if(speedCounter%(Math.round(_this.speed/3)) == 0){
			spriteH = _this.width;
		}
		if(speedCounter%(2* (Math.round(_this.speed/3))) == 0){
			spriteH = 2 * _this.width;
		}
		//Modifier la position en x du sprite
		_this.canvasPos.x = spriteH;
					
		if(speedCounter%_this.speed == 0){
			//On vérifie c'est moi qui bouge
			if(isMe == true){
				map.pathArray.shift(); //Supprime l'affichage du chemin !
			}
			//Grande frame
			stepCounter ++;
		}
		
		//Return. Cette étape se retrouve après les compteurs pour aller jusqu'au bout
		if(stepCounter > (path.length - 1) && path.length != 0){
			//On demande quand même la position finale en cas de plantage
			//_this.updatePos(x, y);
			//On envoie la position finale aux autres utilisateurs
			socket.emit("action", {action : "characters[getIndexId(characters, " + _this.id + ")].updatePos(" + _this.position.x + ", " + _this.position.y + ", "  + _this.canvasPos.x + ", " + _this.canvasPos.y + ")"});			
			return;
		}
		
		var nextX = 0; 
		var nextY = 0; 
		
		//On vérifie que le chemin n'est pas vide, sinon on stoppe tout
		if(!path[stepCounter] || !path[stepCounter - 1]){
			return;
		}
		
		//Permet de détecter la direction par la suite
		var dirX = path[stepCounter][0] - path[stepCounter - 1][0];
		var dirY = path[stepCounter][1] - path[stepCounter - 1][1];
		
		//Point de départ du personnage
		var pathX = path[stepCounter - 1][0]*map.tileW;
		var pathY = path[stepCounter - 1][1]*map.tileH;
	
		//Peut servir
		var direction = "";
		
		//Detection de la direction et application de la formule (point de départ + petite frame)
		if(dirX == 0 && dirY > 0){
			direction = "S";
			_this.canvasPos.y = 0;
			nextX = pathX;
			nextY = pathY + (map.tileH * ((speedCounter%_this.speed)/_this.speed));
		}
		else if(dirX > 0 && dirY > 0){
			direction = "SE";
			_this.canvasPos.y = 2 * _this.height;
			nextX = pathX + ((map.tileW * ((speedCounter%_this.speed)/_this.speed)));
			nextY = pathY + ((map.tileH * ((speedCounter%_this.speed)/_this.speed)));
		}
		else if(dirX > 0 && dirY == 0){
			direction = "E";
			_this.canvasPos.y = 2 * _this.height;
			nextX = pathX + (map.tileW * ((speedCounter%_this.speed)/_this.speed));
			nextY = pathY;
		}
		else if(dirX > 0 && dirY < 0){
			direction = "NE";
			_this.canvasPos.y = 2 * _this.height;
			nextX = pathX + ((map.tileW * ((speedCounter%_this.speed)/_this.speed)));
			nextY = pathY - (map.tileH * ((speedCounter%_this.speed)/_this.speed));
		}
		else if(dirX == 0 && dirY < 0){
			direction = "N";
			_this.canvasPos.y = 3 * _this.height;
			nextX = pathX;
			nextY = pathY - (map.tileH * ((speedCounter%_this.speed)/_this.speed));
		}
		else if(dirX < 0 && dirY < 0){
			direction = "NO";
			_this.canvasPos.y = _this.height;
			nextX = pathX - (map.tileW * ((speedCounter%_this.speed)/_this.speed));
			nextY = pathY - (map.tileH * ((speedCounter%_this.speed)/_this.speed));
		}
		else if(dirX < 0 && dirY == 0){
			direction = "O";
			_this.canvasPos.y = _this.height;
			nextX = pathX - (map.tileW * ((speedCounter%_this.speed)/_this.speed));
			nextY = pathY;
		}
		else if(dirX < 0 && dirY > 0){
			direction = "SO";
			_this.canvasPos.y = _this.height;
			nextX = pathX - (map.tileW * ((speedCounter%_this.speed)/_this.speed));
			nextY = pathY + ((map.tileH * ((speedCounter%_this.speed)/_this.speed)));
		}
		
		//On attribut les données a notre objet
		_this.position.x = nextX;
		_this.position.y = nextY;
			
		//Tant qu'on ne dépasse pas la taille du tableau on relance l'animation
		if(stepCounter <= (path.length - 1) && path.length != 0){
			_this.requestAnimation = requestAnimationFrame(function(){ CharacterAnimation(map); })
 		}
		else{
			//On demande quand même la position finale en cas de plantage
			//_this.updatePos(x, y);
			
			//Nouvelle targetPos
			_this.isTargetingPosition.x = 0;
			_this.isTargetingPosition.y = 0;
			
			//On envoie la position finale aux autres utilisateurs
			socket.emit("action", {action : "characters[getIndexId(characters, " + _this.id + ")].updatePos(" + _this.position.x + ", " + _this.position.y + ", "  + _this.canvasPos.x + ", " + _this.canvasPos.y + ")"});
			return;
		}
	}; 
	
	function isEqualDestination(path){
		if(path[path.length - 1][0] == _this.isTargetingPosition.x && path[path.length - 1][1] == _this.isTargetingPosition.y){
			return true;
		}
		else{
			return false;
		}
	}
	
	function refreshDestintaion(path){
		_this.isTargetingPosition.x = path[path.length - 1][0];
		_this.isTargetingPosition.y = path[path.length - 1][1];
	}
}
//Deplacement au clavier
Character.prototype.keyBordMove = function(x, y, map, broadcast, activePlayer){
	
	if(this.keyboardIsAllowed == false){
		socket.emit("action", {action : "characters[getIndexId(characters, " + this.id + ")].updatePos(" + false + ", " + false + ", "  + this.canvasPos.x + ", " + this.canvasPos.y + ")"});
		return;
	}
	//envoie l'info au serveur
	if(broadcast == true){
		socket.emit("action", {action : "characters[getIndexId(characters, " + this.id + ")].keyBordMove(" + x + ", " + y + ", false, joueur)"});
	}
	
	//On coupe l'animation existante
	cancelAnimationFrame(this.requestAnimation);
	
	//Vérifie les limites de la carte
	if(x < 0){
		x = 0;
	}
	if(y < 0){
		y = 0;
	}
	if(x > (this.canvasW - this.width)){
		x = this.canvasW - this.width;
	}
	if(y > (this.canvasH - this.height)){
		y = this.canvasH - this.height;
	}
	this.move(x, y, map, broadcast, activePlayer);
}
//
Character.prototype.updatePos = function(posX, posY, canvX, canvY){
	//Met à jour la position finale
	if(	posX !== false && posY !== false){
		//stoppe l'animation en cours
		cancelAnimationFrame(this.requestAnimation);
		this.position.x = posX; 
		this.position.y = posY; 
	}
	if(canvX !== false && canvY !== false){
		this.canvasPos.x = canvX;
		this.canvasPos.y = canvY;
	}
}
//
Character.prototype.speak = function(texte, broadcast, c, w, h, t){
	//On broadcast ou non
	if(broadcast == undefined){
		broadcast = true;
	}
	if(broadcast == true){
		socket.emit("action", {action : "characters[getIndexId(characters, " + this.id + ")].speak(" + texte + ", false, " + c + ", " + w + ", " + h + " )"});
	}
	//Définition des styles de la bulle de dialogue
	//couleur
	if(c != undefined){
		this.sayBoxColor= c;
	}
	//largeur bulle
	if(w != undefined){
		this.sayBoxW= w;
	}
	//hauteur bulle
	if(h != undefined){
		this.sayBoxH = h;
	}
	//Durée
	if(t == undefined){
		t = 500;
	}
	//On supprime la bulle à la fin de la durée de la bulle
	var _this = this;
	_this.say = texte;
	setTimeout(function(){
		//réintialisation de la bulle
		_this.say = '';
	}, t);
}

/*------------------------ SPELL ------------------------*/
var spell_A = new Spell('lightning', 'img/spells/Thunder1.png', 2280, 200, 12, 25, 'cast');
//Event
var key_A_WasBinding = false;
//Quand on appuie sur A on charge le sort, si on réappuye, on le décharge
$(window).keydown(function(event){
	if(event.keyCode == 65){
		if(key_A_WasBinding == true){
			key_A_WasBinding = false;
			$('.' + spell_A.iconClass + ' .cmd').removeClass('yellowOpac');	
			joueur.isTargetingCast = 0;
			$(document).unbind('mousemove');
		}
		else{
			key_A_WasBinding = true;
			$('.' + spell_A.iconClass + ' .cmd').addClass('yellowOpac');
			joueur.isTargetingCast = spell_A.rangeCast;
			
			$(document).bind('mousemove', function(){
				joueur.cursorX = event.pageX;
				joueur.cursorY = event.pageY;
			});
		}
	}
});
$(window).click(function(event){
	//On check que le sort est chargé
	if(event.button != 2 && key_A_WasBinding == true){
		
		//Gestion canvas
	    canvas = document.getElementById("mon_canvas");
		$canvas = $("#mon_canvas");

		//Calcul des facteurs de décalage du à la taille du canvas différente de la taille de l'écran
		xFactor = window.innerWidth/canvas.width;
		yFactor = window.innerHeight/canvas.height;
		ctx = canvas.getContext("2d");
	
		var posX = event.pageX;
		var posY = event.pageY;
		posX /= xFactor;
		posY /= yFactor;

		spell_A.cast(ctx, Math.round(posX), Math.round(posY), joueur, joueur, 'spell_A', true);
		
		//On décharge le sort
		key_A_WasBinding = false;
		$(document).unbind('mousemove');
		$('.' + spell_A.iconClass + ' .cmd').removeClass('yellowOpac');
		joueur.isTargetingCast = 0;
	}
});

/*----------------------------Methodes spécifiques liés a Character---------------*/

//Trouve l'index dans le tableau en fonction de l'id
function getIndexId(characters, id){ 
	for(var i = 0; i < characters.length; i++){
		if(characters[i].id == id){
			return i;
		}
	}
	return null;
}