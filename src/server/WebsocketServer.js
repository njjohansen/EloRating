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
			
			clientSocket.on("JOIN", function() {
				var player = makePlayer(clientSocket.id);
				addPlayer(player);
			});
			
			clientSocket.on("LEAVE", function() {
				if (hasJoined(clientSocket.id)) {
					removePlayer(clientSocket.id);
				}
			});

			clientSocket.on('EVENT', function(event){
				clientSocket.emit('EVENT', event);
			});
			
			clientSocket.on('MOVE', function(velocity) {
				var player = self.board.players[clientSocket.id];

			});
			
			clientSocket.on('disconnect', function(){
				if (hasJoined(clientSocket.id)) {
					removePlayer(clientSocket.id);
				}
				delete clientSockets[clientSocket.id];
				logDebug('WS connection ended');
			});

			broadcastBoardUpdate();
		});
	}

	var broadcastBoardUpdate = function() {
		//for (var socketId in clientSockets) {
		//	clientSockets[socketId].emit("BOARDUPDATE", self.board);
		//}
	};

	var makePlayer = function(playerid) {
		return {
			id: playerid,
			nickname: "_",
		};
	}

	var hasJoined = function(playerId) {
		//return self.board.players[playerId] != null;
	};

	var getPlayer = function(playerid) {
		//return self.board.players[playerid];
	};
	
	var addPlayer = function(player) {
		//self.board.players[player.id] = player;
		//broadcastBoardUpdate();
	};
	
	var removePlayer = function(playerId) {
		//delete self.board.players[playerId];
		//broadcastBoardUpdate();
		//logDebug("Removed player " + playerId);
	};

	return init();
}

module.exports = WebsocketServer;