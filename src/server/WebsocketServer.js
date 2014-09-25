var socketIO = require('socket.io')
var config = require('./config')
var RatingRepository = require('./RatingRepository');
var Elo = require('./Elo');

var WebsocketServer = function(httpServer){
	var self = this;
	self.webSocket = null;
	var _ratingRepo = new RatingRepository("set1");
	var _elo = new Elo();

	var broadcastUpdate = function(state) {		
		self.webSocketEvent.emit("RATINGUPDATE", state);
	};

	setInterval(function(){
		_ratingRepo.readRatings(function(ratings){
			broadcastUpdate(ratings);
		});
	}, 4000);
	
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

			clientSocket.on("MATCHUP", function(input) {
				registerMatchUp(input.team1, input.team2, input.winner, function(ratings){
					broadcastUpdate(ratings);					
				});				

			});						
			
			clientSocket.on('disconnect', function(){
				logDebug('WS connection ended');
			});

			_ratingRepo.readRatings(function(ratings){
				broadcastUpdate(ratings);
			});
		});
	}

	var registerMatchUp = function(team1, team2, winner, callback){
		try{
			// load ratings
			_ratingRepo.readRatings(function(ratings){
				// fetch team or create if new
				var team1Obj, team2Obj;
				// fetch team1
				var i = ratings.teams.indexOfProperty("name", team1);
				if( i < 0){
					team1Obj = createTeam(team1);
					ratings.teams.push(team1Obj);
				}
				else
					team1Obj = ratings.teams[i];
				
				// fetch team2
				i = ratings.teams.indexOfProperty("name", team2);
				if( i < 0){
					team2Obj = createTeam(team2);
					ratings.teams.push(team2Obj);
				}
				else
					team2Obj = ratings.teams[i];

				// apply points
				_elo.applyRating(team1Obj, team2Obj, winner);

				// save ratings
				_ratingRepo.updateRatings(ratings, function(){
					// inform subscribers
					callback(ratings);
				});
			});
			
		}
		catch(ex){
			//suppress
		}
		
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

//{team1: "team1name", team2: "team2name", winner: <0,1,2>}