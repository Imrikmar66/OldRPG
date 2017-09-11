var ARROW_ANIMATION_STEP = 10;

function ClickArrow(){
	this.img = new Image();
	this.img.width = 27;
	this.img.height = 27;
	this.img.src = "img/arrow.png";
	this.alpha = 1;
	
	//position
	this.position = {x:'', y:''};
	this.position.x = 0;
	this.position.y = -100;
	
	this.speed = 10;
	
	this.interval = null;
}

ClickArrow.prototype.drawAnimation = function(x, y, map){
	//x = Math.round(x/map.tileW);
	//y = Math.round(y/map.tileH);
	var _this = this;
	//supprime le dernier intervale pour réorienter la position
	clearInterval(_this.interval);

	//Set position
	_this.position.x = x - (_this.img.width/2);
	_this.position.y = y - 100;

	//Distance totale
	var yTotalDis = Math.round(y - (_this.position.y) - _this.img.height);
	
	//Temps d'animation (étapes)
	var stepToAnime = Math.round(yTotalDis / ARROW_ANIMATION_STEP);
	var stepCounter = 0;
	var yStep = yTotalDis / stepToAnime;
	var opacityCounter = 0;

	//Intervale d'animation
	_this.interval = setInterval(function(){
		if(stepCounter < stepToAnime){
			_this.position.y = Math.round(_this.position.y + yStep);	
		}
		stepCounter ++;		
		if(stepCounter >= stepToAnime){ //Si l'animation est finie
			//Gestion de l'opacité
			opacityCounter ++;
			_this.alpha = (60 - opacityCounter)/60;
			//fin de l'animation + opacité
			if(opacityCounter >= 60){
 				clearInterval(_this.interval);
				_this.alpha = 1;
				_this.position.y = -100;
			}
 		}
	}, _this.speed);
}
ClickArrow.prototype.draw = function(ctx, x, y){
	var _this = this;
	ctx.globalAlpha = _this.alpha;
	ctx.drawImage(_this.img, x, y, _this.img.width, _this.img.height);
	ctx.globalAlpha = 1;
}