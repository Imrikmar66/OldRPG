//On va utiliser un fichier de génération de map qui sera inclut sur le serveur
function Map(imgSrc, noWalkSrc, matrix){
	//Ici on va devoir creer des save src car le server node ne connais pas l'objet image! On réassignera des image au niveau du client
	this.saveImgSrc = imgSrc;
	this.saveNoWalkSrc = noWalkSrc;
	this.savePathImgSrc = 'img/greenPoint.png';
	//
	this.pathArray = [[]];
	this.tileW = 32;
	this.tileH = 32;
	this.width =  50; //On imagine des tuiles de 32x32, on en colle 50 * 30 -> tout les deplacement se feront a coups de 32
	this.height = 30;
	this.config = matrix;
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

var matrix = [
    [0, 0, 0, 1, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 1, 0, 0],
];

	//On créé une map
	var myMap = new Map('img/grass.png', 'img/tree.png', matrix);
	myMap.randomlyCreate();
	
	//On exporte pour le serveur
	exports.myMap = myMap;
	module.exports = myMap;