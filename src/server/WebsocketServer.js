var socketIO = require('socket.io')
var config = require('./config')

var WebsocketServer = function(httpServer){
	var self = this;
	self.webSocket = null;
	
	// contains all the connected client sockets
	var clientSockets = {}

	var init = function(){
		
		logInfo('Setting up websockets...');
		self.webSocket = socketIO.listen(httpServer);
		self.webSocket.set('log level', 1);
		// create webSocketHandlers
		self.webSocketEvent = self.webSocket
		.of('/event')
		.on('connection', function(clientSocket){
			clientSockets[clientSocket.id] = clientSocket;
			logDebug('WS connection established');
			//@webSocket.sockets.send('New WebSocket Connection (to all)')
			//@webSocketEvent.send('New WebSocket Connection (to event subscribers)')
			//clientSocket.send('Hi new client!')
			clientSocket.on("EVENT", function(inputObj) {
				clientSocket.emit("EVENT", inputObj)	
			});

			clientSocket.on("MATCHUP", function(inputObj) {
				broadcastBoardUpdate();				
			});						
			
			clientSocket.on('disconnect', function(){
				logDebug('WS connection ended');
			});

			broadcastBoardUpdate();
		});
	}

	var broadcastBoardUpdate = function() {
		ratingState = {
			teams: [
				makeTeam("Team 1337"),
				makeTeam("Team tosser"),
				makeTeam("The tokens of fortune"),
				makeTeam("Team Albani"),
				makeTeam("Team FTW!"),
				makeTeam("..."),
				makeTeam("---")
			]
		};

		self.webSocketEvent.emit("RATINGUPDATE", ratingState);
	};

	var makeTeam = function(name) {
		return {
			name: name,
			rating: 1000
		};
	};

	return init();
}

module.exports = WebsocketServer;