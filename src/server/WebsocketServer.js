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
				createTeam("1Team Albani"),
				createTeam("1Team FTW!"),
				createTeam("1Team arabiske nisser"),
				createTeam("1Team pilsner"),
				createTeam("2Team Albani"),
				createTeam("2Team FTW!"),
				createTeam("2Team arabiske nisser"),
				createTeam("2Team pilsner"),
				createTeam("3Team Albani"),
				createTeam("3Team FTW!"),
				createTeam("3Team arabiske nisser"),
				createTeam("3Team pilsner"),
				createTeam("4Team Albani"),				
				createTeam("4Team FTW!"),
				createTeam("4Team arabiske nisser"),
				createTeam("4Team pilsner"),
				createTeam("5Team Albani"),
				createTeam("5Team FTW!"),
				createTeam("5Team arabiske nisser"),
				createTeam("5Team pilsner")
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

			clientSocket.on("MATCHUP", function(input) {
				registerMatchUp(input.team1, input.team2, input.winner, function(){
					broadcastUpdate();					
				});				

			});						
			
			clientSocket.on('disconnect', function(){
				logDebug('WS connection ended');
			});

			broadcastUpdate();
		});
	}

	var registerMatchUp = function(team1, team2, winner, callback){
		try{
			// load ratings
			_ratingRepo.readRatings(function(ratings){
				if( typeof ratings == "undefined" || ratings == null)
					ratings = []; // initialize ratings
								
				// fetch team or create if new
				var team1Obj, team2Obj;
				// fetch team1
				var i = ratings.indexOfProperty("name", team1);
				if( i < 0){
					team1Obj = createTeam(team1);
					ratings.push(team1Obj);
				}
				else
					team1Obj = ratings[i];
				
				// fetch team2
				i = ratings.indexOfProperty("name", team2);
				if( i < 0){
					team2Obj = createTeam(team2);
					ratings.push(team2Obj);
				}
				else
					team2Obj = ratings[i];

				// apply points


				// save ratings
				_ratingRepo.updateRatings(ratings,function(){
					// inform subscribers
					callback();
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