function Map(imgSrc, noWalkSrc, matrix){
	this.img = new Image();
	this.img.src = imgSrc;
	this.noWalk = new Image();
	this.noWalk.src = noWalkSrc;
	this.pathImg = new Image();
	this.pathImg.src = 'img/greenPoint.png';
	this.pathArray = [[]];
	this.tileW = 32;
	this.tileH = 32;
	this.width =  50; //On imagine des tuiles de 32x32, on en colle 50 * 30 -> tout les deplacement se feront a coups de 32
	this.height = 30;
	this.config = matrix;
}

Map.prototype.draw = function(ctx, x, y){ //Pourquoi y avant i? a cause de la forme de la matrice, conforme pour le pathFinder
	for(var i =0; i<this.config.length; i++){ 
		for(var y =0; y<this.config[i].length; y++){
			ctx.drawImage(this.img, y*this.tileW, i*this.tileH, this.tileW, this.tileH); //Dessiner les tiles d'herbes
			if(this.config[i][y] == 1){
				ctx.drawImage(this.noWalk, y*this.tileW, i*this.tileH, this.tileW, this.tileH); //Dessiner les arbres
			}
		}
	}
		
	for(var i=0; i<this.pathArray.length; i++){ 
			ctx.drawImage(this.pathImg, this.pathArray[i][0]*this.tileW, this.pathArray[i][1]*this.tileH, this.tileW, this.tileH); 
			//Dessiner les tiles path rouges
	}
}
Map.prototype.randomlyCreate = function(){
	var matrix = [];
	for(var i =0; i<this.height; i++){ //création d'une carte aléatoirement sous forme d'une matrice colonnes/lignes
		matrix.push([]);
		for(var y =0; y<this.width; y++){
			if (Math.random() > 0.7){
				matrix[i].push(1);
			}
			else{
				matrix[i].push(0);
			}
		}
	}
	this.config = matrix;
}
Map.prototype.findPath = function(x, y, x2, y2, isMe){ //utilise la bibliotheque pathfinding.js pour trouver la bonne solution
	//On converti les x et y reçus (position souris) en 'case' pour utiliser le pathfinding
	x = Math.round(x/this.tileW);
	y = Math.round(y/this.tileH);
	
	x2 = Math.round(x2/this.tileW);
	y2 = Math.round(y2/this.tileH);

	//Cette fonction fonctionne grace au fichier pathfinding js intégré
	var grid = new PF.Grid(this.width, this.height, this.config);
	var finder = new PF.AStarFinder({
    	allowDiagonal: true
	});
	var path = finder.findPath(x, y, x2, y2, grid);
	
	//Si c'est le joueur actif qui a fais la demande
	if(isMe == true){
		//Vas nous servir pour l'affichage du chemin
		this.pathArray = path.slice(); //Bizaremment sans le slice qui permet de cloner un tableau, le path semple être lié dans tout les objets !!!
	}
	return path;
}