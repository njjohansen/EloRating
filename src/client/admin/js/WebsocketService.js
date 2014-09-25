function WebsocketService($rootScope){
	self = this;
	self.webSocket = null;
	var _mainController = null;

	self.connect = function(connectionUrl){
		logDebug("Connecting to: {0}".format(connectionUrl));
		self.webSocket = io.connect(connectionUrl);
		self.webSocket
			.on("JOINED", function(player){
				$rootScope.broadcastEvent('JOINED', player);
			})			
			.on("EVENT", function(data){
				logDebug("Recv data from server: {0}".format(data));
			});
		logDebug("Connected to: {0}".format(connectionUrl));
	};

	//---------- events (invoked on server) -----------
	// this should be a list of all supported server events
	this.send = function(data){ // demo only, should be replaced
		logDebug("Sending data to server: {0}".format(data));
		self.webSocket.emit("EVENT", data);
	};
	
	this.love = function() {
		self.webSocket.emit("LOVE");
	};
}