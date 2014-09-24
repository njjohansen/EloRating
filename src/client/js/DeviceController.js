function DeviceController($rootScope, $scope, $$deviceApplication, $$websocketService){
	$scope.$on("COMMUNICATION_INITIALIZED", function(event, data){
		// the communication is up, let's send something
		$$websocketService.send("Hej");
	});

	$scope.$on("JOINED", function(event, player){

	});
	
	$scope.$on("BOARDUPDATE", function(event, boardState) {
		if ($scope.playerid != null) {
			var player = boardState.players[$scope.playerid];
			$scope.points = player.points;
		}
	});
	
	$scope.keydown = function($event){		
		$scope.$broadcast("keydown", $event.keyCode);
	};

	$rootScope.broadcastEvent = function(eventname, args){
		//logDebug("Broadcasting controller event: '{0}'".format(eventname));
		$rootScope.$broadcast(eventname, args);
		$rootScope.$digest();
	}
}