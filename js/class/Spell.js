function Spell(name, sprite, spriteW, spriteH, spriteFrames, animeSpeed, type){
	this.spellName = name;
	this.spellSprite = sprite;
	this.spellSpriteWidth = spriteW;
	this.spellSpriteHeight = spriteH;
	this.spellSpriteFrames = spriteFrames;
	this.joueurSprite = '';
	this.joueurSpriteWidth = 0;
	this.joueurSpriteHeight = 0;
	this.joueurSpriteFrames = 0;
	this.rangeCast = 300;
	this.rayon = 50;
	this.cd = 10;
	this.damage = 50;
	this.cost = 20;
	this.reloading = [];
	this.iconClass = 'spell_a';
	/*
	- def
	- aoe
	- cast
	- shoot
	*/
	this.type = type;
	
	//Animation
	this.requestAnimation = '';
	this.animeSpeed = animeSpeed;
	
	//Visual
	this.position = {x:'', y:''};
	this.position.x = 0;
	this.position.y = 0;
	
	this.canvasPos = {x:'', y:''};
	this.canvasPos.x = 0;
	this.canvasPos.y = 0;
}

Spell.prototype.cast = function(ctx, x, y, caster, target, spellName, broadcast){
	var _this = this;
	
	var portee = Math.sqrt( Math.floor((caster.position.x - x)*(caster.position.x - x)) + Math.floor((caster.position.y - y)*(caster.position.y - y)) );;
	
	//On vérifie la portée
	if(portee > _this.rangeCast){
		caster.speak('Pas à portée !', false);
		return;
	}
	//On vérifie le mana
	if(caster.mana < _this.cost){
		caster.speak('Plus de mana !', false);
		return;
	}
	//Si le sort est en cd
	if(jQuery.inArray( caster.id, _this.reloading) != -1){
		caster.speak('En recharge !', false);
		return;
	}
	//On broadcast aux autres
	if(broadcast == true){
		parseCaster = JSON.stringify(caster);
		socket.emit("action", {action : spellName + ".cast(ctx, " + x + ", " + y +", " + parseCaster + ", joueur, 'spell_A', false)"});
;	}
	else{
		//on réassigne les méthodes qui sont perdue dans le passage vers le serveur
		caster.useMana = Character.prototype.useMana;
	}
	_this.position.x = x;
	_this.position.y = y;

	//Hitbox et effet sur la cible
	var targetX = target.position.x;
	var targetY = target.position.y;
	
	//distance entre le spell et la cible
	var distanceST = Math.sqrt( Math.floor((target.position.x - x)*(target.position.x - x)) + Math.floor((target.position.y - y)*(target.position.y - y)) );
	if(distanceST <= _this.rayon){
		if(caster.id != target.id){
			target.takeHit(_this.damage);
		}
	}
	//On utilise la mana
	if(broadcast == true){
		caster.useMana(_this.cost);
	}
	else{
		caster.useMana(_this.cost, false);
	}
			
	//On lance l'animation
	_this.anime(ctx);

	//Si on est le joueur qui a lancé le sort
	if(caster.id == target.id){
		//compteur
		var cdCounter = _this.cd;
	
		//Element du dom a changer
		var spellClass = $('.' + _this.iconClass + ' .cmd');
		var cdClass = $('.' + _this.iconClass + ' .cd');
	
		//On met en cd
		_this.reloading.push(caster.id);
	
		spellClass.addClass("opac");
		cdClass.html(cdCounter);
	
		// Compte a rebours
		var cdInterval = setInterval(function(){
			cdCounter --;
			cdClass.html(cdCounter);
			if(cdCounter <= 0){
				spellClass.removeClass("opac");
				cdClass.html('');
			
				//On sort l'élément du cd
				var removeItem = caster.id;
				_this.reloading = jQuery.grep(_this.reloading, function(value) {
				  return value != removeItem;
				});
				//On finis l'intervale
				clearInterval(cdInterval);
			}
		}, 1000);
	}
}
Spell.prototype.draw = function(ctx){
	var img = new Image();
	img.src = this.spellSprite;
	ctx.drawImage(img, this.canvasPos.x, this.canvasPos.y, (this.spellSpriteWidth/this.spellSpriteFrames), this.spellSpriteHeight, this.position.x - ((this.spellSpriteWidth/this.spellSpriteFrames)/2), this.position.y - this.spellSpriteHeight, (this.spellSpriteWidth/this.spellSpriteFrames), this.spellSpriteHeight);
}
Spell.prototype.anime = function(ctx){
	
	var _this = this;
	var animeCounter = 0;
	var frameCounter = 0;
	var step = Math.round(_this.animeSpeed/_this.spellSpriteFrames);
	
	spellAnime();
	
	function spellAnime(){
		if(animeCounter%step == 0){
			frameCounter ++;
		}
		
		_this.canvasPos.x = frameCounter * Math.round(_this.spellSpriteWidth/_this.spellSpriteFrames);
		_this.draw(ctx);
		animeCounter++;
		if(animeCounter == _this.animeSpeed){
			return;
		}
		_this.requestAnimationFrame = requestAnimationFrame(spellAnime);
	}
}