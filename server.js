var http = require('http');
var md5 = require('MD5');
//On importe le fichier qui s'occupe de créé la map
var map = require('./class/Map.js');
//Include map ibject

httpServer = http.createServer(function(req, res){
	console.log("un utilisateur a regarder la page");
	res.end('Hello World');
});
httpServer.listen(1337);

var io = require('socket.io').listen(httpServer);

var users = [];
var servorCharacters = [];

io.sockets.on('connection', function(socket){
	/*Server is ONLINE*/
	console.log("new connected");
	
	socket.emit("updateCharactersAndMap", servorCharacters, map);
	
	socket.on('disconnect', function(){
		//on enleve le personnage qui se déconnecte du tableau serveur
		var index = servorCharacters.indexOf(socket.character);
		if (index > -1) {
		    servorCharacters.splice(index, 1);
		}
		//on renvoie la liste des personnages
		io.sockets.emit("deleteCharacter", socket.character);
	})
	
	//le client informe qu'un nouveau personnage a été créé
	socket.on("createNewCharacter", function(character){
		//assigne le personnage au socket actuel
		socket.character = character;
		//actualise le tableau serveur des perso
		servorCharacters.push(character);
		//Réenvoie le tableau des personnage a jour aux sockets
		socket.broadcast.emit("createCharacter", socket.character)
	})
	
	socket.on("action", function(array){
		socket.broadcast.emit("action", {action : array.action});
	})

});

/*
	//Lorsque l'on reçoit une actualisation d'un personnage, on le renvoie a tout les autres (on garde au cas ou)
	socket.on("actualize", function(character){
		socket.broadcast.emit("actualized", character);
	});
*/