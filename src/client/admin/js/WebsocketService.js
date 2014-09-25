function WebsocketService($rootScope){
	self = this;
	self.webSocket = null;
	var _mainController = null;

	self.connect = function(connectionUrl){
		logDebug("Connecting to: {0}".format(connectionUrl));
		self.webSocket = io.connect(connectionUrl);
		self.webSocket
			.on("RATINGUPDATE", function(data){
				$rootScope.broadcastEvent('RATINGUPDATE', data);
			})	
		logDebug("Connected to: {0}".format(connectionUrl));
	};

	//---------- events (invoked on server) -----------
	// this should be a list of all supported server events

	self.matchup = function(winner, loser, windex) {
		self.webSocket.emit("MATCHUP", {'team1':winner,'team2':loser,'winner':windex,'pw':'dlfj%/!F56jtsrelskj5'});
	};
}