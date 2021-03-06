function ScreenApplication($rootScope, $$websocketService){
	logInfo("Application initializing");

	// here we fetch config file from server
	$.getJSON("//event.netcompany.com:1337/config.json", function(config){
		$$websocketService.connect("{0}:{1}/event".format(config.wsUrl, config.wsPort));
		// tell the controllers that the communication is up
		$rootScope.broadcastEvent('COMMUNICATION_INITIALIZED', null);
	});

	logInfo("Application finished initializing");
}