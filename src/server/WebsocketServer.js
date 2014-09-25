var socketIO = require('socket.io')
var config = require('./config')
var RatingRepository = require('./RatingRepository');

var WebsocketServer = function(httpServer){
	var self = this;
	self.webSocket = null;
	var _ratingRepo = new RatingRepository("set1");

	var broadcastUpdate = function(state) {
		ratingState = {
			teams: [
				createTeam("Team 1337"),
				createTeam("Team tosser"),
				createTeam("The tokens of fortune"),
				createTeam("Team Albani"),
				createTeam("Team FTW!"),
				createTeam("Team arabiske nisser"),
				createTeam("Team pilsner"),
				createTeam("Team pilsner"),
				createTeam("Team 1337"),
				createTeam("Team tosser"),
				createTeam("The tokens of fortune"),
				createTeam("Team Albani"),
				createTeam("Team FTW!"),
				createTeam("Team arabiske nisser"),
				createTeam("Team pilsner"),
				createTeam("Team pilsner"),
				createTeam("Team 1337"),
				createTeam("Team tosser"),
				createTeam("The tokens of fortune"),
				createTeam("Team Albani"),
				createTeam("Team FTW!"),
				createTeam("Team arabiske nisser"),
				createTeam("Team pilsner"),
				createTeam("Team pilsner"),
				createTeam("Team 1337"),
				createTeam("Team tosser"),
				createTeam("The tokens of fortune"),
				createTeam("Team Albani"),
				createTeam("Team FTW!"),
				createTeam("Team arabiske nisser"),
				createTeam("Team pilsner"),
				createTeam("Team pilsner")
			]
		};

		self.webSocketEvent.emit("RATINGUPDATE", ratingState);
	};

	setInterval(function(){
		broadcastUpdate();
	},4000);
	
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
				clientSocket.emit("EVENT", inputObj);	
			});

			clientSocket.on("MATCHUP", function(inputObj) {
				broadcastUpdate();				
			});						
			
			clientSocket.on('disconnect', function(){
				logDebug('WS connection ended');
			});

			broadcastUpdate();
		});
	}

	var registerMatchUp = function(team1, team2, winner){
		try{
			// load ratings
			_ratingRepo.readRatings(function(ratings){
				if( typeof ratings == "undefined" || ratings == null)
					ratings = []; // initialize ratings


			});
			// create teams if new
			// apply points
			// save ratings
			// broadcast ratings
		}
		catch(ex){
			//suppress
		}
		broadcastUpdate();
	};

	var createTeam = function(name) {
		return {
			name: name,
			rating: 1000,
			wins: 0,
			losses: 0
		};
	};

	return init();
}

module.exports = WebsocketServer;

//{team1: "team1name", team2: "team2name", winner: }